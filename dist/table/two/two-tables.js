"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TwoTables = void 0;

var _join = _interopRequireDefault(require("../../expressions/join"));

var _twoFilteredTables = require("./two-filtered-tables");

var _threeTables = require("../three/three-tables");

var _query3 = require("../../query");

var _column = require("../../expressions/column");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

var _firstName = /*#__PURE__*/new WeakMap();

var _firstColumns = /*#__PURE__*/new WeakMap();

var _secondColumns = /*#__PURE__*/new WeakMap();

var _firstJoin = /*#__PURE__*/new WeakMap();

var _selectFromJoins = /*#__PURE__*/new WeakMap();

var _query = /*#__PURE__*/new WeakSet();

var TwoTables = /*#__PURE__*/function () {
  function TwoTables(firstName, firstColumns, secondColumns, firstJoin) {
    var _this = this;

    _classCallCheck(this, TwoTables);

    _query.add(this);

    _firstName.set(this, {
      writable: true,
      value: void 0
    });

    _firstColumns.set(this, {
      writable: true,
      value: void 0
    });

    _secondColumns.set(this, {
      writable: true,
      value: void 0
    });

    _firstJoin.set(this, {
      writable: true,
      value: void 0
    });

    _selectFromJoins.set(this, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _firstName, firstName);

    _classPrivateFieldSet(this, _firstColumns, firstColumns);

    _classPrivateFieldSet(this, _secondColumns, secondColumns);

    _classPrivateFieldSet(this, _firstJoin, firstJoin);

    _classPrivateFieldSet(this, _selectFromJoins, function (select) {
      return {
        select: select,
        from: _classPrivateFieldGet(_this, _firstName),
        joins: [_classPrivateFieldGet(_this, _firstJoin)]
      };
    });
  }

  _createClass(TwoTables, [{
    key: "innerJoin",
    value: function innerJoin(otherTable, f) {
      var thirdColumns = (0, _column.createColumnsFromMapping)(2, otherTable.mapping);
      var predicate = f(_classPrivateFieldGet(this, _firstColumns), _classPrivateFieldGet(this, _secondColumns), thirdColumns);
      var secondJoin = (0, _join["default"])(2, otherTable.name, predicate);
      return new _threeTables.ThreeTables(_classPrivateFieldGet(this, _firstName), _classPrivateFieldGet(this, _firstColumns), _classPrivateFieldGet(this, _secondColumns), thirdColumns, _classPrivateFieldGet(this, _firstJoin), secondJoin);
    }
  }, {
    key: "filter",
    value: function filter(f) {
      return new _twoFilteredTables.TwoFilteredTables(_classPrivateFieldGet(this, _firstName), _classPrivateFieldGet(this, _firstColumns), _classPrivateFieldGet(this, _secondColumns), _classPrivateFieldGet(this, _firstJoin), f(_classPrivateFieldGet(this, _firstColumns), _classPrivateFieldGet(this, _secondColumns)));
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

  return TwoTables;
}();

exports.TwoTables = TwoTables;

function _query2(f) {
  return (0, _query3.createQuery)(_classPrivateFieldGet(this, _selectFromJoins).call(this, f(_classPrivateFieldGet(this, _firstColumns), _classPrivateFieldGet(this, _secondColumns))));
}