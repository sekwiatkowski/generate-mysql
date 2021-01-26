export default function generateTruncate(tableName) {
    return [`TRUNCATE ${tableName}`, []]
}