import generateColumnAccess from '../access/generate-column-access'

function generateUnaryPredicate(operator) {
    return useAlias => expression => {
        const [accessSql, parameters] = generateColumnAccess(useAlias) (expression.column)
        return [`${accessSql} ${operator}`, parameters]
    }
}

export const generateIsNull = generateUnaryPredicate('IS NULL')
export const generateIsNotNull = generateUnaryPredicate('IS NOT NULL')