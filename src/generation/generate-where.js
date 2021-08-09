import {generateRootBooleanExpression} from './boolean/generate-boolean-expression'

export function generateWhere(useTableAlias) {
    return predicate => {
        const [sql, parameters] = generateRootBooleanExpression(useTableAlias) (predicate)
        return [`WHERE ${sql}`, parameters]
    }
}