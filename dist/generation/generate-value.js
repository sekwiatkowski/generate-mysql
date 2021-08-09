"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateValue = generateValue;
exports.generateListOfValues = generateListOfValues;
exports.isNullableValue = isNullableValue;

var _standardFunctions = require("standard-functions");

function generateValue(value) {
  return ['?', [value]];
}

function generateListOfValues(list) {
  var questionMarks = (0, _standardFunctions.fill)('?')((0, _standardFunctions.length)(list));
  var listOfQuestionMarks = (0, _standardFunctions.joinWithCommaSpace)(questionMarks);
  return [listOfQuestionMarks, list];
}

function isValue(input) {
  return (0, _standardFunctions.isString)(input) || (0, _standardFunctions.isNumber)(input) || (0, _standardFunctions.isBoolean)(input) || input instanceof Date;
}

function isNullableValue(input) {
  return (0, _standardFunctions.isNull)(input) || isValue(input);
}