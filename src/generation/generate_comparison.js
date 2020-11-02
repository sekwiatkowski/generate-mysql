import generateColumn from './generate_column'

export function generateValue({value}) {
    return ['?', [value]]
}

function generateSide(side) {
    switch (side.kind) {
        case 'column':
            return [generateColumn(side), []]
        case 'value':
            return generateValue(side)
    }
}

export function generateComparison({kind, left, right}) {
    switch (kind) {
        case 'equals':
            const [leftSql, leftParameters] = generateSide(left)
            const [rightSql, rightParameters] = generateSide(right)
            return [`${leftSql} = ${rightSql}`, leftParameters.concat(rightParameters)]
    }
}