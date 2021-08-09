"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createColumn = createColumn;
exports.createColumnsFromMapping = createColumnsFromMapping;

var _standardFunctions = require("standard-functions");

function createColumn(tableIndex) {
  return function (columnName) {
    return {
      tableIndex: tableIndex,
      columnName: columnName,
      kind: 'column'
    };
  };
}

function createColumnsFromMapping(tableIndex, mapping) {
  return (0, _standardFunctions.mapValues)(createColumn(tableIndex))(mapping);
}