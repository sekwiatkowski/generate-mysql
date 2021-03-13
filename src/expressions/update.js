export function set(columns, assignment) {
    return {
        columns,
        assignment,
        kind: 'set'
    }
}