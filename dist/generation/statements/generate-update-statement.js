"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateAssignment = generateAssignment;
exports.generateUpdateStatement = generateUpdateStatement;

var _standardFunctions = require("standard-functions");

var _generateTableAccess = require("../access/generate-table-access");

var _combineFragments = _interopRequireDefault(require("./combine-fragments"));

var _generateJoins = require("../generate-joins");

var _generateWhere = require("../generate-where");

var _generateExpression5 = _interopRequireDefault(require("../generate-expression"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function generateUpdateTable(tableName) {
  return ["UPDATE ".concat((0, _generateTableAccess.generateTableAccess)(tableName, 0)), []];
}

function generateAssignment(_ref) {
  var left = _ref.left,
      right = _ref.right;

  var _generateExpression = (0, _generateExpression5["default"])(true)(left),
      _generateExpression2 = _slicedToArray(_generateExpression, 2),
      leftSql = _generateExpression2[0],
      leftParameters = _generateExpression2[1];

  var _generateExpression3 = (0, _generateExpression5["default"])(true)(right),
      _generateExpression4 = _slicedToArray(_generateExpression3, 2),
      rightSql = _generateExpression4[0],
      rightParameters = _generateExpression4[1];

  return ["".concat(leftSql, " = ").concat(rightSql), (0, _standardFunctions.concat)(leftParameters, rightParameters)];
}

function generateAssignmentList(_ref2) {
  var columns = _ref2.columns,
      assignment = _ref2.assignment;
  var items = (0, _standardFunctions.mapEntries)(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        property = _ref4[0],
        expression = _ref4[1];

    return generateAssignment({
      left: columns[property],
      right: expression
    });
  })(assignment);

  var _unzip = (0, _standardFunctions.unzip)(items),
      _unzip2 = _slicedToArray(_unzip, 2),
      generatedAssignments = _unzip2[0],
      parameters = _unzip2[1];

  var assignmentSql = (0, _standardFunctions.joinWithCommaSpace)(generatedAssignments);
  return [assignmentSql, (0, _standardFunctions.flatten)(parameters)];
}

function generateSet(arr) {
  var assignmentFragments = (0, _standardFunctions.map)(generateAssignmentList)(arr);

  var _unzip3 = (0, _standardFunctions.unzip)(assignmentFragments),
      _unzip4 = _slicedToArray(_unzip3, 2),
      assignmentSqlFragments = _unzip4[0],
      assignmentParameterLists = _unzip4[1];

  var setSql = "SET ".concat((0, _standardFunctions.joinWithCommaSpace)(assignmentSqlFragments));
  var setParameters = (0, _standardFunctions.concat)(assignmentParameterLists);
  return [setSql, setParameters];
}

function generateUpdateStatement(_ref5) {
  var firstTableName = _ref5.firstTableName,
      joins = _ref5.joins,
      where = _ref5.where,
      set = _ref5.set;
  var updateTableFragment = generateUpdateTable(firstTableName);
  var joinFragment = joins ? (0, _generateJoins.generateJoins)(joins) : null;
  var setFragment = generateSet((0, _standardFunctions.isArray)(set) ? set : [set]);
  var whereFragment = (0, _generateWhere.generateWhere)(true)(where);
  var fragments = [updateTableFragment, joinFragment, setFragment, whereFragment];
  var presentFragments = (0, _standardFunctions.filter)(_standardFunctions.isNotNull)(fragments);
  return (0, _combineFragments["default"])(presentFragments);
}