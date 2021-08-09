"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.and = and;
exports.or = or;
exports.equals = equals;
exports.isNull = isNull;
exports.isNotNull = isNotNull;
exports.isMemberOf = isMemberOf;

function and() {
  for (var _len = arguments.length, values = new Array(_len), _key = 0; _key < _len; _key++) {
    values[_key] = arguments[_key];
  }

  return {
    kind: 'and',
    values: values
  };
}

function or() {
  for (var _len2 = arguments.length, values = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    values[_key2] = arguments[_key2];
  }

  return {
    kind: 'or',
    values: values
  };
}

function equals(left, right) {
  return {
    kind: 'equals',
    left: left,
    right: right
  };
}

function isNull(column) {
  return {
    column: column,
    kind: 'is null'
  };
}

function isNotNull(column) {
  return {
    column: column,
    kind: 'is not null'
  };
}

function isMemberOf(column, set) {
  return {
    column: column,
    set: set,
    kind: 'in'
  };
}