'user strict';

export default class GenericDao {

    constructor($http, url){
        this.$http = $http;
        this.url   = url;

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
            obj[k]  = {$in: ids};
            this.setQuery(obj);
        }
        return this;
    }

    populate(populateArray){
        if (populateArray){
            this.opts          = this.opts || {};
            this.opts.populate = JSON.stringify(populateArray);
        }
        return this;
    }

    archived(isArchived){
        this.opts = this.opts || {};
        if (isArchived){
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

    sort(sortField){
        this.opts = this.opts || {};
        if (sortField){
            this.opts = _.merge(this.opts, {sort: sortField});
        }
        return this;
    }

    search(term){
        if (term){
            this.setQuery({
                $or: [
                    {firstname: {$regex: '.*' + term + '.*', $options: 'i'}},
                    {lastname: {$regex: '.*' + term + '.*', $options: 'i'}}
                ]
            })
        }
        return this;
    }


    get(){
        var self = this;
        return this.$http.get(this.rootUrl, {params: this.opts}).then(function(data){
            delete this.opts;
            return {
                data    : _.map(data.data, function(user){
                    return new User(self.$http, self.rootUrl, user);
                }), meta: {total: data.headers('X-Total-Count')}
            };
        });
    }

}

