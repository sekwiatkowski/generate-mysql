"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThreeFilteredTables = void 0;

var _query3 = require("../../query");

var _generateUpdateStatement = require("../../generation/statements/generate-update-statement");

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

var _where = /*#__PURE__*/new WeakMap();

var _selectFromJoinsWhere = /*#__PURE__*/new WeakMap();

var _query = /*#__PURE__*/new WeakSet();

var ThreeFilteredTables = /*#__PURE__*/function () {
  function ThreeFilteredTables(firstName, firstColumns, secondColumns, thirdColumns, firstJoin, secondJoin, where) {
    var _this = this;

    _classCallCheck(this, ThreeFilteredTables);

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

    _classPrivateFieldInitSpec(this, _where, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _selectFromJoinsWhere, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _firstName, firstName);

    _classPrivateFieldSet(this, _firstColumns, firstColumns);

    _classPrivateFieldSet(this, _secondColumns, secondColumns);

    _classPrivateFieldSet(this, _thirdColumns, thirdColumns);

    _classPrivateFieldSet(this, _firstJoin, firstJoin);

    _classPrivateFieldSet(this, _secondJoin, secondJoin);

    _classPrivateFieldSet(this, _where, where);

    _classPrivateFieldSet(this, _selectFromJoinsWhere, function (select) {
      return {
        select: select,
        from: _classPrivateFieldGet(_this, _firstName),
        joins: [_classPrivateFieldGet(_this, _firstJoin), _classPrivateFieldGet(_this, _secondJoin)],
        where: _classPrivateFieldGet(_this, _where)
      };
    });
  }

  _createClass(ThreeFilteredTables, [{
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
      return (0, _query3.createCountQuery)(_classPrivateFieldGet(this, _selectFromJoinsWhere));
    }
  }, {
    key: "update",
    value: function update(f) {
      return (0, _generateUpdateStatement.generateUpdateStatement)({
        firstTableName: _classPrivateFieldGet(this, _firstName),
        joins: [_classPrivateFieldGet(this, _firstJoin), _classPrivateFieldGet(this, _secondJoin)],
        where: _classPrivateFieldGet(this, _where),
        set: f(_classPrivateFieldGet(this, _firstColumns), _classPrivateFieldGet(this, _secondColumns), _classPrivateFieldGet(this, _thirdColumns))
      });
    }
  }]);

  return ThreeFilteredTables;
}();

exports.ThreeFilteredTables = ThreeFilteredTables;

function _query2(f) {
  return (0, _query3.createQuery)(_classPrivateFieldGet(this, _selectFromJoinsWhere).call(this, f(_classPrivateFieldGet(this, _firstColumns), _classPrivateFieldGet(this, _secondColumns), _classPrivateFieldGet(this, _thirdColumns))));
}