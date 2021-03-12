import {concat} from 'standard-functions'
import generateExpression from '../generate-expression'

export function generateEquality(useAlias) {
    return ({left, right}) =>
    {
        const [leftSql, leftParameters] = generateExpression(useAlias) (left)
        const [rightSql, rightParameters] = generateExpression(useAlias) (right)
        return [`${leftSql} = ${rightSql}`, concat(leftParameters, rightParameters)]
    }
}

export function generateComparison(useAlias) {
    return comparison => {
        switch (comparison.kind) {
            case 'equals':
                return generateEquality(useAlias) (comparison)
            default:
                throw Error('Unsupported kind of comparison.')
        }
    }
}

