"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GroupedTable = void 0;

var _query3 = require("../../query");

var _filteredGroupedTable = require("./filtered-grouped-table");

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

var _columns = /*#__PURE__*/new WeakMap();

var _groupBy = /*#__PURE__*/new WeakMap();

var _selectFromGroupBy = /*#__PURE__*/new WeakMap();

var _query = /*#__PURE__*/new WeakSet();

var GroupedTable = /*#__PURE__*/function () {
  function GroupedTable(name, columns, groupBy) {
    var _this = this;

    _classCallCheck(this, GroupedTable);

    _classPrivateMethodInitSpec(this, _query);

    _defineProperty(this, "name", void 0);

    _classPrivateFieldInitSpec(this, _columns, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _groupBy, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _selectFromGroupBy, {
      writable: true,
      value: void 0
    });

    this.name = name;

    _classPrivateFieldSet(this, _columns, columns);

    _classPrivateFieldSet(this, _groupBy, groupBy);

    _classPrivateFieldSet(this, _selectFromGroupBy, function (select) {
      return {
        select: select,
        from: _this.name,
        groupBy: _classPrivateFieldGet(_this, _groupBy)
      };
    });
  }

  _createClass(GroupedTable, [{
    key: "filter",
    value: function filter(f) {
      return new _filteredGroupedTable.FilteredGroupedTable(this.name, _classPrivateFieldGet(this, _columns), _classPrivateFieldGet(this, _groupBy), f(_classPrivateFieldGet(this, _columns)));
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
  }]);

  return GroupedTable;
}();

exports.GroupedTable = GroupedTable;

function _query2(f) {
  return (0, _query3.createQuery)(_classPrivateFieldGet(this, _selectFromGroupBy).call(this, f(_classPrivateFieldGet(this, _columns))));
}