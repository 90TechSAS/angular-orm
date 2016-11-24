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

var _modelsTstModel4Js = require('./../models/tstModel4.js');

var _modelsTstModel4Js2 = _interopRequireDefault(_modelsTstModel4Js);

var _GenericDao = require('../GenericDao');

var _GenericDao2 = _interopRequireDefault(_GenericDao);

var _Discriminator = require('../Discriminator');

var _Discriminator2 = _interopRequireDefault(_Discriminator);

var D1 = (0, _Discriminator2['default'])(_modelsTstModel4Js2['default'], 'Type1');
var D2 = (0, _Discriminator2['default'])(_modelsTstModel4Js2['default'], 'Type2');

var DAO = (0, _GenericDao2['default'])(_modelsTstModel4Js2['default'], undefined, [D1, D2]);

var ModelManager4 = (function (_DAO) {
  _inherits(ModelManager4, _DAO);

  function ModelManager4() {
    _classCallCheck(this, ModelManager4);

    _get(Object.getPrototypeOf(ModelManager4.prototype), 'constructor', this).apply(this, arguments);
  }

  return ModelManager4;
})(DAO);

exports['default'] = ModelManager4;
;
module.exports = exports['default'];