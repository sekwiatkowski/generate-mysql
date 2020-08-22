const {generateQuery} = require('../generation/generate_query')

class FilteredTable {
    #name
    #where

    constructor(name, where) {
        this.#name = name
        this.#where = where
    }

    select() {
        return generateQuery({ select: '*', from: this.#name, where: this.#where })
    }
}

module.exports = {
    FilteredTable
}