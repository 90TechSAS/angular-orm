'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
// istanbul ignore next

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports['default'] = SessionManager;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ServiceLocator = require('./ServiceLocator');

var _ServiceLocator2 = _interopRequireDefault(_ServiceLocator);

function SessionManager(model) {

  var SessionManager = (function () {
    function SessionManager() {
      _classCallCheck(this, SessionManager);

      this.storage = {};
    }

    _createClass(SessionManager, [{
      key: 'save',
      value: function save(obj) {
        if (!obj._id) return;
        this.storage[obj._id] = obj;
      }
    }, {
      key: 'retrieve',
      value: function retrieve(id) {
        return this.storage[id];
      }
    }, {
      key: 'clean',
      value: function clean() {
        this.storage = {};
      }
    }, {
      key: 'model',
      get: function get() {
        return model;
      }
    }]);

    return SessionManager;
  })();
  return SessionManager;
}

module.exports = exports['default'];