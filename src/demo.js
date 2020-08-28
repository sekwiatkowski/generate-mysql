const {Table} = require('./index')

const BlogTable = new Table(
    'blog',
    {
        id: 'id',
        title: 'title',
        published: 'published',
        authorId: 'authorId',
        categoryId: 'categoryId'
    })

const AuthorTable = new Table(
    'authors',
    {
        id: 'id',
        firstName: 'first_name',
        lastName: 'last_name'
    })


const CategoryTable = new Table(
    'categories',
    {
        id: 'id',
        name: 'name'
    })

const firstPost = { id: '1ea8dea3-f584-4367-b86e-b45774c2d624', title: 'First title', published: new Date() }
const secondPost = { id: '2ea8dea3-f584-4367-b86e-b45774c2d624', title: 'Second title', published: new Date() }

console.log(BlogTable.insert(firstPost))
console.log(BlogTable.insertBatch([firstPost, secondPost]))

console.log(BlogTable.truncate())

console.log(BlogTable.select())
console.log(BlogTable.filter(b => b.id.equals('8ea8dea3-f584-4367-b86e-b45774c2d624')).select())

console.log(BlogTable.sortBy(b => b.published).select())
console.log(BlogTable.sortDescendinglyBy(b => b.published).select())

console.log(BlogTable.filter(j => j.id.equals('1ea8dea3-f584-4367-b86e-b45774c2d624')).select())

console.log(BlogTable.map(b => ({authorId: b.authorId})))

console.log(
    BlogTable
        .innerJoin(AuthorTable, (b, a) => b.authorId.equals(a.id))
        .innerJoin(CategoryTable, (b, a, c) => b.categoryId.equals(c.id))
        .map((b, a, c) => ({
            id: b.id,
            title: b.title,
            author: {
                firstName: a.firstName,
                lastName: a.lastName
            },
            category: {
                name: c.name
            }
        }))
)