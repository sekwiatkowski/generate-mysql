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

export function equals(left, right) {
    return {
        kind: 'equals',
        left,
        right
    }
}

export function lessThan(left, right) {
    return {
        kind: 'less than',
        left,
        right
    }
}

export function greaterThan(left, right) {
    return {
        kind: 'greater than',
        left,
        right
    }
}

export function isNull(column) {
    return {
        column,
        kind: 'is null'
    }
}

export function isNotNull(column) {
    return {
        column,
        kind: 'is not null'
    }
}

export function isMemberOf(column, set) {
    return {
        column,
        set,
        kind: 'in'
    }
}