"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateFrom = generateFrom;

var _generateTableAccess = require("./access/generate-table-access");

function generateFrom(useTableAlias) {
  return function (name) {
    return ["FROM ".concat(useTableAlias ? (0, _generateTableAccess.generateTableAccess)(name, 0) : name), []];
  };
}