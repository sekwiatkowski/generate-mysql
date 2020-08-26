const {fold} = require('compose-functions')
const {betweenPair} = require('compose-functions')
const {maybeUndefined} = require('compose-functions')
const {onlyIf} = require('compose-functions')
const {joinWithSpace} = require('compose-functions')
const {mapFirst} = require('compose-functions')
const {flipPair} = require('compose-functions')
const {compose} = require('compose-functions')
const {mapEntries} = require('compose-functions')
const {some} = require('compose-functions')
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

function generateTableAlias(index) {
    return `t${index + 1}`
}

function generateColumn({tableIndex, column}) {
    return `${generateTableAlias(tableIndex)}.${column}`
}

function generateValue({parameterIndex, value}) {
    return pair(`$${parameterIndex + 1}`)([ value ])
}

function generateSide(side) {
    switch (side.kind) {
        case 'column':
            return pair(generateColumn(side))([])
        case 'value':
            return generateValue(side)
    }
}

function generateComparison({kind, left, right}) {
    switch (kind) {
        case 'equals':
            const [leftSql, leftParameters] = generateSide(left)
            const [rightSql, rightParameters] = generateSide(right)
            return [`${leftSql} = ${rightSql}`, leftParameters.concat(rightParameters) ]
    }
}

/*
    someProperty: { tableIndex: 0, column: 'some_column', kind: 'column' }

    [ 'someProperty', { tableIndex: 0, column: 'some_column', kind: 'column' } ]

    [ { tableIndex: 0, column: 'some_column', kind: 'column' }, 'someProperty' ]

    [ 't1.some_column', 'someProperty' ]

    [ 't1.some_column', 'AS', 'someProperty' ]
 */
const generateEntry = compose(flipPair, mapFirst(generateColumn), betweenPair('AS'), joinWithSpace)

function generateMap(obj) {
    return mapEntries(generateEntry)(obj)
}

function generateSelect(select) {
    return `SELECT ${select === '*' ? '*' : generateMap(select)}`
}

function generateFrom(from) {
    return `FROM ${from} ${generateTableAlias(0)}`
}

function generateWhere(comparison) {
    const [sql, parameters] = generateComparison(comparison)
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
    [generateJoins, 'joins'],
    [generateWhere, 'where'],
    [generateOrderBy, 'orderBy']
]

function generateJoin({ otherTable, comparison }) {
    const [comparisonSql, parameters] = generateComparison(comparison)

    const sqlFragments = [
        'INNER JOIN',
        otherTable.name,
        generateTableAlias(otherTable.index),
        'ON',
        comparisonSql
    ]

    const sql = joinWithSpace(sqlFragments)

    return [sql, parameters]
}

function generateJoins(joins) {
    const items = map(generateJoin)(joins)

    return fold
        (([accSql, accParameters], [joinSql, joinParameters]) => [accSql + joinSql, accParameters.concat(joinParameters)])
        (['', []])
        (items)
}

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

const ensurePair = onlyIf(isString) (pairWith([]))

function generateParameterlessQuery({ select, from, orderBy }) {
    const selectSql = some(generateSelect(select))
    const fromSql = some(generateFrom(from))
    const orderBySql = mapOption(generateOrderBy)(maybeUndefined(orderBy))

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