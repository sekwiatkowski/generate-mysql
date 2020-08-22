function generateTruncate(tableName) {
    return `TRUNCATE ${tableName}`
}

module.exports = {
    generateTruncate
}