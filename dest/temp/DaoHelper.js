"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
// istanbul ignore next

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

// istanbul ignore next

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DaoHelper = (function () {
    function DaoHelper() {
        _classCallCheck(this, DaoHelper);
    }

    _createClass(DaoHelper, null, [{
        key: "getProvider",

        /**
         * Provides with a wrapper class to register a DAO in angular.
         * ex: myModule.provider('myDao', DaoHelper.getProvider(MyDAOClass))
         * @param GenericDao
         * @returns {$ES6_ANONYMOUS_CLASS$}
         */
        value: function getProvider(dao) {
            return (function () {
                function _class() {
                    _classCallCheck(this, _class);
                }

                _createClass(_class, [{
                    key: "setRootUrl",
                    value: function setRootUrl(url) {
                        this.rootUrl = url;
                    }

                    /*@ngInject*/
                }, {
                    key: "$get",
                    value: function $get($injector) {
                        return new dao($injector, this.rootUrl);
                    }
                }]);

                return _class;
            })();
        }
    }]);

    return DaoHelper;
})();

exports["default"] = DaoHelper;
module.exports = exports["default"];