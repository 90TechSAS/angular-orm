export default function GenericDao(model){

    return class {
        constructor($injector, url){
            this.$injector = $injector;
            this.$http     = $injector.get('$http');
            this.url       = url;
            this.model     = model

        }

        getNew(){
            return new this.model(this.$injector, this.url);
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
                this.setQuery({name: {$regex: '.*' + term + '.*', $options: 'i'}})
            }
            return this;
        };


        get(){
            var self = this;
            return this.$http.get(this.url, {params: this.opts}).then(function(data){
                delete self.opts;
                return {
                    data    : _.map(data.data, function(d){
                        return new self.model(self.$injector, self.url, d);
                    }), meta: {total: data.headers('X-Total-Count')}
                };
            });
        }


        getById(id){
            var self   = this;
            var params = null;
            if (this.opts && this.opts.populate){
                params = {params: {populate: populate}}
            }
            return this.$http.get(this.url + '/' + id, params).then(function(data){
                delete self.opts;
                return new self.model(self.$injector, self.url, data.data);
            })
        }

        create(params){
            return new this.model(this.$injector, this.url, params);
        }
    }
}

