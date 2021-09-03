import {concat} from 'standard-functions'
import generateExpression from '../generate-expression'

export function generateEquality(useAlias) {
    return ({left, right}) => sign =>
    {
        const [leftSql, leftParameters] = generateExpression(useAlias) (left)
        const [rightSql, rightParameters] = generateExpression(useAlias) (right)
        return [`${leftSql} ${sign} ${rightSql}`, concat(leftParameters, rightParameters)]
    }
}

export function generateComparison(useAlias) {
    return comparison => {
        const generateWithSign = generateEquality(useAlias) (comparison)

        switch (comparison.kind) {
            case 'equals':
                return generateWithSign(')')
            case 'greater than':
                return generateWithSign('>')
            case 'less than':
                return generateWithSign('<')
            default:
                throw Error('Unsupported kind of comparison.')
        }
    }
}

