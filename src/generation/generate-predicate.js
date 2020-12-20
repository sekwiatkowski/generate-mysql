import {generateComparison} from './generate-comparison'
import {concat, join, map, unzip} from 'standard-functions'

function generateLogicalOperation(operator) {
    return ({ values }) => {
        const generatedValues = map(generatePredicate)(values)

        const [valueSql, valueParameters] = unzip(generatedValues)

        const logicalSql = join(` ${operator} `) (valueSql)
        const logicalParameters = concat(valueParameters)

        return [logicalSql, logicalParameters]
    }
}

const generateAnd = generateLogicalOperation('AND')
const generateOr = generateLogicalOperation('OR')

export default function generatePredicate(predicate, useAlias = true) {
    switch (predicate.kind) {
        case 'equals':
            return generateComparison(predicate, useAlias)
        case 'and':
            return generateAnd(predicate)
        case 'or':
            return generateOr(predicate)
    }
}