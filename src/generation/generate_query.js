const {safePropertyOf} = require('compose-functions')
const {concatOptions} = require('compose-functions')
const {last} = require('compose-functions')
const {concat} = require('compose-functions')
const {first} = require('compose-functions')
const {pair} = require('compose-functions')
const {joinWithNewline} = require('compose-functions')
const {mapOption} = require('compose-functions')
const {foldPair} = require('compose-functions')
const {mapSecond} = require('compose-functions')
const {map} = require('compose-functions')
const {fold} = require('compose-functions')

function generateColumn({tableIndex, column}) {
    return `t${tableIndex + 1}.${column}`
}

function generateValue({index, value}) {
    return pair(`$${index+1}`)([ value ])
}

function generateSide(side) {
    switch (side.kind) {
        case 'column':
            return pair(generateColumn(side))([])
        case 'value':
            return generateValue(side)
    }
}

function generatePredicate({kind, left, right}) {
    switch (kind) {
        case 'equals':
            const [leftSql, leftParameters] = generateSide(left)
            const [rightSql, rightParameters] = generateSide(right)
            return [`${leftSql} = ${rightSql}`, leftParameters.concat(rightParameters) ]
    }
}

function generateSelect(select) {
    return pair(`SELECT ${select}`)([])
}

function generateFrom(from) {
    return pair(`FROM ${from} t1`)([])
}

function generateWhere(predicate) {
    const [sql, parameters] = generatePredicate(predicate)
    return [`WHERE ${sql}`, parameters]
}

function generateSortExpression(expr) {
    const column = generateColumn(expr)
    return `${column} ${expr.direction}`
}

function generateOrderBy(expr) {
    return pair(`ORDER BY ${generateSortExpression(expr)}`)([])
}

const queryGenerators = [
    [generateSelect, 'select'],
    [generateFrom, 'from'],
    [generateWhere, 'where'],
    [generateOrderBy, 'orderBy']
]

function generateQuery(query) {
    /* [ [ generateSelect, some(select) ],
         [ generateFrom, some(from) ],
         [ generateWhere, maybe(where ]  */
    const withInput = map(mapSecond(safePropertyOf(query))) (queryGenerators)

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


module.exports = { generateQuery }