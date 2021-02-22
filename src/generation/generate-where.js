import {generateRootBooleanExpression} from './boolean/generate-boolean-expression'

export function generateWhere(useAlias) {
    return predicate => {
        const [sql, parameters] = generateRootBooleanExpression(useAlias)(predicate)
        return [`WHERE ${sql}`, parameters]
    }
}