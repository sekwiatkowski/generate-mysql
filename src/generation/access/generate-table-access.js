import {joinWithSpace} from 'standard-functions'

export function generateTableAlias(index) {
    return `t${index + 1}`
}

export function generateTableAccess(name, index) {
    return joinWithSpace(name, generateTableAlias(index))
}