import {concat, join, map, surroundWithParentheses, unzip} from 'standard-functions'
import {generateInnerBooleanExpression} from './generate-boolean-expression'

function generateLogicalOperation(operator) {
    return (isRoot, { values }) => {
        const generatedValues = map(generateInnerBooleanExpression)(values)

        const [valueSql, valueParameters] = unzip(generatedValues)

        const logicalSql = join(` ${operator} `) (valueSql)
        const logicalParameters = concat(valueParameters)

        return [isRoot ? logicalSql : surroundWithParentheses(logicalSql), logicalParameters]
    }
}

export const generateAnd = generateLogicalOperation('AND')
export const generateOr = generateLogicalOperation('OR')