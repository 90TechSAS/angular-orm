import ServiceLocator from './ServiceLocator';
import QueryBuilder from './QueryBuilder';

export default function GenericDao(model, qb, discriminators){
    let sl           = ServiceLocator.instance;
    sl.registerModel(model.getName(), model);
    let myClass = class {
        constructor(url){
            //  this.$injector = $injector;
            //   this.$http     = $injector.get('$http');
            this.url   = url;
            this.model = model
            this.discriminators = discriminators
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

        getHeaders(){

        }

        getOptions(opts={}){
            opts.headers = this.getHeaders();
            return opts;
        }

        get(qb = this.query(), opts={}){
            opts = this.getOptions(opts)
            let params = _.merge(opts, {params: qb.opts})
            return this.$http.get(this.url, params)
              .then(data =>this.extractData(data))
        }

        extractData(data){
            if (!data.data) {
                data.data = []
            }
            return { data: data.data.map(this.build, this)}
        }

        count(qb=this.query(), opts={}){
            opts = this.getOptions();
            let query = this.query(qb.opts)
            query.count()
            return this.get(query, opts);
        }

        build(data){
            if (!data) return;
            if (typeof(data) === 'string'){
                return data;
            }
            if (Array.isArray(data)){
                return data.map(this.build, this);
            }
            if (this.discriminators && data.__t) {
              let disc = _.find(this.discriminators, {type: data.__t});
              if (disc) {
                return new disc(this.$injector, disc.discriminatorUrl, data);
              }
            }
            return new model(this.$injector, this.url, data);
        }

        create(params){
          if (this.discriminators && params.__t) {
            let disc = _.find(this.discriminators,{type: params.__t});
            if (disc) {
              return new disc(this.$injector, disc.discriminatorUrl, params);
            }
          }
          return new this.model(this.$injector, this.url, params);
        }

        // get discriminators(){
        //   return discriminators
        // }
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

