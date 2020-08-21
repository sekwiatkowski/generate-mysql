const {Table} = require('./table')
const { Client } = require('pg')

function createQuery(configuration) {
    const client = new Client(configuration)

    return async (sql, values) => {
        await client.connect()

        const res = await client.query(sql, values)

        await client.end()

        return res
    }
}

const table = new Table(
    'blog',
    {
        id: 'id',
        title: 'title'
    })

const [ sql, parameters ] = table
    .filter(b => b.id.equals('8ea8dea3-f584-4367-b86e-b45774c2d624'))
    .select()

console.log(sql)