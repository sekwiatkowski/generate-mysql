"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThreeTables = void 0;

var _threeFilteredTables = require("./three-filtered-tables");

var _query3 = require("../../query");

var _column = require("../../expressions/column");

var _join = _interopRequireDefault(require("../../expressions/join"));

var _fourTables = require("../four/four-tables");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

var _firstName = /*#__PURE__*/new WeakMap();

var _firstColumns = /*#__PURE__*/new WeakMap();

var _secondColumns = /*#__PURE__*/new WeakMap();

var _thirdColumns = /*#__PURE__*/new WeakMap();

var _firstJoin = /*#__PURE__*/new WeakMap();

var _secondJoin = /*#__PURE__*/new WeakMap();

var _selectFromJoin = /*#__PURE__*/new WeakMap();

var _query = /*#__PURE__*/new WeakSet();

var ThreeTables = /*#__PURE__*/function () {
  function ThreeTables(firstName, firstColumns, secondColumns, thirdColumns, firstJoin, secondJoin) {
    var _this = this;

    _classCallCheck(this, ThreeTables);

    _classPrivateMethodInitSpec(this, _query);

    _classPrivateFieldInitSpec(this, _firstName, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _firstColumns, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _secondColumns, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _thirdColumns, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _firstJoin, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _secondJoin, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _selectFromJoin, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _firstName, firstName);

    _classPrivateFieldSet(this, _firstColumns, firstColumns);

    _classPrivateFieldSet(this, _secondColumns, secondColumns);

    _classPrivateFieldSet(this, _thirdColumns, thirdColumns);

    _classPrivateFieldSet(this, _firstJoin, firstJoin);

    _classPrivateFieldSet(this, _secondJoin, secondJoin);

    _classPrivateFieldSet(this, _selectFromJoin, function (select) {
      return {
        select: select,
        from: _classPrivateFieldGet(_this, _firstName),
        joins: [_classPrivateFieldGet(_this, _firstJoin), _classPrivateFieldGet(_this, _secondJoin)]
      };
    });
  }

  _createClass(ThreeTables, [{
    key: "innerJoin",
    value: function innerJoin(otherTable, f) {
      var fourthColumns = (0, _column.createColumnsFromMapping)(3, otherTable.mapping);
      var predicate = f(_classPrivateFieldGet(this, _firstColumns), _classPrivateFieldGet(this, _secondColumns), _classPrivateFieldGet(this, _thirdColumns), fourthColumns);
      var thirdJoin = (0, _join["default"])(3, otherTable.name, predicate);
      return new _fourTables.FourTables(_classPrivateFieldGet(this, _firstName), _classPrivateFieldGet(this, _firstColumns), _classPrivateFieldGet(this, _secondColumns), _classPrivateFieldGet(this, _thirdColumns), fourthColumns, _classPrivateFieldGet(this, _firstJoin), _classPrivateFieldGet(this, _secondJoin), thirdJoin);
    }
  }, {
    key: "filter",
    value: function filter(f) {
      return new _threeFilteredTables.ThreeFilteredTables(_classPrivateFieldGet(this, _firstName), _classPrivateFieldGet(this, _firstColumns), _classPrivateFieldGet(this, _secondColumns), _classPrivateFieldGet(this, _thirdColumns), _classPrivateFieldGet(this, _firstJoin), _classPrivateFieldGet(this, _secondJoin), f(_classPrivateFieldGet(this, _firstColumns), _classPrivateFieldGet(this, _secondColumns), _classPrivateFieldGet(this, _thirdColumns)));
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

  return ThreeTables;
}();

exports.ThreeTables = ThreeTables;

function _query2(f) {
  return (0, _query3.createQuery)(_classPrivateFieldGet(this, _selectFromJoin).call(this, f(_classPrivateFieldGet(this, _firstColumns), _classPrivateFieldGet(this, _secondColumns), _classPrivateFieldGet(this, _thirdColumns))));
}