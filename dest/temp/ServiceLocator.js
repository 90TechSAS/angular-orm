'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
// istanbul ignore next

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

// istanbul ignore next

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var singleton = Symbol();
var singletonEnforcer = Symbol();

/**
   At the moment, only used to register and find back models
    (to use in populate operations)
    Could be used for DI in the futur.
 **/

var ServiceLocator = (function () {
    function ServiceLocator(enforcer) {
        _classCallCheck(this, ServiceLocator);

        if (enforcer !== singletonEnforcer) {
            throw "Cannot construct singleton";
        }
        // TODO Maybe a separate class (no need for now)
        this.modelRegistry = {};
        this.daoRegistry = {};
    }

    _createClass(ServiceLocator, [{
        key: "getModel",
        value: function getModel(name) {
            return this.modelRegistry[name];
        }
    }, {
        key: "getDao",
        value: function getDao(name) {
            return this.daoRegistry[name];
        }
    }, {
        key: "registerDao",
        value: function registerDao(name, dao) {
            this.daoRegistry[name] = dao;
        }
    }, {
        key: "registerModel",
        value: function registerModel(name, model) {
            this.modelRegistry[name] = model;
        }
    }], [{
        key: "instance",
        get: function get() {
            if (!this[singleton]) {
                this[singleton] = new ServiceLocator(singletonEnforcer);
            }
            return this[singleton];
        }
    }]);

    return ServiceLocator;
})();

exports["default"] = ServiceLocator;
module.exports = exports["default"];