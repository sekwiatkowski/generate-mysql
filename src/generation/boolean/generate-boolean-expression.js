import {generateComparison} from './generate-comparison'
import {generateAnd, generateOr} from './generate-nary-predicate'
import {generateIsNotNull, generateIsNull} from './generate-unary-predicate'
import {generateIn} from './generate-in'

function generateBooleanExpression(isRoot) {
    return useAlias =>
        expression => {
            switch (expression.kind) {
                case 'in':
                    return generateIn(useAlias) (expression)
                case 'is null':
                    return generateIsNull(useAlias) (expression)
                case 'is not null':
                    return generateIsNotNull(useAlias) (expression)
                case 'equals':
                    return generateComparison(useAlias) (expression)
                case 'and':
                    return generateAnd(isRoot) (useAlias) (expression)
                case 'or':
                    return generateOr(isRoot) (useAlias) (expression)
            }
        }
}

export const generateRootBooleanExpression = generateBooleanExpression(true)
export const generateInnerBooleanExpression = generateBooleanExpression(false)