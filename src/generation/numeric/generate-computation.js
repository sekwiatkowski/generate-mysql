import {concat, join, map, unzip} from 'standard-functions'
import generateExpression from '../generate-expression'


function generateComputation(operator) {
    return useAlias => ({ terms }) => {

        const [sqlFragments, parameterLists] = unzip(map(term => generateExpression(useAlias) (term))(terms))

        const sql = join(` ${operator} `) (sqlFragments)
        const parameters = concat(parameterLists)

        return [sql, parameters]
    }
}

export const generateAddition = generateComputation('+')
export const generateSubtraction = generateComputation('-')
export const generateMultiplication = generateComputation('*')
export const generateDivision = generateComputation('/')