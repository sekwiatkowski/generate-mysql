"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = generateIn;

var _generateColumnAccess3 = _interopRequireDefault(require("../access/generate-column-access"));

var _generateValue = require("../generate-value");

var _standardFunctions = require("standard-functions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function generateIn(useAlias) {
  return function (_ref) {
    var column = _ref.column,
        set = _ref.set;

    var _generateColumnAccess = (0, _generateColumnAccess3["default"])(useAlias)(column),
        _generateColumnAccess2 = _slicedToArray(_generateColumnAccess, 2),
        accessSql = _generateColumnAccess2[0],
        accessParameters = _generateColumnAccess2[1];

    var _generateListOfValues = (0, _generateValue.generateListOfValues)(set),
        _generateListOfValues2 = _slicedToArray(_generateListOfValues, 2),
        listSql = _generateListOfValues2[0],
        listParameters = _generateListOfValues2[1];

    return ["".concat(accessSql, " IN (").concat(listSql, ")"), (0, _standardFunctions.concat)(accessParameters, listParameters)];
  };
}