"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = add;
exports.increment = increment;
exports.subtract = subtract;
exports.decrement = decrement;
exports.multiply = multiply;
exports.divide = divide;

function add() {
  for (var _len = arguments.length, terms = new Array(_len), _key = 0; _key < _len; _key++) {
    terms[_key] = arguments[_key];
  }

  return {
    kind: 'add',
    terms: terms
  };
}

function increment(term) {
  return {
    kind: 'add',
    terms: [term, 1]
  };
}

function subtract() {
  for (var _len2 = arguments.length, terms = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    terms[_key2] = arguments[_key2];
  }

  return {
    kind: 'or',
    terms: terms
  };
}

function decrement(term) {
  return {
    kind: 'subtract',
    terms: [term, 1]
  };
}

function multiply() {
  for (var _len3 = arguments.length, terms = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    terms[_key3] = arguments[_key3];
  }

  return {
    kind: 'multiply',
    terms: terms
  };
}

function divide() {
  for (var _len4 = arguments.length, terms = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    terms[_key4] = arguments[_key4];
  }

  return {
    kind: 'divide',
    terms: terms
  };
}