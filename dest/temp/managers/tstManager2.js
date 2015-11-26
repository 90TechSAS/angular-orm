'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
// istanbul ignore next

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

// istanbul ignore next

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _modelsTstModel2Js = require('./../models/tstModel2.js');

var _modelsTstModel2Js2 = _interopRequireDefault(_modelsTstModel2Js);

var _GenericDao = require('../GenericDao');

var _GenericDao2 = _interopRequireDefault(_GenericDao);

var _QueryBuilder = require('../QueryBuilder');

var _QueryBuilder2 = _interopRequireDefault(_QueryBuilder);

var DAO = (0, _GenericDao2['default'])(_modelsTstModel2Js2['default']);

var ModelManager2 = (function (_DAO) {
  _inherits(ModelManager2, _DAO);

  function ModelManager2() {
    _classCallCheck(this, ModelManager2);

    _get(Object.getPrototypeOf(ModelManager2.prototype), 'constructor', this).apply(this, arguments);
  }

  return ModelManager2;
})(DAO);

exports['default'] = ModelManager2;
;
module.exports = exports['default'];