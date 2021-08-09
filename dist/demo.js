"use strict";

var _table = require("./table/one/table");

var _predicate = require("./expressions/predicate");

var _aggregation = require("./expressions/aggregation");

var _update = require("./expressions/update");

var _computation = require("./expressions/computation");

var _ifElse = require("./expressions/if-else");

var BlogTable = new _table.Table('blog', {
  id: 'id',
  title: 'title',
  teaser: 'teaser',
  published: 'published',
  authorId: 'author_id',
  categoryId: 'category_id',
  views: 'views'
});
var AuthorTable = new _table.Table('authors', {
  id: 'id',
  firstName: 'first_name',
  lastName: 'last_name'
});
var CategoryTable = new _table.Table('categories', {
  id: 'id',
  name: 'name'
});
var TagTable = new _table.Table('tags', {
  id: 'id'
});
var BlogPostTags = new _table.Table('blogposttags', {
  tagId: 'tag_id',
  postId: 'post_id'
});
var firstPost = {
  id: 1,
  title: 'First title',
  teaser: 'First teaser',
  published: new Date(),
  authorId: 1,
  categoryId: 1,
  views: 3
};
var secondPost = {
  id: 2,
  title: 'Second title',
  teaser: 'Second teaser',
  published: new Date(),
  authorId: 1,
  categoryId: 2,
  views: 3
};
console.log(BlogTable.filter(function (b) {
  return (0, _predicate.equals)(b.id, 1);
}).update({
  title: 'updated title',
  teaser: 'updated teaser'
}));
console.log(BlogTable.innerJoin(CategoryTable, function (b, c) {
  return (0, _predicate.equals)(b.categoryId, c.id);
}).filter(function (b, c) {
  return (0, _predicate.equals)(c.name, 'category name');
}).update(function (b) {
  return (0, _update.set)(b, {
    published: null
  });
}));
console.log(BlogTable.innerJoin(CategoryTable, function (b, c) {
  return (0, _predicate.equals)(b.categoryId, c.id);
}).filter(function (b, c) {
  return (0, _predicate.equals)(c.name, 'category name');
}).update(function (b, c) {
  return [(0, _update.set)(b, {
    published: null
  }), (0, _update.set)(c, {
    name: 'unpublished'
  })];
}));
console.log(BlogTable.filter(function (b) {
  return (0, _predicate.and)((0, _predicate.equals)(b.authorId, 1), (0, _predicate.equals)(b.categoryId, 2));
}).select().generate());
console.log(BlogTable.filter(function (b) {
  return (0, _predicate.or)((0, _predicate.equals)(b.categoryId, 1), (0, _predicate.equals)(b.categoryId, 2));
}).select().generate());
console.log(BlogTable.filter(function (b) {
  return (0, _predicate.isMemberOf)(b.categoryId, [1, 2, 3]);
}).select().generate());
console.log(BlogTable.insert(firstPost));
console.log(BlogTable.insertBatch([firstPost, secondPost]));
console.log(BlogTable.insertSelect(BlogTable.filter(function (b) {
  return (0, _predicate.equals)(b.id, 1);
}).map(function (b) {
  return {
    id: 2,
    title: b.title,
    teaser: b.teaser,
    published: b.published,
    authorId: b.authorId,
    categoryId: b.categoryId,
    views: b.views
  };
})));
console.log(BlogTable.replace(firstPost));
console.log(BlogTable.truncate());
console.log(BlogTable.select().generate());
console.log(BlogTable.filter(function (b) {
  return (0, _predicate.equals)(b.id, '8ea8dea3-f584-4367-b86e-b45774c2d624');
}).select().generate());
console.log(BlogTable.sortBy(function (b) {
  return b.published;
}).select().generate());
console.log(BlogTable.filter(function (b) {
  return (0, _predicate.equals)(b.categoryId, 1);
}).sortBy(function (b) {
  return b.published;
}).select().generate());
console.log(BlogTable.sortDescendinglyBy(function (b) {
  return b.published;
}).select().generate());
console.log(BlogTable.sortDescendinglyBy(function (b) {
  return b.published;
}).map(function (b) {
  return {
    title: b.title,
    teaser: b.teaser
  };
}).generate());
console.log(BlogTable.filter(function (j) {
  return (0, _predicate.equals)(j.id, '1ea8dea3-f584-4367-b86e-b45774c2d624');
}).select().generate());
console.log(BlogTable.map(function (b) {
  return {
    authorId: b.authorId
  };
}).generate());
console.log(BlogTable.innerJoin(AuthorTable, function (b, a) {
  return (0, _predicate.equals)(b.authorId, a.id);
}).innerJoin(CategoryTable, function (b, a, c) {
  return (0, _predicate.equals)(b.categoryId, c.id);
}).map(function (b, a, c) {
  return {
    id: b.id,
    title: b.title,
    author: {
      firstName: a.firstName,
      lastName: a.lastName
    },
    category: {
      name: c.name
    }
  };
}).generate());
console.log(BlogTable.innerJoin(AuthorTable, function (b, a) {
  return (0, _predicate.equals)(b.authorId, a.id);
}).innerJoin(CategoryTable, function (b, a, c) {
  return (0, _predicate.equals)(b.categoryId, c.id);
}).filter(function (b, a, c) {
  return (0, _predicate.equals)(c.name, 'name');
}).map(function (b, a, c) {
  return {
    id: b.id,
    title: b.title,
    author: {
      firstName: a.firstName,
      lastName: a.lastName
    },
    category: {
      name: c.name
    }
  };
}).generate());
console.log(BlogTable.get(function (b) {
  return b.title;
}).generate());
console.log(BlogTable.filter(function (b) {
  return (0, _predicate.equals)(b.id, '1');
}).get(function (b) {
  return b.title;
}).generate());
console.log(BlogTable.select().limit(1).generate());
console.log(BlogTable.select().offset(1).generate());
console.log(BlogTable.select().limit(1).offset(2).generate());
console.log(BlogTable.deleteAll());
console.log(BlogTable.filter(function (b) {
  return (0, _predicate.equals)(b.id, 1);
})["delete"]());
console.log(BlogTable.count().generate());
console.log(BlogTable.filter(function (b) {
  return (0, _predicate.equals)(b.categoryId, 1);
}).count().generate());
console.log(BlogTable.filter(function (b) {
  return (0, _predicate.and)((0, _predicate.equals)(b.authorId, 1), (0, _predicate.or)((0, _predicate.equals)(b.categoryId, 2), (0, _predicate.equals)(b.categoryId, 3)));
}).count().generate());
console.log(BlogTable.get(function (b) {
  return (0, _predicate.isNull)(b.published);
}).generate());
console.log(BlogTable.get(function (b) {
  return (0, _predicate.isNotNull)(b.published);
}).generate());
console.log(BlogTable.filter(function (b) {
  return (0, _predicate.isNull)(b.published);
}).get(function (b) {
  return b.title;
}).generate());
console.log(BlogTable.filter(function (b) {
  return (0, _predicate.isNotNull)(b.published);
}).get(function (b) {
  return b.title;
}).generate());
console.log(BlogTable.groupBy(function (b) {
  return b.categoryId;
}).map(function (b) {
  return {
    category: b.categoryId
  };
}).generate());
console.log(BlogTable.groupBy(function (b) {
  return b.categoryId;
}).map(function (b) {
  return {
    category: b.categoryId,
    count: (0, _aggregation.count)()
  };
}).generate());
console.log(BlogTable.groupBy(function (b) {
  return b.categoryId;
}).filter(function (b) {
  return (0, _predicate.equals)(b.authorId, '1');
}).map(function (b) {
  return {
    category: b.categoryId,
    count: (0, _aggregation.count)()
  };
}).generate());
console.log(CategoryTable.innerJoin(BlogTable, function (c, b) {
  return (0, _predicate.equals)(c.id, b.categoryId);
}).innerJoin(BlogPostTags, function (c, b, bpt) {
  return (0, _predicate.equals)(b.id, bpt.postId);
}).innerJoin(TagTable, function (c, b, bpt, t) {
  return (0, _predicate.equals)(bpt.tagId, t.id);
}).get(function (c, b, bpt, t) {
  return t.id;
}).generate());
var Migration = new _table.Table('migration', {
  id: 'id',
  oldColumn: 'old_column',
  newColumn: 'new_column'
});
console.log(Migration.filter(function (m) {
  return (0, _predicate.equals)(m.id, 'id');
}).update(function (m) {
  return {
    newColumn: m.oldColumn
  };
}));
console.log(BlogTable.filter(function (b) {
  return (0, _predicate.equals)(b.id, 'id');
}).update(function (b) {
  return {
    views: (0, _computation.add)(b.views, 1)
  };
}));
console.log(BlogTable.filter(function (b) {
  return (0, _predicate.equals)(b.id, 'id');
}).update(function (b) {
  return {
    views: (0, _ifElse.ifElse)((0, _predicate.equals)(b.categoryId, 1), (0, _computation.increment)(b.views), b.views)
  };
}));