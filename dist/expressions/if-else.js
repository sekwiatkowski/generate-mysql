"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ifElse = ifElse;

function ifElse(condition, ifTrue, ifFalse) {
  return {
    kind: 'if',
    condition: condition,
    ifTrue: ifTrue,
    ifFalse: ifFalse
  };
}