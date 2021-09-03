"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Table = void 0;

var _order = require("../../expressions/order");

var _join = _interopRequireDefault(require("../../expressions/join"));

var _twoTables = require("../two/two-tables");

var _filteredTable = require("./filtered-table");

var _sortedTable = require("./sorted-table");

var _generateTruncateStatement = _interopRequireDefault(require("../../generation/statements/generate-truncate-statement"));

var _query3 = require("../../query");

var _column = require("../../expressions/column");

var _generateDeleteStatement = require("../../generation/statements/generate-delete-statement");

var _generateStoreStatements = require("../../generation/statements/generate-store-statements");

var _groupedTable = require("./grouped-table");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

var _generateSelectFrom = /*#__PURE__*/new WeakMap();

var _columns = /*#__PURE__*/new WeakMap();

var _query = /*#__PURE__*/new WeakSet();

var Table = /*#__PURE__*/function () {
  function Table(name, mapping) {
    var _this = this;

    _classCallCheck(this, Table);

    _classPrivateMethodInitSpec(this, _query);

    _defineProperty(this, "name", void 0);

    _defineProperty(this, "mapping", void 0);

    _classPrivateFieldInitSpec(this, _generateSelectFrom, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _columns, {
      writable: true,
      value: void 0
    });

    this.name = name;
    this.mapping = mapping;

    _classPrivateFieldSet(this, _generateSelectFrom, function (select) {
      return {
        select: select,
        from: _this.name
      };
    });

    _classPrivateFieldSet(this, _columns, (0, _column.createColumnsFromMapping)(0, this.mapping));
  }

  _createClass(Table, [{
    key: "innerJoin",
    value: function innerJoin(otherTable, f) {
      var otherColumns = (0, _column.createColumnsFromMapping)(1, otherTable.mapping);
      var join = (0, _join["default"])(1, otherTable.name, f(_classPrivateFieldGet(this, _columns), otherColumns));
      return new _twoTables.TwoTables(this.name, _classPrivateFieldGet(this, _columns), otherColumns, join);
    }
  }, {
    key: "groupBy",
    value: function groupBy(f) {
      return new _groupedTable.GroupedTable(this.name, _classPrivateFieldGet(this, _columns), f(_classPrivateFieldGet(this, _columns)));
    }
  }, {
    key: "filter",
    value: function filter(f) {
      return new _filteredTable.FilteredTable(this.name, _classPrivateFieldGet(this, _columns), f(_classPrivateFieldGet(this, _columns)));
    }
  }, {
    key: "sortBy",
    value: function sortBy(f) {
      var orders = (0, _order.createAscendingOrdersFromColumns)(_classPrivateFieldGet(this, _columns));
      return new _sortedTable.SortedTable(this.name, _classPrivateFieldGet(this, _columns), null, f(orders));
    }
  }, {
    key: "sortDescendinglyBy",
    value: function sortDescendinglyBy(f) {
      var orders = (0, _order.createDescendingOrdersFromColumns)(_classPrivateFieldGet(this, _columns));
      return new _sortedTable.SortedTable(this.name, _classPrivateFieldGet(this, _columns), null, f(orders));
    }
  }, {
    key: "select",
    value: function select() {
      return (0, _query3.createQuery)(_classPrivateFieldGet(this, _generateSelectFrom).call(this, '*'));
    }
  }, {
    key: "map",
    value: function map(f) {
      return _classPrivateMethodGet(this, _query, _query2).call(this, f);
    }
  }, {
    key: "get",
    value: function get(f) {
      return _classPrivateMethodGet(this, _query, _query2).call(this, f);
    }
  }, {
    key: "count",
    value: function count() {
      return (0, _query3.createCountQuery)(_classPrivateFieldGet(this, _generateSelectFrom));
    }
  }, {
    key: "insertSelect",
    value: function insertSelect(select) {
      return (0, _generateStoreStatements.generateInsertSelect)(this.name)(this.mapping)(select);
    }
  }, {
    key: "insert",
    value: function insert(obj) {
      return this.insertBatch([obj]);
    }
  }, {
    key: "replace",
    value: function replace(obj) {
      return this.replaceBatch([obj]);
    }
  }, {
    key: "insertBatch",
    value: function insertBatch(objs) {
      return (0, _generateStoreStatements.generateInsert)(this.name)(this.mapping)(objs);
    }
  }, {
    key: "replaceBatch",
    value: function replaceBatch(objs) {
      return (0, _generateStoreStatements.generateReplace)(this.name)(this.mapping)(objs);
    }
  }, {
    key: "deleteAll",
    value: function deleteAll() {
      return (0, _generateDeleteStatement.generateDeleteStatement)(this.name);
    }
    /* TRUNCATE quickly removes all rows from a set of tables.
       It has the same effect as an unqualified DELETE on each table, but since it does not actually scan the tables it is faster.
       Furthermore, it reclaims disk space immediately, rather than requiring a subsequent VACUUM operation. This is most useful on large tables. */

  }, {
    key: "truncate",
    value: function truncate() {
      return (0, _generateTruncateStatement["default"])(this.name);
    }
  }]);

  return Table;
}();

exports.Table = Table;

function _query2(f) {
  return (0, _query3.createQuery)(_classPrivateFieldGet(this, _generateSelectFrom).call(this, f(_classPrivateFieldGet(this, _columns))));
}