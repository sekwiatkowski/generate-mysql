"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateJoins = generateJoins;

var _generateBooleanExpression = require("./boolean/generate-boolean-expression");

var _generateTableAccess = require("./access/generate-table-access");

var _standardFunctions = require("standard-functions");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function generateJoin(_ref) {
  var otherTable = _ref.otherTable,
      predicate = _ref.predicate;

  var _generateRootBooleanE = (0, _generateBooleanExpression.generateRootBooleanExpression)(true)(predicate),
      _generateRootBooleanE2 = _slicedToArray(_generateRootBooleanE, 2),
      comparisonSql = _generateRootBooleanE2[0],
      parameters = _generateRootBooleanE2[1];

  var sqlFragments = ['INNER JOIN', (0, _generateTableAccess.generateTableAccess)(otherTable.name, otherTable.index), 'ON', comparisonSql];
  var sql = (0, _standardFunctions.joinWithSpace)(sqlFragments);
  return [sql, parameters];
}

function generateJoins(joins) {
  var pairs = (0, _standardFunctions.map)(generateJoin)(joins);

  var _unzip = (0, _standardFunctions.unzip)(pairs),
      _unzip2 = _slicedToArray(_unzip, 2),
      sqlFragments = _unzip2[0],
      parameterLists = _unzip2[1];

  var parameters = (0, _standardFunctions.flatten)(parameterLists);
  return [(0, _standardFunctions.joinWithNewline)(sqlFragments), parameters];
}