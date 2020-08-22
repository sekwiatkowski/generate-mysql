const {fromUndefinable} = require('compose-functions')
const {some} = require('compose-functions')
const {when} = require('compose-functions')
const {pairWith} = require('compose-functions')
const {isString} = require('compose-functions')
const {flatten} = require('compose-functions')
const {invertPairs} = require('compose-functions')
const {safePropertyOf} = require('compose-functions')
const {concatOptions} = require('compose-functions')
const {pair} = require('compose-functions')
const {joinWithNewline} = require('compose-functions')
const {mapOption} = require('compose-functions')
const {foldPair} = require('compose-functions')
const {mapSecond} = require('compose-functions')
const {map} = require('compose-functions')

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
    return `SELECT ${select}`
}

function generateFrom(from) {
    return `FROM ${from} t1`
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
    return `ORDER BY ${generateSortExpression(expr)}`
}

const queryGenerators = [
    [generateSelect, 'select'],
    [generateFrom, 'from'],
    [generateWhere, 'where'],
    [generateOrderBy, 'orderBy']
]

function generateQueryFragments(query) {
    /* [ [ generateSelect, some(select) ],
         [ generateFrom, some(from) ],
         [ generateWhere, maybe([where, parameters]) ]  */
    const withInput = map(mapSecond(safePropertyOf(query))) (queryGenerators)

    /* [ some('SELECT ...'])
         some('FROM ...'])
         maybe([['WHERE ...', parameters]) ] */
    const generated = map(foldPair(mapOption)) (withInput)

    /* [ 'SELECT ...',
         'FROM ...',
         ['WHERE ...', parameters] ] */
    const fragments = concatOptions(generated)

    return fragments
}

const ensurePair = when(isString) (pairWith([]))

function generateParameterlessQuery({ select, from, orderBy }) {
    const selectSql = some(generateSelect(select))
    const fromSql = some(generateFrom(from))
    const orderBySql = mapOption(generateOrderBy)(fromUndefinable(orderBy))

    return joinWithNewline(concatOptions([selectSql, fromSql, orderBySql]))
}

function generateQuery(query) {
    const fragments = generateQueryFragments(query)

    const ensuredPairs = map(ensurePair)(fragments)

    const [sqlFragments, parameterFragments] = invertPairs(ensuredPairs)

    const sql = joinWithNewline(sqlFragments)
    const parameters = flatten(parameterFragments)

    return [sql, parameters]
}


module.exports = {
    generateQuery,
    generateParameterlessQuery
}