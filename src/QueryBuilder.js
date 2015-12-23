export default class QueryBuilder {

    constructor(dao, query = {}){
        this.dao = dao;
        this.opts  = query;
    }

    setQuery(query){
        this.opts            = this.opts || {};
        this.opts.conditions = this.opts.conditions || {};
        _.merge(this.opts.conditions, query);
    }

    select(ids, key){
        var k = key || '_id';
        if (ids && ids.length){
            var obj = {};
            if (typeof ids === 'string'){
                obj[k] = ids;
            } else if (ids.length === 1){
                obj[k] = ids[0];
            } else{
                obj[k] = {$in: ids};
            }
            this.setQuery(obj);
        }
        return this;
    }

    populate(populateArray){
        if (populateArray){
            this.opts          = this.opts || {};
            this.opts.populate = JSON.stringify(this.dao.getModel().populateParams(populateArray));
        }
        return this;
    }

    archived(isArchived){
        this.opts = this.opts || {};
        if (_.isBoolean(isArchived)){
            this.opts.archived = isArchived;
        }
        return this;
    }

    paginate(pagination){
        this.opts = this.opts || {};
        if (pagination){
            this.opts = _.merge(this.opts, pagination);
        }
        return this;
    }

    limit(limit){
        this.opts = this.opts || {};
        if (limit){
            this.opts.limit = limit;
        }
        return this;
    }

    sort(sortField){
        this.opts = this.opts || {};
        if (sortField){
            this.opts = _.merge(this.opts, {sort: sortField});
        }
        return this;
    }


    fields(fieldsList){
        var opts = this.opts || {};
        if (fieldsList){
            if (_.isArray(fieldsList)){
                fieldsList = fieldsList.join(' ')
            }
            opts.select = fieldsList;
        }
        return this;
    }

    search(term){
        if (term){
            this.setQuery({name: {$regex: '.*' + term + '.*', $options: 'i'}})
        }
        return this;
    }
}