const {Table} = require('./index')
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

const BlogTable = new Table(
    'blog',
    {
        id: 'id',
        title: 'title',
        published: 'published'
    })

const firstPost = { id: '1ea8dea3-f584-4367-b86e-b45774c2d624', title: 'First title', published: new Date() }
const secondPost = { id: '2ea8dea3-f584-4367-b86e-b45774c2d624', title: 'Second title', published: new Date() }

//console.log(table.insert(firstPost))
console.log(BlogTable.truncate())

console.log(BlogTable.insert(firstPost))
console.log(BlogTable.insertBatch([firstPost, secondPost]))

console.log(BlogTable.select())
console.log(BlogTable.filter(b => b.id.equals('8ea8dea3-f584-4367-b86e-b45774c2d624')).select())

console.log(BlogTable.sortBy(b => b.published).select())
console.log(BlogTable.sortDescendinglyBy(b => b.published).select())
