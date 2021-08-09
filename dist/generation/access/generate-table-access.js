"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateTableAlias = generateTableAlias;
exports.generateTableAccess = generateTableAccess;

var _standardFunctions = require("standard-functions");

function generateTableAlias(index) {
  return "t".concat(index + 1);
}

function generateTableAccess(name, index) {
  return (0, _standardFunctions.joinWithSpace)(name, generateTableAlias(index));
}