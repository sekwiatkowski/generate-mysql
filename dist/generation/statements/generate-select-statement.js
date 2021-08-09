"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateSelectStatement = generateSelectStatement;

var _standardFunctions = require("standard-functions");

var _generateColumnExpression = _interopRequireDefault(require("../generate-column-expression"));

var _combineFragments = _interopRequireDefault(require("./combine-fragments"));

var _generateJoins = require("../generate-joins");

var _generateWhere = require("../generate-where");

var _generateFrom = require("../generate-from");

var _generateValue5 = require("../generate-value");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/*
    someProperty: { tableIndex: 0, column: 'some_column', kind: 'column' }

    [ 'someProperty', { tableIndex: 0, column: 'some_column', kind: 'column' } ]

    [ { tableIndex: 0, column: 'some_column', kind: 'column' }, 'someProperty' ]

    [ 't1.some_column', 'someProperty' ]

    [ 't1.some_column', 'AS', 'someProperty' ]
 */
function generateColumnAlias(useTableAlias) {
  return function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        alias = _ref2[0],
        column = _ref2[1];

    var _generateColumnExpres = (0, _generateColumnExpression["default"])(useTableAlias)(column),
        _generateColumnExpres2 = _slicedToArray(_generateColumnExpres, 2),
        columnSql = _generateColumnExpres2[0],
        parameters = _generateColumnExpres2[1];

    var aliasedSql = (0, _standardFunctions.joinWithSpace)(columnSql, 'AS', (0, _standardFunctions.surroundWithDoubleQuotes)(alias));
    return [aliasedSql, parameters];
  };
}

function generateMap(useColumnAlias) {
  return function (obj) {
    var columns = (0, _standardFunctions.flattenObject)(obj, (0, _standardFunctions.hasProperty)('kind'));
    var generate = useColumnAlias ? generateColumnAlias(true) : function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          _ = _ref4[0],
          column = _ref4[1];

      return (0, _generateColumnExpression["default"])(true)(column);
    };
    var mappedEntries = (0, _standardFunctions.mapEntries)(generate)(columns);

    var _unzip = (0, _standardFunctions.unzip)(mappedEntries),
        _unzip2 = _slicedToArray(_unzip, 2),
        columnSql = _unzip2[0],
        parameters = _unzip2[1];

    var joinedSql = (0, _standardFunctions.joinWithCommaSpace)(columnSql);
    var concatenatedParameters = (0, _standardFunctions.concat)(parameters);
    return [joinedSql, concatenatedParameters];
  };
}

function generateGet(column) {
  return (0, _generateColumnExpression["default"])(true)(column);
}

function generateSelectColumns(useColumnAlias) {
  return function (select) {
    if (select === '*' || select === 'COUNT(*)') {
      return [select, []];
    } else if (select.kind === 'column' || select.kind === 'is null' || select.kind === 'is not null') {
      return generateGet(select);
    } else {
      var withObjectifiedConstants = (0, _standardFunctions.mapValues)(function (value) {
        if ((0, _standardFunctions.isNumber)(value)) {
          return {
            kind: 'value',
            value: value
          };
        } else {
          return value;
        }
      })(select);
      return generateMap(useColumnAlias)(withObjectifiedConstants);
    }
  };
}

function generateSelect(useColumnAlias) {
  return function (select) {
    var _generateSelectColumn = generateSelectColumns(useColumnAlias)(select),
        _generateSelectColumn2 = _slicedToArray(_generateSelectColumn, 2),
        columnsSql = _generateSelectColumn2[0],
        parameters = _generateSelectColumn2[1];

    return ["SELECT ".concat(columnsSql), parameters];
  };
}

function generateSortExpression(sort) {
  var _generateColumnExpres3 = (0, _generateColumnExpression["default"])(true)(sort.expression),
      _generateColumnExpres4 = _slicedToArray(_generateColumnExpres3, 2),
      columnSql = _generateColumnExpres4[0],
      parameters = _generateColumnExpres4[1];

  return ["".concat(columnSql, " ").concat(sort.direction), parameters];
}

function generateOrderBy(expr) {
  var _generateSortExpressi = generateSortExpression(expr),
      _generateSortExpressi2 = _slicedToArray(_generateSortExpressi, 2),
      sortSql = _generateSortExpressi2[0],
      parameters = _generateSortExpressi2[1];

  return ["ORDER BY ".concat(sortSql), parameters];
}

function generateGroupBy(expr) {
  var _generateColumnExpres5 = (0, _generateColumnExpression["default"])(true)(expr),
      _generateColumnExpres6 = _slicedToArray(_generateColumnExpres5, 2),
      sql = _generateColumnExpres6[0],
      parameters = _generateColumnExpres6[1];

  return ["GROUP BY ".concat(sql), parameters];
}

function generateLimit(n) {
  var _generateValue = (0, _generateValue5.generateValue)(n),
      _generateValue2 = _slicedToArray(_generateValue, 2),
      sql = _generateValue2[0],
      parameters = _generateValue2[1];

  return ["LIMIT ".concat(sql), parameters];
}

function generateOffset(n) {
  var _generateValue3 = (0, _generateValue5.generateValue)(n),
      _generateValue4 = _slicedToArray(_generateValue3, 2),
      sql = _generateValue4[0],
      parameters = _generateValue4[1];

  return ["OFFSET ".concat(sql), parameters];
}

function generateSelectStatement(useColumnAlias) {
  var fragmentGenerators = {
    select: generateSelect(useColumnAlias),
    from: (0, _generateFrom.generateFrom)(true),
    joins: _generateJoins.generateJoins,
    where: (0, _generateWhere.generateWhere)(true),
    groupBy: generateGroupBy,
    orderBy: generateOrderBy,
    limit: generateLimit,
    offset: generateOffset
  };
  return function (input) {
    var withoutNullValues = (0, _standardFunctions.excludeNull)(input);
    var fragments = (0, _standardFunctions.mapEntries)(function (_ref5) {
      var _ref6 = _slicedToArray(_ref5, 2),
          key = _ref6[0],
          value = _ref6[1];

      return fragmentGenerators[key](value);
    })(withoutNullValues);
    var combined = (0, _combineFragments["default"])(fragments);
    return combined;
  };
}