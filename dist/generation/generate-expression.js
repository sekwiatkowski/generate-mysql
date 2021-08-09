"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = generateExpression;

var _generateValue = require("./generate-value");

var _generateColumnExpression = _interopRequireDefault(require("./generate-column-expression"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function generateExpression(useAlias) {
  return function (expression) {
    return (0, _generateValue.isNullableValue)(expression) ? (0, _generateValue.generateValue)(expression) : (0, _generateColumnExpression["default"])(useAlias)(expression);
  };
}