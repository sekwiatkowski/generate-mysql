const {surroundWithDoubleQuotes} = require('compose-functions')
const {pair} = require('compose-functions')
const {flatMap} = require('compose-functions')
const {identity} = require('compose-functions')
const {surroundWithParentheses} = require('compose-functions')
const {joinWithSpace} = require('compose-functions')
const {joinWithCommaSpace} = require('compose-functions')
const {prepend} = require('compose-functions')
const {applyPairTo} = require('compose-functions')
const {pairBy} = require('compose-functions')
const {add} = require('compose-functions')
const {length} = require('compose-functions')
const {multiply} = require('compose-functions')
const {compose} = require('compose-functions')
const {map} = require('compose-functions')
const {range} = require('compose-functions')
const {properties} = require('compose-functions')
const {keys} = require('compose-functions')
const {toString} = require('compose-functions')

const generateList = compose(joinWithCommaSpace, surroundWithParentheses)

function generateInsert(tableName) {
    return propertyNamesToColumnNames => {
        const getAllProperties = properties(keys(propertyNamesToColumnNames))

        const columnNames = getAllProperties (propertyNamesToColumnNames)
        const escapedColumnNames = map(surroundWithDoubleQuotes)(columnNames)
        const columnList = generateList(escapedColumnNames)

        const numberOfColumns = length(columnNames)

        return objs => {
            const numberOfRows = length(objs)
            const rows = map(getAllProperties) (objs)

            const indices = range(0) (numberOfRows)
            const starts = map(compose(multiply(numberOfColumns), add(1))) (indices)
            const ranges = map(compose(pairBy(add(numberOfColumns)), applyPairTo(range))) (starts)
            const withDollarSign = map(map(compose(toString, prepend('$')))) (ranges)
            const parameterLists = map(generateList) (withDollarSign)

            const fragments = [
                'INSERT INTO',
                tableName,
                columnList,
                'VALUES',
                joinWithCommaSpace(parameterLists)
            ]

            const sql = joinWithSpace(fragments)
            const parameters = flatMap(identity)(rows)

            return pair(sql) (parameters)
        }
    }
}

module.exports = {
    generateInsert
}