"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateInnerBooleanExpression = exports.generateRootBooleanExpression = void 0;

var _generateComparison = require("./generate-comparison");

var _generateNaryPredicate = require("./generate-nary-predicate");

var _generateUnaryPredicate = require("./generate-unary-predicate");

var _generateIn = _interopRequireDefault(require("./generate-in"));

var _generateColumnAccess = _interopRequireDefault(require("../access/generate-column-access"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function generateBooleanExpression(isRoot) {
  return function (useTableAlias) {
    return function (expression) {
      switch (expression.kind) {
        case 'column':
          return (0, _generateColumnAccess["default"])(useTableAlias)(expression);

        case 'in':
          return (0, _generateIn["default"])(useTableAlias)(expression);

        case 'is null':
          return (0, _generateUnaryPredicate.generateIsNull)(useTableAlias)(expression);

        case 'is not null':
          return (0, _generateUnaryPredicate.generateIsNotNull)(useTableAlias)(expression);

        case 'equals':
        case 'gt':
        case 'gte':
        case 'lt':
        case 'lte':
          return (0, _generateComparison.generateComparison)(useTableAlias)(expression);

        case 'and':
          return (0, _generateNaryPredicate.generateAnd)(isRoot)(useTableAlias)(expression);

        case 'or':
          return (0, _generateNaryPredicate.generateOr)(isRoot)(useTableAlias)(expression);
      }
    };
  };
}

var generateRootBooleanExpression = generateBooleanExpression(true);
exports.generateRootBooleanExpression = generateRootBooleanExpression;
var generateInnerBooleanExpression = generateBooleanExpression(false);
exports.generateInnerBooleanExpression = generateInnerBooleanExpression;