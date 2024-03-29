"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateDeleteStatement = generateDeleteStatement;
exports.generateFilteredDeleteStatement = generateFilteredDeleteStatement;

var _standardFunctions = require("standard-functions");

var _generateWhere3 = require("../generate-where");

var _generateFrom3 = require("../generate-from");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function generateDeleteStatement(tableName) {
  var _generateFrom = (0, _generateFrom3.generateFrom)(false)(tableName),
      _generateFrom2 = _slicedToArray(_generateFrom, 2),
      fromSql = _generateFrom2[0],
      fromParameters = _generateFrom2[1];

  return ["DELETE ".concat(fromSql), fromParameters];
}

function generateFilteredDeleteStatement(tableName) {
  return function (predicate) {
    var _generateDeleteStatem = generateDeleteStatement(tableName),
        _generateDeleteStatem2 = _slicedToArray(_generateDeleteStatem, 2),
        deleteSql = _generateDeleteStatem2[0],
        deleteParameters = _generateDeleteStatem2[1];

    var _generateWhere = (0, _generateWhere3.generateWhere)(false)(predicate),
        _generateWhere2 = _slicedToArray(_generateWhere, 2),
        whereSql = _generateWhere2[0],
        whereParameters = _generateWhere2[1];

    var sql = (0, _standardFunctions.joinWithNewline)(deleteSql, whereSql);
    var parameters = (0, _standardFunctions.concat)(deleteParameters, whereParameters);
    return [sql, parameters];
  };
}