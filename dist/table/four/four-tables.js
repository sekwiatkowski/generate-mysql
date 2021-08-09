"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FourTables = void 0;

var _query3 = require("../../query");

var _fourFilteredTables = require("./four-filtered-tables");

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

var _thirdColumns = /*#__PURE__*/new WeakMap();

var _fourthColumns = /*#__PURE__*/new WeakMap();

var _firstJoin = /*#__PURE__*/new WeakMap();

var _secondJoin = /*#__PURE__*/new WeakMap();

var _thirdJoin = /*#__PURE__*/new WeakMap();

var _selectFromJoin = /*#__PURE__*/new WeakMap();

var _query = /*#__PURE__*/new WeakSet();

var FourTables = /*#__PURE__*/function () {
  function FourTables(firstName, firstColumns, secondColumns, thirdColumns, fourthColumns, firstJoin, secondJoin, thirdJoin) {
    var _this = this;

    _classCallCheck(this, FourTables);

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

    _thirdColumns.set(this, {
      writable: true,
      value: void 0
    });

    _fourthColumns.set(this, {
      writable: true,
      value: void 0
    });

    _firstJoin.set(this, {
      writable: true,
      value: void 0
    });

    _secondJoin.set(this, {
      writable: true,
      value: void 0
    });

    _thirdJoin.set(this, {
      writable: true,
      value: void 0
    });

    _selectFromJoin.set(this, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _firstName, firstName);

    _classPrivateFieldSet(this, _firstColumns, firstColumns);

    _classPrivateFieldSet(this, _secondColumns, secondColumns);

    _classPrivateFieldSet(this, _thirdColumns, thirdColumns);

    _classPrivateFieldSet(this, _fourthColumns, fourthColumns);

    _classPrivateFieldSet(this, _firstJoin, firstJoin);

    _classPrivateFieldSet(this, _secondJoin, secondJoin);

    _classPrivateFieldSet(this, _thirdJoin, thirdJoin);

    _classPrivateFieldSet(this, _selectFromJoin, function (select) {
      return {
        select: select,
        from: _classPrivateFieldGet(_this, _firstName),
        joins: [_classPrivateFieldGet(_this, _firstJoin), _classPrivateFieldGet(_this, _secondJoin), _classPrivateFieldGet(_this, _thirdJoin)]
      };
    });
  }

  _createClass(FourTables, [{
    key: "filter",
    value: function filter(f) {
      return new _fourFilteredTables.FourFilteredTables(_classPrivateFieldGet(this, _firstName), _classPrivateFieldGet(this, _firstColumns), _classPrivateFieldGet(this, _secondColumns), _classPrivateFieldGet(this, _thirdColumns), _classPrivateFieldGet(this, _fourthColumns), _classPrivateFieldGet(this, _firstJoin), _classPrivateFieldGet(this, _secondJoin), _classPrivateFieldGet(this, _thirdJoin), f(_classPrivateFieldGet(this, _firstColumns), _classPrivateFieldGet(this, _secondColumns), _classPrivateFieldGet(this, _thirdColumns), _classPrivateFieldGet(this, _fourthColumns)));
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

  return FourTables;
}();

exports.FourTables = FourTables;

function _query2(f) {
  return (0, _query3.createQuery)(_classPrivateFieldGet(this, _selectFromJoin).call(this, f(_classPrivateFieldGet(this, _firstColumns), _classPrivateFieldGet(this, _secondColumns), _classPrivateFieldGet(this, _thirdColumns), _classPrivateFieldGet(this, _fourthColumns))));
}