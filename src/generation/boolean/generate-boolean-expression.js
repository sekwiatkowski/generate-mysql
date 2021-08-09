import {generateComparison} from './generate-comparison'
import {generateAnd, generateOr} from './generate-nary-predicate'
import {generateIsNotNull, generateIsNull} from './generate-unary-predicate'
import generateIn from './generate-in'
import generateColumnAccess from '../access/generate-column-access'

function generateBooleanExpression(isRoot) {
    return useTableAlias =>
        expression => {
            switch (expression.kind) {
                case 'column':
                    return generateColumnAccess(useTableAlias) (expression)
                case 'in':
                    return generateIn(useTableAlias) (expression)
                case 'is null':
                    return generateIsNull(useTableAlias) (expression)
                case 'is not null':
                    return generateIsNotNull(useTableAlias) (expression)
                case 'equals':
                    return generateComparison(useTableAlias) (expression)
                case 'and':
                    return generateAnd(isRoot) (useTableAlias) (expression)
                case 'or':
                    return generateOr(isRoot) (useTableAlias) (expression)
            }
        }
}

export const generateRootBooleanExpression = generateBooleanExpression(true)
export const generateInnerBooleanExpression = generateBooleanExpression(false)