import {flatten, joinWithNewline, unzip} from 'standard-functions'

export default function combineFragments(fragments) {
    const [sqlFragments, parameterFragments] = unzip(fragments)

    const sql = joinWithNewline(sqlFragments)
    const parameters = flatten(parameterFragments)

    return [sql, parameters]
}
