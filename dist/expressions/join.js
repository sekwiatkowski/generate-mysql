"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = createJoin;

function createJoin(otherIndex, otherTableName, predicate) {
  return {
    otherTable: {
      index: otherIndex,
      name: otherTableName
    },
    predicate: predicate,
    kind: 'join'
  };
}