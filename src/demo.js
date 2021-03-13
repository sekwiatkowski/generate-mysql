import {Table} from './table/one/table'
import {and, equals, isNull, isNotNull, or, isMemberOf} from './expressions/predicate'
import {count} from './expressions/aggregation'
import {set} from './expressions/update'
import {add, increment} from './expressions/computation'
import ifElse from './expressions/if-else'

const BlogTable = new Table(
    'blog',
    {
        id: 'id',
        title: 'title',
        teaser: 'teaser',
        published: 'published',
        authorId: 'author_id',
        categoryId: 'category_id',
        views: 'views'
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

const TagTable = new Table(
    'tags',
    {
        id: 'id'
    }
)

const BlogPostTags = new Table(
    'blogposttags',
    {
        tagId: 'tag_id',
        postId: 'post_id'
    }
)

const firstPost = { id: 1, title: 'First title', teaser: 'First teaser', published: new Date(), authorId: 1, categoryId: 1 }
const secondPost = { id: 2, title: 'Second title', teaser: 'Second teaser', published: new Date(), authorId: 1, categoryId: 2 }

console.log(BlogTable.filter(b => equals(b.id, 1)).update({ title: 'updated title', teaser: 'updated teaser' }))

console.log(BlogTable
    .innerJoin(CategoryTable, (b, c) => equals(b.categoryId, c.id))
    .filter((b, c) => equals(c.name, 'category name'))
    .update(b => set(b, {published: null})))

console.log(BlogTable
    .innerJoin(CategoryTable, (b, c) => equals(b.categoryId, c.id))
    .filter((b, c) => equals(c.name, 'category name'))
    .update((b, c) => [
        set(b, {published: null}),
        set(c, {name: 'unpublished'})
    ])
)

console.log(BlogTable.filter(b => and(equals(b.authorId, 1), equals(b.categoryId, 2))).select().generate())
console.log(BlogTable.filter(b => or(equals(b.categoryId, 1), equals(b.categoryId, 2))).select().generate())
console.log(BlogTable.filter(b => isMemberOf(b.categoryId, [1, 2, 3])).select().generate())

console.log(BlogTable.insert(firstPost))
console.log(BlogTable.insertBatch([firstPost, secondPost]))

console.log(BlogTable.replace(firstPost))

console.log(BlogTable.truncate())

console.log(BlogTable.select().generate())
console.log(BlogTable.filter(b => equals(b.id, '8ea8dea3-f584-4367-b86e-b45774c2d624')).select().generate())

console.log(BlogTable.sortBy(b => b.published).select().generate())
console.log(BlogTable.filter(b => equals(b.categoryId, 1)).sortBy(b => b.published).select().generate())

console.log(BlogTable.sortDescendinglyBy(b => b.published).select().generate())
console.log(BlogTable.sortDescendinglyBy(b => b.published).map(b => ({ title: b.title, teaser: b.teaser })).generate())

console.log(BlogTable.filter(j => equals(j.id, '1ea8dea3-f584-4367-b86e-b45774c2d624')).select().generate())

console.log(BlogTable.map(b => ({authorId: b.authorId})).generate())

console.log(
    BlogTable
        .innerJoin(AuthorTable, (b, a) => equals(b.authorId, a.id))
        .innerJoin(CategoryTable, (b, a, c) => equals(b.categoryId, c.id))
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
        .innerJoin(AuthorTable, (b, a) => equals(b.authorId, a.id))
        .innerJoin(CategoryTable, (b, a, c) => equals(b.categoryId, c.id))
        .filter((b, a, c) => equals(c.name, 'name'))
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
        .filter(b => equals(b.id, '1'))
        .get(b => b.title)
        .generate()
)

console.log(BlogTable.select().limit(1).generate())
console.log(BlogTable.select().offset(1).generate())
console.log(BlogTable.select().limit(1).offset(1).generate())

console.log(BlogTable.deleteAll())
console.log(BlogTable.filter(b => equals(b.id, 1)).delete())

console.log(BlogTable.count().generate())
console.log(BlogTable.filter(b => equals(b.categoryId, 1)).count().generate())
console.log(BlogTable.filter(b => and(equals(b.authorId, 1), or(equals(b.categoryId, 2), equals(b.categoryId, 3)))).count().generate())

console.log(
    BlogTable
        .get(b => isNull(b.published))
        .generate()
)

console.log(
    BlogTable
        .get(b => isNotNull(b.published))
        .generate()
)

console.log(
    BlogTable
        .filter(b => isNull(b.published))
        .get(b => b.title)
        .generate()
)

console.log(
    BlogTable
        .filter(b => isNotNull(b.published))
        .get(b => b.title)
        .generate()
)

console.log(
    BlogTable
        .groupBy(b => b.categoryId)
        .map(b => ({
                category: b.categoryId
        }))
        .generate()
)

console.log(
    BlogTable
        .groupBy(b => b.categoryId)
        .map(b => ({
                category: b.categoryId,
                count: count(),
        }))
        .generate()
)

console.log(
    BlogTable
        .groupBy(b => b.categoryId)
        .filter(b => equals(b.authorId, '1'))
        .map(b => ({
                category: b.categoryId,
                count: count(),
        }))
        .generate()
)

console.log(
    CategoryTable
        .innerJoin(BlogTable, (c, b) => equals(c.id, b.categoryId))
        .innerJoin(BlogPostTags, (c, b, bpt) => equals(b.id, bpt.postId))
        .innerJoin(TagTable, (c, b, bpt, t) => equals(bpt.tagId, t.id))
        .get((c, b, bpt, t) => t.id)
        .generate()
)

const Migration = new Table(
    'migration',
    {
        id: 'id',
        oldColumn: 'old_column',
        newColumn: 'new_column'
    })

console.log(
    Migration
        .filter(m => equals(m.id, 'id'))
        .update(m => ({
           newColumn: m.oldColumn
        }))
)

console.log(
    BlogTable
        .filter(b => equals(b.id, 'id'))
        .update(b => ({
            views: add(b.views, 1)
        }))
)

console.log(
    BlogTable
        .filter(b => equals(b.id, 'id'))
        .update(b => ({
            views: ifElse(equals(b.categoryId, 1), increment(b.views), b.views)
        }))
)