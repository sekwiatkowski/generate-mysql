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
    toString,
    surroundWithDoubleQuotes,
    surroundWithParentheses, flatten
} from 'compose-functions'

const generateList = compose(joinWithCommaSpace, surroundWithParentheses)

function serializeParameter(p) {
    return p instanceof Date ? p.toISOString() : p
}

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
            const argumentLists = map(generateList) (withDollarSign)

            const fragments = [
                'INSERT INTO',
                tableName,
                columnList,
                'VALUES',
                joinWithCommaSpace(argumentLists)
            ]

            const sql = joinWithSpace(fragments)

            const parameters = flatten(rows)

            const serializedParameters = map(serializeParameter)(parameters)

            return pair(sql) (serializedParameters)
        }
    }
}