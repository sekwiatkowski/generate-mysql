export function and(...values) {
    return {
        kind: 'and',
        values
    }
}

export function or(...values) {
    return {
        kind: 'or',
        values
    }
}