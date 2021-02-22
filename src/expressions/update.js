export default function set(tableIndex, partialObject) {
    return {
        tableIndex,
        partialObject,
        kind: 'set'
    }
}