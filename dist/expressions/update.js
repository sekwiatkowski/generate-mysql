"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.set = set;

function set(columns, assignment) {
  return {
    columns: columns,
    assignment: assignment,
    kind: 'set'
  };
}