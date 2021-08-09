"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDescendingOrdersFromColumns = exports.createAscendingOrdersFromColumns = void 0;

var _standardFunctions = require("standard-functions");

function createOrder(direction) {
  return function (column) {
    return {
      expression: column,
      direction: direction,
      kind: 'sort-expression'
    };
  };
}

function createOrders(direction) {
  return function (columns) {
    return (0, _standardFunctions.mapValues)(createOrder(direction))(columns);
  };
}

var createAscendingOrdersFromColumns = createOrders('ASC');
exports.createAscendingOrdersFromColumns = createAscendingOrdersFromColumns;
var createDescendingOrdersFromColumns = createOrders('DESC');
exports.createDescendingOrdersFromColumns = createDescendingOrdersFromColumns;