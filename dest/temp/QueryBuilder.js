'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
// istanbul ignore next

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

// istanbul ignore next

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var QueryBuilder = (function () {
    function QueryBuilder(dao) {
        var query = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, QueryBuilder);

        this.dao = dao;
        this.opts = query;
    }

    _createClass(QueryBuilder, [{
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
                if (typeof ids === 'string') {
                    obj[k] = ids;
                } else if (ids.length === 1) {
                    obj[k] = ids[0];
                } else {
                    obj[k] = { $in: ids };
                }
                this.setQuery(obj);
            }
            return this;
        }
    }, {
        key: 'populate',
        value: function populate(populateArray) {
            if (populateArray) {
                this.opts = this.opts || {};
                this.opts.populate = JSON.stringify(this.dao.getModel().populateParams(populateArray));
            }
            return this;
        }
    }, {
        key: 'archived',
        value: function archived(isArchived) {
            this.opts = this.opts || {};
            if (_.isBoolean(isArchived)) {
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
        key: 'limit',
        value: function limit(_limit) {
            this.opts = this.opts || {};
            if (_limit) {
                this.opts.limit = _limit;
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
        key: 'fields',
        value: function fields(fieldsList) {
            var opts = this.opts || {};
            if (fieldsList) {
                if (_.isArray(fieldsList)) {
                    fieldsList = fieldsList.join(' ');
                }
                opts.select = fieldsList;
            }
            return this;
        }
    }, {
        key: 'search',
        value: function search(term) {
            if (term) {
                this.setQuery({ name: { $regex: '.*' + term + '.*', $options: 'i' } });
            }
            return this;
        }
    }]);

    return QueryBuilder;
})();

exports['default'] = QueryBuilder;
module.exports = exports['default'];