import {generateComparison} from './generate-comparison'
import {generateAnd, generateOr} from './generate-logical-operation'
import {generateIsNull} from './generate-function-invocation'

function generateBooleanExpression(isRoot) {
    return (expression, useAlias = true) => {
        switch (expression.kind) {
            case 'isnull':
                return [generateIsNull(expression), []]
            case 'equals':
                return generateComparison(expression, useAlias)
            case 'and':
                return generateAnd(isRoot, expression)
            case 'or':
                return generateOr(isRoot, expression)
        }
    }
}

export const generateRootBooleanExpression = generateBooleanExpression(true)
export const generateInnerBooleanExpression = generateBooleanExpression(false)