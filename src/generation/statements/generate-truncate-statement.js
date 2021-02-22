export default function generateTruncateStatement(tableName) {
    return [`TRUNCATE ${tableName}`, []]
}