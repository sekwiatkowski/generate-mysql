import generateColumn from './generate-column'

export function generateValue({value}) {
    return ['?', [value]]
}

function generateSide(side, useAlias) {
    switch (side.kind) {
        case 'column':
            return [useAlias ? generateColumn(side) : side.column, []]
        case 'value':
            return generateValue(side)
    }
}

export default function generateComparison({kind, left, right}, useAlias = true) {
    switch (kind) {
        case 'equals':
            const [leftSql, leftParameters] = generateSide(left, useAlias)
            const [rightSql, rightParameters] = generateSide(right, useAlias)
            return [`${leftSql} = ${rightSql}`, leftParameters.concat(rightParameters)]
    }
}