import {Table} from './table/one/table'

const BlogTable = new Table(
    'blog',
    {
        id: 'id',
        title: 'title',
        teaser: 'teaser',
        published: 'published',
        authorId: 'author_id',
        categoryId: 'category_id'
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

const firstPost = { id: 1, title: 'First title', teaser: 'First teaser', published: new Date(), authorId: 1, categoryId: 1 }
const secondPost = { id: 2, title: 'Second title', teaser: 'Second teaser', published: new Date(), authorId: 1, categoryId: 2 }

console.log(BlogTable.filter(b => b.id.equals(1)).update({ title: 'updated title', teaser: 'updated teaser' }))

console.log(BlogTable.insert(firstPost))
console.log(BlogTable.insertBatch([firstPost, secondPost]))

console.log(BlogTable.truncate())

console.log(BlogTable.select().generate())
console.log(BlogTable.filter(b => b.id.equals('8ea8dea3-f584-4367-b86e-b45774c2d624')).select().generate())

console.log(BlogTable.sortBy(b => b.published).select().generate())

console.log(BlogTable.sortDescendinglyBy(b => b.published).select().generate())
console.log(BlogTable.sortDescendinglyBy(b => b.published).map(b => ({ title: b.title, teaser: b.teaser })).generate())

console.log(BlogTable.filter(j => j.id.equals('1ea8dea3-f584-4367-b86e-b45774c2d624')).select().generate())

console.log(BlogTable.map(b => ({authorId: b.authorId})).generate())

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
        .generate()
)

console.log(
    BlogTable
        .innerJoin(AuthorTable, (b, a) => b.authorId.equals(a.id))
        .innerJoin(CategoryTable, (b, a, c) => b.categoryId.equals(c.id))
        .filter((b, a, c) => c.name.equals('name'))
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
        .generate()
)

console.log(
    BlogTable
        .get(b => b.title)
        .generate()
)

console.log(
    BlogTable
        .filter(b => b.id.equals('1'))
        .get(b => b.title)
        .generate()
)

console.log(BlogTable.select().limit(1).generate())
console.log(BlogTable.select().offset(1).generate())
console.log(BlogTable.select().limit(1).offset(1).generate())

console.log(BlogTable.deleteAll())
console.log(BlogTable.filter(b => b.id.equals(1)).delete())