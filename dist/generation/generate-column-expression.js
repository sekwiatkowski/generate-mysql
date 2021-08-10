"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = generateColumnExpression;

var _generateColumnAccess = _interopRequireDefault(require("./access/generate-column-access"));

var _generateAggregation = require("./generate-aggregation");

var _generateUnaryPredicate = require("./boolean/generate-unary-predicate");

var _generateComputation = require("./numeric/generate-computation");

var _generateIf = _interopRequireDefault(require("./condition/generate-if"));

var _generateValue = require("./generate-value");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function generateColumnExpression(useTableAlias) {
  return function (expression) {
    if ((0, _generateValue.isNullableValue)(expression)) {
      return (0, _generateValue.generateValue)(expression);
    }

    switch (expression.kind) {
      case 'add':
        return (0, _generateComputation.generateAddition)(useTableAlias)(expression);

      case 'subtract':
        return (0, _generateComputation.generateSubtraction)(useTableAlias)(expression);

      case 'multiply':
        return (0, _generateComputation.generateMultiplication)(useTableAlias)(expression);

      case 'divide':
        return (0, _generateComputation.generateDivision)(useTableAlias)(expression);

      case 'column':
        return (0, _generateColumnAccess["default"])(useTableAlias)(expression);

      case 'is null':
        return (0, _generateUnaryPredicate.generateIsNull)(useTableAlias)(expression);

      case 'is not null':
        return (0, _generateUnaryPredicate.generateIsNotNull)(useTableAlias)(expression);

      case 'if':
        return (0, _generateIf["default"])(useTableAlias)(expression);

      case 'count':
        return _generateAggregation.countExpression;

      default:
        throw Error("Unsupported kind of column expression: ".concat(expression.kind));
    }
  };
}