import generateColumnExpression from './generate-column-expression'
import {concat, isObject} from 'standard-functions'

export function generateValue({value}) {
    return ['?', [value]]
}

function generateSide(side, useAlias) {
    if (isObject(side)) {
        return [useAlias ? generateColumnExpression(side) : side.columnName, []]
    }
    else {
        return generateValue(side)
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

