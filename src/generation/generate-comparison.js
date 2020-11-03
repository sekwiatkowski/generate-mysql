import generateColumn from './generate-column'

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

export default function generateComparison({kind, left, right}) {
    switch (kind) {
        case 'equals':
            const [leftSql, leftParameters] = generateSide(left)
            const [rightSql, rightParameters] = generateSide(right)
            return [`${leftSql} = ${rightSql}`, leftParameters.concat(rightParameters)]
    }
}