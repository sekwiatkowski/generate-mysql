import {concat} from 'standard-functions'
import generateExpression from '../generate-expression'
import {generateComparison} from '../boolean/generate-comparison'

export default function generateIf(useAlias) {
    return ({ condition, ifTrue, ifFalse }) => {
        const [conditionSql, conditionParameters] = generateComparison(useAlias) (condition)
        const [trueSql, trueParameters] = generateExpression(useAlias) (ifTrue)
        const [falseSql, falseParameters] = generateExpression(useAlias) (ifFalse)

        return [`IF(${conditionSql}, ${trueSql}, ${falseSql})`, concat(conditionParameters, trueParameters, falseParameters)]
    }
}