'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
// istanbul ignore next

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

// istanbul ignore next

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var ActiveRecord = (function () {
    function ActiveRecord($injector, rootUrl, options, model) {
        // istanbul ignore next

        var _this = this;

        _classCallCheck(this, ActiveRecord);

        this.$injector = $injector;
        this.$http = $injector.get('$http');
        this.rootUrl = rootUrl;
        _.each(this.model, function (field, key) {
            if (options && options[key]) {
                _this[key] = _.clone(options[key]);
            } else if (_.isArray(field)) {
                _this[key] = [];
            }
        });
    }

    _createClass(ActiveRecord, [{
        key: 'save',
        value: function save() {
            if (this._id) {
                return this.$http.put(this.rootUrl + '/' + this._id, this);
            } else {
                return this.$http.post(this.rootUrl, this);
            }
        }
    }]);

    return ActiveRecord;
})();

exports['default'] = ActiveRecord;
module.exports = exports['default'];