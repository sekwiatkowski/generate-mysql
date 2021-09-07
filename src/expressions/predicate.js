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

export function lt(left, right) {
    return {
        kind: 'lt',
        left,
        right
    }
}

export function lte(left, right) {
    return {
        kind: 'lte',
        left,
        right
    }
}

export function gt(left, right) {
    return {
        kind: 'gt',
        left,
        right
    }
}

export function gte(left, right) {
    return {
        kind: 'gte',
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