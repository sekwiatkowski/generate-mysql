const {last} = require('compose-functions')
const {concat} = require('compose-functions')
const {first} = require('compose-functions')
const {pair} = require('compose-functions')
const {safeGetFrom} = require('compose-functions')
const {foldOption} = require('compose-functions')
const {joinWithNewline} = require('compose-functions')
const {mapOption} = require('compose-functions')
const {foldPair} = require('compose-functions')
const {mapSecond} = require('compose-functions')
const {map} = require('compose-functions')
const {fold} = require('compose-functions')
const {constant} = require('compose-functions')
const {appendTo} = require('compose-functions')

function generateColumn(side) {
    return pair('t' + (side.table + 1) + '.' + side.column)([])
}

function generateValue(side) {
    return pair(`$${side.index+1}`)([ side.value ])
}

function generateSide(side) {
    switch (side.kind) {
        case 'column':
            return generateColumn(side)
        case 'value':
            return generateValue(side)
    }
}

function generatePredicate(predicate) {
    switch (predicate.kind) {
        case 'equals':
            const {left, right} = predicate
            const [leftSql, leftParameters] = generateSide(left)
            const [rightSql, rightParameters] = generateSide(right)
            return [`${leftSql} = ${rightSql}`, leftParameters.concat(rightParameters) ]
    }
}

function generateWhere(predicate) {
    const [sql, parameters] = generatePredicate(predicate)
    return [`WHERE ${sql}`, parameters]
}

function generateSelect(select) {
    return pair(`SELECT ${select}`)([])
}

function generateFrom(from) {
    return pair(`FROM ${from} t1`)([])
}

const keywordGenerators = [
    [generateSelect, 'select'],
    [generateFrom, 'from'],
    [generateWhere, 'where']
]

function generateSql(query) {
    /* [ [ generateSelect, some(select) ],
         [ generateFrom, some(from) ],
         [ generateWhere, maybe(where ]  */
    const withInput = map(mapSecond(safeGetFrom(query))) (keywordGenerators)

    /* [ some('SELECT ...')
         some('FROM ...')
         maybe('WHERE ...') ] */
    const generated = map(foldPair(mapOption)) (withInput)

    /* [ 'SELECT ...',
         'FROM ...',
         ('WHERE ...') ] */
    const fragments = concatOptions(generated)

    const sqlFragments = map(first)(fragments)
    const parameters = fold(concat)([])(map(last)(fragments))

    return [ joinWithNewline(sqlFragments), parameters ]
}

module.exports = {
    generateSql
}