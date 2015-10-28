'use strict';

'user strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
// istanbul ignore next

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

// istanbul ignore next

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var GenericDao = (function () {
    function GenericDao($http, url, model) {
        _classCallCheck(this, GenericDao);

        this.$http = $http;
        this.url = url;
        this.model = model;
    }

    _createClass(GenericDao, [{
        key: 'setQuery',
        value: function setQuery(query) {
            this.opts = this.opts || {};
            this.opts.conditions = this.opts.conditions || {};
            _.merge(this.opts.conditions, query);
        }
    }, {
        key: 'select',
        value: function select(ids, key) {
            var k = key || '_id';
            if (ids && ids.length) {
                var obj = {};
                obj[k] = { $in: ids };
                this.setQuery(obj);
            }
            return this;
        }
    }, {
        key: 'populate',
        value: function populate(populateArray) {
            if (populateArray) {
                this.opts = this.opts || {};
                this.opts.populate = JSON.stringify(populateArray);
            }
            return this;
        }
    }, {
        key: 'archived',
        value: function archived(isArchived) {
            this.opts = this.opts || {};
            if (isArchived) {
                this.opts.archived = isArchived;
            }
            return this;
        }
    }, {
        key: 'paginate',
        value: function paginate(pagination) {
            this.opts = this.opts || {};
            if (pagination) {
                this.opts = _.merge(this.opts, pagination);
            }
            return this;
        }
    }, {
        key: 'sort',
        value: function sort(sortField) {
            this.opts = this.opts || {};
            if (sortField) {
                this.opts = _.merge(this.opts, { sort: sortField });
            }
            return this;
        }
    }, {
        key: 'search',
        value: function search(term) {
            if (term) {
                this.setQuery({
                    $or: [{ firstname: { $regex: '.*' + term + '.*', $options: 'i' } }, { lastname: { $regex: '.*' + term + '.*', $options: 'i' } }]
                });
            }
            return this;
        }
    }, {
        key: 'get',
        value: function get() {
            var self = this;
            return this.$http.get(this.rootUrl, { params: this.opts }).then(function (data) {
                delete self.opts;
                return {
                    data: _.map(data.data, function (d) {
                        return new self.model(self.$http, self.rootUrl, d);
                    }), meta: { total: data.headers('X-Total-Count') }
                };
            });
        }
    }]);

    return GenericDao;
})();

exports['default'] = GenericDao;
module.exports = exports['default'];