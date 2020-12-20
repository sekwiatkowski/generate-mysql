export default function createJoin(otherIndex, otherTableName, predicate) {
    return ({
        otherTable: {
            index: otherIndex,
            name: otherTableName
        },
        predicate,
        kind: 'join'
    })
}