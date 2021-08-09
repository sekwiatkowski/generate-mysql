"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateUpdateStatement = generateUpdateStatement;

var _standardFunctions = require("standard-functions");

var _generateComparison = require("../boolean/generate-comparison");

var _generateTableAccess = require("../access/generate-table-access");

var _combineFragments = _interopRequireDefault(require("./combine-fragments"));

var _generateJoins = require("../generate-joins");

var _generateWhere = require("../generate-where");

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

function generateAssignmentList(_ref) {
  var columns = _ref.columns,
      assignment = _ref.assignment;
  var items = (0, _standardFunctions.mapEntries)(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        property = _ref3[0],
        expression = _ref3[1];

    return (0, _generateComparison.generateEquality)(true)({
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

function generateUpdateStatement(_ref4) {
  var firstTableName = _ref4.firstTableName,
      joins = _ref4.joins,
      where = _ref4.where,
      set = _ref4.set;
  var updateTableFragment = generateUpdateTable(firstTableName);
  var joinFragment = joins ? (0, _generateJoins.generateJoins)(joins) : null;
  var setFragment = generateSet((0, _standardFunctions.isArray)(set) ? set : [set]);
  var whereFragment = (0, _generateWhere.generateWhere)(true)(where);
  var fragments = [updateTableFragment, joinFragment, setFragment, whereFragment];
  var presentFragments = (0, _standardFunctions.filter)(_standardFunctions.isNotNull)(fragments);
  return (0, _combineFragments["default"])(presentFragments);
}