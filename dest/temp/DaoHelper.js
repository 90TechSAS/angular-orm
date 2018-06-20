'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
// istanbul ignore next

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// istanbul ignore next

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _ServiceLocator = require('./ServiceLocator');

var _ServiceLocator2 = _interopRequireDefault(_ServiceLocator);

var DaoHelper = (function () {
    function DaoHelper() {
        _classCallCheck(this, DaoHelper);
    }

    _createClass(DaoHelper, null, [{
        key: 'getProvider',

        /**
         * Provides with a wrapper class to register a DAO in angular.
         * ex: myModule.provider('myDao', DaoHelper.getProvider(MyDAOClass))
         * @param GenericDao
         * @returns {$ES6_ANONYMOUS_CLASS$}
         */
        value: function getProvider(dao) {
            var sl = _ServiceLocator2['default'].instance;

            return (function () {
                function _class() {
                    _classCallCheck(this, _class);

                    this.dao = new dao();
                    sl.registerDao(this.dao.getModel().getName(), this.dao);
                }

                _createClass(_class, [{
                    key: 'setRootUrl',
                    value: function setRootUrl(url) {
                        this.dao.url = url;
                    }
                }, {
                    key: 'setDiscriminatorUrl',
                    value: function setDiscriminatorUrl(type, url) {
                        _.each(this.dao.discriminators, function (discriminator) {
                            if (discriminator.type === type) {
                                discriminator.discriminatorUrl = url;
                            }
                        });
                    }
                }, {
                    key: '$get',
                    value: function $get() {
                        return this.dao;
                    }
                }]);

                return _class;
            })();
        }
    }, {
        key: 'registerService',
        value: function registerService(module, name, dao) {
            module.provider(name, DaoHelper.getProvider(dao)).run([name, '$injector', function (service, $injector) {
                _ServiceLocator2['default'].instance.registerInjector($injector);
                //service.setInjector($injector);
            }]);
        }
    }]);

    return DaoHelper;
})();

exports['default'] = DaoHelper;
module.exports = exports['default'];