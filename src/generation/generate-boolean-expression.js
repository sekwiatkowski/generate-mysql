import {generateComparison} from './generate-comparison'
import {generateAnd, generateOr, generateIsNull, generateIsNotNull} from './generate-predicate'

function generateBooleanExpression(isRoot) {
    return (expression, useAlias = true) => {
        switch (expression.kind) {
            case 'is null':
                return [generateIsNull(expression), []]
            case 'is not null':
                return [generateIsNotNull(expression), []]
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