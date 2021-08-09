"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateInsertSelect = generateInsertSelect;
exports.generateReplace = exports.generateInsert = void 0;

var _standardFunctions = require("standard-functions");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var generateList = (0, _standardFunctions.compose)(_standardFunctions.joinWithCommaSpace, _standardFunctions.surroundWithParentheses);

function generateStoreColumns(statement) {
  return function (tableName) {
    return function (columnNames) {
      var columnList = generateList(columnNames);
      return ["".concat(statement, " INTO"), tableName, columnList];
    };
  };
}

var generateInsertColumns = generateStoreColumns('INSERT');

function generateInsertSelect(tableName) {
  return function (mapping) {
    return function (query) {
      var relevantProperties = (0, _standardFunctions.keys)(query.statement.select);
      var getColumnNames = (0, _standardFunctions.properties)(relevantProperties);
      var columnNames = getColumnNames(mapping);
      var insertSql = generateInsertColumns(tableName)(columnNames);

      var _query$generate = query.generate(false),
          _query$generate2 = _slicedToArray(_query$generate, 2),
          selectSql = _query$generate2[0],
          selectParameters = _query$generate2[1];

      return [(0, _standardFunctions.joinWithNewline)(insertSql, selectSql), selectParameters];
    };
  };
}

function generateStore(statement) {
  return function (tableName) {
    return function (propertyNamesToColumnNames) {
      var allProperties = (0, _standardFunctions.keys)(propertyNamesToColumnNames);
      var getAllProperties = (0, _standardFunctions.properties)(allProperties);
      var columnNames = getAllProperties(propertyNamesToColumnNames);
      var firstPart = generateStoreColumns(statement)(tableName)(columnNames);
      return function (objs) {
        var rows = (0, _standardFunctions.map)(getAllProperties)(objs);
        var firstObj = (0, _standardFunctions.first)(objs);
        var numberOfRows = (0, _standardFunctions.length)(objs);
        var numberOfCells = (0, _standardFunctions.length)((0, _standardFunctions.keys)(firstObj));
        var questionMarks = (0, _standardFunctions.fill)('?')(numberOfCells);
        var valuesExpression = generateList(questionMarks);
        var listOfQuestionMarkLists = (0, _standardFunctions.fill)(valuesExpression)(numberOfRows);
        var listOfValueExpressions = (0, _standardFunctions.joinWithCommaSpace)(listOfQuestionMarkLists);
        var secondPart = ['VALUES', listOfValueExpressions];
        var sql = (0, _standardFunctions.joinWithSpace)((0, _standardFunctions.concat)(firstPart, secondPart));
        var parameters = (0, _standardFunctions.flatten)(rows);
        return [sql, parameters];
      };
    };
  };
}

var generateInsert = generateStore('INSERT');
exports.generateInsert = generateInsert;
var generateReplace = generateStore('REPLACE');
exports.generateReplace = generateReplace;