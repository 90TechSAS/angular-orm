let _ = require('lodash')
import ServiceLocator from './ServiceLocator';
import QueryBuilder from './QueryBuilder';

export default function GenericDao(model, qb){
    let sl           = ServiceLocator.instance;
    sl.registerModel(model.getName(), model);
    let myClass = class {
        constructor(url){
            //  this.$injector = $injector;
            //   this.$http     = $injector.get('$http');
            this.url   = url;
            this.model = model
        }

        get $http(){
            return this.$injector.get('$http');
        }

        setInjector($injector){
            this.$injector = $injector;
        }

        getModel(){
            return model;
        }


        createModel(options){
            return this.create(options);
        }

        query(q){
            return qb ? new qb(this, q) : new QueryBuilder(this, q);
        }

        get(qb = this.query()){
            var self = this;
            return this.$http.get(this.url, {params: qb.opts}).then((data)=>{
                if (!data.data) {
                  data.data = []
                }
                return {
                    data: data.data.map(this.build, this), meta: {total: data.headers('X-Total-Count')}
                };
            })
        }

        count(qb= this.query()){
            var params = _.merge(qb.opts, {count:true});
            return this.$http.get(this.url, {params: params});
        }

        build(data){
            if (!data) return;
            if (typeof(data) === 'string'){
                return data;
            }
            if (Array.isArray(data)){
                return data.map(this.build, this);
            }
            return new model(this.$injector, this.url, data);
        }

        post(qb = this.query()){
            var options = _.clone(qb.opts) || {};
            var condition;
            switch (options.archived){
                case 'both':
                    condition = '(this.isArchived == false || this.isArchived == true) && (this.isDeleted == false)';
                    break;
                case 'true':
                    condition = '(this.isArchived == true) && (this.isDeleted == false)';
                    break;
                default:
                    condition = '(this.isArchived == false) && (this.isDeleted == false)';
            }
            _.set(options, ['conditions', '$where'], condition);
            return this.$http.post(this.url + '/filters', options).then((response)=>{
                if (typeof response.data == 'number') {
                    return {meta: {total: response.headers('X-Total-Count')}, data: response.data};
                } else {
                    return {meta: {total: response.headers('X-Total-Count')}, data: response.data.map(this.build, this)};
                }
            })
        }

        create(params){
            return new this.model(this.$injector, this.url, params);
        }
    };


    function extractId(obj){
        if (Array.isArray(obj))
            return obj.map(extractId);
        if (typeof obj === 'string')
            return obj;
        /* TODO good idea ?
         if (!obj._id)
         throw 'Cannot find property id of object'; */
        return obj._id;
    }

    _.forIn(model.getModel(), function(value, key){
        var v = Array.isArray(value) ? value[0] : value;
        if (key === '_id'){
            myClass.prototype['findById'] = myClass.prototype['getById'] = function(value, qb = this.query){
                return this.$http.get(this.url + '/' + value, {params: qb.opts}).then((data)=>{
                    return new model(this.$injector, this.url, data.data);
                })
            }
        } else{
            myClass.prototype['selectBy' + _.capitalize(key)] = function(toSelect, qb = this.query()){
                if (toSelect && toSelect.length){
                    if (value.ref){
                        toSelect = extractId(toSelect);
                    }
                    var obj = {};
                    if (typeof toSelect === 'string'){
                        obj[key] = toSelect;
                    } else if (Array.isArray(toSelect)){
                        obj[key] = (toSelect.length === 1) ? toSelect[0] : {$in: toSelect};
                    } else{
                        obj[key] = toSelect;
                    }
                    qb.setQuery(obj);
                }
                return this.$http.get(this.url, {params: qb.opts}).then((data)=>{
                    if (!data.data) {
                      data.data = []
                    }
                    return {
                        data: data.data.map(this.build, this), meta: {total: data.headers('X-Total-Count')}
                    };
                })
            }

        }
        //myClass.prototype
    })

    return myClass;
}

