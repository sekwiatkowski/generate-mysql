import {
    add,
    applyPairTo,
    compose,
    flatMap,
    identity,
    joinWithCommaSpace,
    joinWithSpace,
    keys,
    length,
    map, multiply,
    pair,
    pairBy,
    prepend,
    properties,
    range,
    surroundWithDoubleQuotes,
    surroundWithParentheses
} from 'compose-functions'

const generateList = compose(joinWithCommaSpace, surroundWithParentheses)

export function generateInsert(tableName) {
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