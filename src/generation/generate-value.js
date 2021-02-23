import {fill, isBoolean, isNull, isNumber, isString, joinWithCommaSpace, length} from 'standard-functions'

export function generateValue(value) {
    return ['?', [value]]
}

export function generateListOfValues(list) {
    const questionMarks = fill('?') (length(list))
    const listOfQuestionMarks = joinWithCommaSpace(questionMarks)

    return [listOfQuestionMarks, list]
}

function isValue(input) {
    return isString(input) || isNumber(input) || isBoolean(input) || input instanceof Date
}

export function isNullableValue(input) {
    return isNull(input) || isValue(input)
}
