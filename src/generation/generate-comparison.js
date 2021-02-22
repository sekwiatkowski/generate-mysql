import generateColumnExpression from './generate-column-expression'
import {concat, isBoolean, isNull, isNumber, isString} from 'standard-functions'

function generateValue(value) {
    return ['?', [value]]
}

function isValue(input) {
    return isString(input) || isNumber(input) || isBoolean(input) || input instanceof Date
}

function generateSide(useAlias) {
    return side =>
        isNull(side) || isValue(side)
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

