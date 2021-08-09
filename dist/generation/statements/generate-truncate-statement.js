"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = generateTruncateStatement;

function generateTruncateStatement(tableName) {
  return ["TRUNCATE ".concat(tableName), []];
}