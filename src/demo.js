const {Table} = require('./index')
const { Client } = require('pg')

const BlogTable = new Table(
    'blog',
    {
        id: 'id',
        title: 'title',
        published: 'published',
        authorId: 'authorId'
    })

const AuthorTable = new Table(
    'author',
    {
        id: 'id'
    })

const JobTable = new Table(
    'jobs',
    {
        id: 'id',
        title: 'title',
        requirements: 'requirements',
        compensation: 'compensation',
        amount: 'amount',
        proposals: 'proposals',
        posted: 'posted'
    }
)


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

console.log(JobTable.filter(j => j.id.equals('9e22965c-d8a7-4064-b95b-2a1853e1adaf')).select())

console.log(BlogTable.map(b => ({authorId: b.authorId})))