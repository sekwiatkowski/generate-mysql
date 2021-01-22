import generateColumnExpression from './generate-column-expression'
import {concat, isBoolean, isNumber, isString} from 'standard-functions'

function generateValue(value) {
    return ['?', [value]]
}

function isValue(input) {
    return isString(input) || isNumber(input) || isBoolean(input) || input instanceof Date
}

function generateSide(side, useAlias) {
    if (isValue(side)) {
        return generateValue(side)
    }
    else {
        return [useAlias ? generateColumnExpression(side) : side.columnName, []]
    }
}

export function generateEquality({left, right}, useAlias) {
    const [leftSql, leftParameters] = generateSide(left, useAlias)
    const [rightSql, rightParameters] = generateSide(right, useAlias)
    return [`${leftSql} = ${rightSql}`, concat(leftParameters, rightParameters) ]
}

export function generateComparison(comparison, useAlias = true) {
    switch (comparison.kind) {
        case 'equals':
            return generateEquality(comparison, useAlias)
    }
}

