const {generateQuery} = require('../generation/generate_query')

class TwoTables {
    firstName
    firstMapping
    secondName
    secondMapping
    firstJoin

    constructor(firstName, firstMapping, secondName, secondMapping, firstJoin) {
        this.firstName = firstName
        this.firstMapping = firstMapping
        this.secondName = secondName
        this.secondMapping = secondMapping
        this.firstJoin = firstJoin

    }

    select() {
        return generateQuery({ select: '*', from: this.firstName, joins: [this.firstJoin] })
    }

}

module.exports = {
    TwoTables
}