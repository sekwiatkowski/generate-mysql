import {concat, join, map, surroundWithParentheses, unzip} from 'standard-functions'
import {generateInnerBooleanExpression} from './generate-boolean-expression'

function generateNAryPredicate(operator) {
    return isRoot => useAlias => ({ values }) => {
        const generatedValues = map(generateInnerBooleanExpression(useAlias)) (values)

        const [valueSql, valueParameters] = unzip(generatedValues)

        const logicalSql = join(` ${operator} `) (valueSql)
        const logicalParameters = concat(valueParameters)

        return [isRoot ? logicalSql : surroundWithParentheses(logicalSql), logicalParameters]
    }
}

export const generateAnd = generateNAryPredicate('AND')
export const generateOr = generateNAryPredicate('OR')