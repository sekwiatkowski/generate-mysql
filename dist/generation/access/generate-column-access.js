"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = generateColumnAccess;

var _generateTableAccess = require("./generate-table-access");

function generateColumnAccess(useAlias) {
  return function (expression) {
    var tableIndex = expression.tableIndex,
        columnName = expression.columnName;

    if (useAlias) {
      return ["".concat((0, _generateTableAccess.generateTableAlias)(tableIndex), ".").concat(columnName), []];
    } else {
      return [columnName, []];
    }
  };
}