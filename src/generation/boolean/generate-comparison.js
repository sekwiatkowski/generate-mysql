import generateColumnExpression from '../generate-column-expression'
import {concat} from 'standard-functions'
import {generateValue, isNullableValue} from '../generate-value'

function generateSide(useAlias) {
    return side => isNullableValue(side)
        ? generateValue(side)
        : generateColumnExpression(useAlias) (side)
}

export function generateEquality(useAlias) {
    return ({left, right}) =>
    {
        const [leftSql, leftParameters] = generateSide(useAlias) (left)
        const [rightSql, rightParameters] = generateSide(useAlias) (right)
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

