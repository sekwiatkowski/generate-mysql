"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateEquality = generateEquality;
exports.generateComparison = generateComparison;

var _standardFunctions = require("standard-functions");

var _generateExpression5 = _interopRequireDefault(require("../generate-expression"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function generateEquality(useAlias) {
  return function (_ref) {
    var left = _ref.left,
        right = _ref.right;
    return function (sign) {
      var _generateExpression = (0, _generateExpression5["default"])(useAlias)(left),
          _generateExpression2 = _slicedToArray(_generateExpression, 2),
          leftSql = _generateExpression2[0],
          leftParameters = _generateExpression2[1];

      var _generateExpression3 = (0, _generateExpression5["default"])(useAlias)(right),
          _generateExpression4 = _slicedToArray(_generateExpression3, 2),
          rightSql = _generateExpression4[0],
          rightParameters = _generateExpression4[1];

      return ["".concat(leftSql, " ").concat(sign, " ").concat(rightSql), (0, _standardFunctions.concat)(leftParameters, rightParameters)];
    };
  };
}

function generateComparison(useAlias) {
  return function (comparison) {
    var generateWithSign = generateEquality(useAlias)(comparison);

    switch (comparison.kind) {
      case 'equals':
        return generateWithSign('=');

      case 'greater than':
        return generateWithSign('>');

      case 'less than':
        return generateWithSign('<');

      default:
        throw Error('Unsupported kind of comparison.');
    }
  };
}