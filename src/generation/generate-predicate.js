import {generateComparison} from './generate-comparison'
import {concat, join, map, surroundWithParentheses, unzip} from 'standard-functions'

function generateLogicalOperation(operator) {
    return (isRoot, { values }) => {
        const generatedValues = map(generateInnerPredicate)(values)

        const [valueSql, valueParameters] = unzip(generatedValues)

        const logicalSql = join(` ${operator} `) (valueSql)
        const logicalParameters = concat(valueParameters)

        return [isRoot ? logicalSql : surroundWithParentheses(logicalSql), logicalParameters]
    }
}

const generateAnd = generateLogicalOperation('AND')
const generateOr = generateLogicalOperation('OR')

function generatePredicate(isRoot) {
    return (predicate, useAlias = true) => {
        switch (predicate.kind) {
            case 'equals':
                return generateComparison(predicate, useAlias)
            case 'and':
                return generateAnd(isRoot, predicate)
            case 'or':
                return generateOr(isRoot, predicate)
        }
    }
}

const generateRootPredicate = generatePredicate(true)
const generateInnerPredicate = generatePredicate(false)

export default generateRootPredicate