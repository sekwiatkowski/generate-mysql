export function ifElse(condition, ifTrue, ifFalse) {
    return {
        kind: 'if',
        condition,
        ifTrue,
        ifFalse
    }
}