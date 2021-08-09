import {
    compose,
    concat,
    fill,
    first,
    flatten,
    joinWithCommaSpace,
    joinWithNewline,
    joinWithSpace,
    keys,
    length,
    map,
    properties,
    surroundWithParentheses
} from 'standard-functions'

const generateList = compose(joinWithCommaSpace, surroundWithParentheses)

function generateStoreColumns(statement) {
    return tableName => columnNames => {
        const columnList = generateList(columnNames)

        return [
            `${statement} INTO`,
            tableName,
            columnList
        ]
    }
}

const generateInsertColumns = generateStoreColumns('INSERT')

export function generateInsertSelect(tableName) {
    return mapping => query => {
        const relevantProperties = keys(query.statement.select)
        const getColumnNames = properties(relevantProperties)
        const columnNames = getColumnNames(mapping)

        const insertSql = generateInsertColumns(tableName) (columnNames)

        const [selectSql, selectParameters] = query.generate(false)

        return [joinWithNewline(insertSql, selectSql), selectParameters]

    }
}

function generateStore(statement) {
    return tableName => propertyNamesToColumnNames => {
        const allProperties = keys(propertyNamesToColumnNames)
        const getAllProperties = properties(allProperties)
        const columnNames = getAllProperties(propertyNamesToColumnNames)

        const firstPart = generateStoreColumns(statement) (tableName) (columnNames)

        return objs => {
            const rows = map(getAllProperties) (objs)

            const firstObj = first(objs)
            const numberOfRows = length(objs)
            const numberOfCells = length(keys(firstObj))

            const questionMarks = fill('?') (numberOfCells)
            const valuesExpression = generateList(questionMarks)
            const listOfQuestionMarkLists = fill(valuesExpression) (numberOfRows)
            const listOfValueExpressions = joinWithCommaSpace(listOfQuestionMarkLists)

            const secondPart = [
                'VALUES',
                listOfValueExpressions
            ]

            const sql = joinWithSpace(concat(firstPart, secondPart))

            const parameters = flatten(rows)

            return [sql, parameters]
        }
    }
}

export const generateInsert = generateStore('INSERT')
export const generateReplace = generateStore('REPLACE')