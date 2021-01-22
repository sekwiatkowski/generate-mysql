import {concat, join, map, surroundWithParentheses, unzip} from 'standard-functions'
import {generateInnerBooleanExpression} from './generate-boolean-expression'
import generateColumnAccess from './generate-column-access'

function generateUnaryPredicate(operator) {
    return expression => {
        const columnAccess = generateColumnAccess(expression.column)
        return `${columnAccess} ${operator}`
    }
}

export const generateIsNull = generateUnaryPredicate('IS NULL')
export const generateIsNotNull = generateUnaryPredicate('IS NOT NULL')

function generateNAryPredicate(operator) {
    return (isRoot, { values }) => {
        const generatedValues = map(generateInnerBooleanExpression)(values)

        const [valueSql, valueParameters] = unzip(generatedValues)

        const logicalSql = join(` ${operator} `) (valueSql)
        const logicalParameters = concat(valueParameters)

        return [isRoot ? logicalSql : surroundWithParentheses(logicalSql), logicalParameters]
    }
}

export const generateAnd = generateNAryPredicate('AND')
export const generateOr = generateNAryPredicate('OR')