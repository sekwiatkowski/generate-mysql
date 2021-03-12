export function add(...terms) {
    return {
        kind: 'add',
        terms
    }
}

export function increment(term) {
    return {
        kind: 'add',
        terms: [ term, 1 ]
    }
}

export function subtract(...terms) {
    return {
        kind: 'or',
        terms
    }
}

export function decrement(term) {
    return {
        kind: 'subtract',
        terms: [ term, 1 ]
    }
}

export function multiply(...terms) {
    return {
        kind: 'multiply',
        terms
    }
}

export function divide(...terms) {
    return {
        kind: 'divide',
        terms
    }
}