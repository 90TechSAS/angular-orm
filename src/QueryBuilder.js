let _ = require('lodash')

export default class QueryBuilder {

  constructor (dao, query = {}) {
    this.dao = dao;
    this.opts = query;
  }

  setQuery (query) {
    this.opts = this.opts || {};
    this.opts.conditions = this.opts.conditions || {};
    _.merge(this.opts.conditions, _.cloneDeep(query));
  }

  select (ids, key = '_id') {
    if (ids && ids.length) {
      var obj = {}
      let existing = _.get(this.opts, `conditions.${key}`)
      if (existing && typeof existing === 'string') {
        existing = { $in: [ existing ] }
      }
      let val
      if (typeof ids === 'string') {
        val = ids
        if (existing) {
          existing.$in.push(val)
        }
      } else if (ids.length === 1) {
        val = ids[ 0 ]
        if (existing) {
          existing.$in.push(val)
        }
      } else {
        val = { $in: ids }
        if (existing) {
          existing.$in = existing.$in.concat(ids)
        }
      }
      this.setQuery({ [key]: existing || val })
    }
    return this;
  }

  populate (populateArray) {
    if (populateArray) {
      this.opts = this.opts || {};
      this.opts.populate = JSON.stringify(this.dao.getModel().populateParams(populateArray));
    }
    return this;
  }

  archived (isArchived) {
    this.opts = this.opts || {};
    if (isArchived || _.isBoolean(isArchived)) {
      this.opts.archived = isArchived;
    }
    return this;
  }

  deleted (isDeleted) {
    this.opts = this.opts || {};
    if (isDeleted || _.isBoolean(isDeleted)) {
      this.opts.deleted = isDeleted;
    }
    return this;
  }

  paginate (pagination) {
    this.opts = this.opts || {};
    if (pagination) {
      this.opts = _.merge(this.opts, pagination);
    }
    return this;
  }

  limit (limit) {
    this.opts = this.opts || {};
    if (limit) {
      this.opts.limit = limit;
    }
    return this;
  }

  sort (sortField) {
    this.opts = this.opts || {};
    if (sortField) {
      this.opts = _.merge(this.opts, { sort: sortField });
    }
    return this;
  }

  fields (fieldsList) {
    var opts = this.opts || {};
    if (fieldsList) {
      if (_.isArray(fieldsList)) {
        fieldsList = fieldsList.join(' ')
      }
      opts.select = fieldsList;
    }
    return this;
  }

  search (term, field = 'name') {
    if (term) {
      if (Array.isArray(field)) {
        var q = {
          $or: field.map(
            (element) => {
              return {
                [ element ]: {
                  $regex: `.*${term}.*`,
                  $options: 'i'
                }
              }
            }
          )
        }
        this.setQuery(q)
      } else {
        this.setQuery({ [field]: { $regex: '.*' + term + '.*', $options: 'i' } })
      }
    }
    return this;
  }
}
