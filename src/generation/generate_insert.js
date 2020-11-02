import {
    compose,
    fill,
    first,
    flatten,
    joinWithCommaSpace,
    joinWithSpace,
    keys,
    length,
    map,
    pair,
    properties,
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

        return objs => {
            const rows = map(getAllProperties) (objs)

            const firstObj = first(objs)
            const numberOfRows = length(objs)
            const numberOfCells = length(keys(firstObj))

            const questionMarks = fill('?') (numberOfCells)
            const listOfQuestionMark = joinWithCommaSpace(questionMarks)
            const valuesExpression = surroundWithParentheses(listOfQuestionMark)
            const listOfQuestionMarkLists = fill(valuesExpression) (numberOfRows)
            const listOfValueExpressions = joinWithCommaSpace(listOfQuestionMarkLists)

            const fragments = [
                'INSERT INTO',
                tableName,
                columnList,
                'VALUES',
                listOfValueExpressions
            ]

            const sql = joinWithSpace(fragments)

            const parameters = flatten(rows)

            return [sql, parameters]
        }
    }
}