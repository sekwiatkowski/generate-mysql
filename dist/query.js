"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createQuery = createQuery;
exports.createCountQuery = createCountQuery;

var _generateSelectStatement = require("./generation/statements/generate-select-statement");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function addOffset(offset) {
  return function (statement) {
    return _objectSpread(_objectSpread({}, statement), {}, {
      offset: offset
    });
  };
}

function addLimit(limit) {
  return function (statement) {
    return _objectSpread(_objectSpread({}, statement), {}, {
      limit: limit
    });
  };
}

function createQuery(statement) {
  return {
    kind: 'query',
    statement: statement,
    generate: function generate() {
      var useColumnAlias = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      return (0, _generateSelectStatement.generateSelectStatement)(useColumnAlias)(statement);
    },
    limit: function limit(n) {
      return createLimitedQuery(statement, n);
    },
    offset: function offset(n) {
      return createOffsetQuery(statement, n);
    }
  };
}

function createLimitedQuery(statement, limit) {
  var limitedStatement = addLimit(limit)(statement);
  return {
    kind: 'limited-query',
    statement: limitedStatement,
    generate: function generate() {
      var useColumnAlias = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      return (0, _generateSelectStatement.generateSelectStatement)(useColumnAlias)(limitedStatement);
    },
    offset: function offset(_offset) {
      return createLimitedOffsetQuery(statement, limit, _offset);
    }
  };
}

function createOffsetQuery(statement, offset) {
  var offsetStatement = addOffset(offset)(statement);
  return {
    kind: 'offset-query',
    statement: statement,
    generate: function generate() {
      var useColumnAlias = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      return (0, _generateSelectStatement.generateSelectStatement)(useColumnAlias)(offsetStatement);
    },
    limit: function limit(_limit) {
      return createLimitedOffsetQuery(statement, _limit, offset);
    }
  };
}

function createLimitedOffsetQuery(statement, limit, offset) {
  return {
    kind: 'limited-offset-query',
    statement: statement,
    generate: function generate() {
      var useColumnAlias = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      return (0, _generateSelectStatement.generateSelectStatement)(useColumnAlias)(addOffset(offset)(addLimit(limit)(statement)));
    }
  };
}

function createCountQuery(select) {
  return {
    kind: 'count-query',
    generate: function generate() {
      var useColumnAlias = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      return (0, _generateSelectStatement.generateSelectStatement)(useColumnAlias)(select('COUNT(*)'));
    }
  };
}