//_ = require('lodash');
import ServiceLocator from './ServiceLocator'

/**
 *
 * Can be inherited or used as is. Holds the model definition,
 * Generates populate parameters.
 * Provides several helper methods
 *
 * @param Object Mongoose Style Model
 * @param String Name of the Model (must be the same as described in 'ref' of others models relations.
 * @returns {$ES6_CLASS$}
 */
export default function ActiveRecord(model, name){
    let sl           = ServiceLocator.instance;
    let ActiveRecord = class {
        constructor($injector, rootUrl, options){
            this.$injector = $injector;
            //  this.$http     = $injector.get('$http');
            this.rootUrl = rootUrl;
            this.build(options);
        }

        build(options){
            _.each(model, (field, key)=>{
                if (options && (options[key] || options[key] === 0)){
                    var name = _.isArray(field) ? field[0].ref : field.ref;
                    var dao  = sl.getDao(name);
                    if (dao){
                        if (!this[key] || typeof(this[key]) === 'string' || (typeof(options[key]) === 'object')){
                            // If new object contains unpopulated fields, but previous object had the info, don't delete it.
                            // Happens a lot during savings, since you can't specify populates on save.
                            this[key] = dao.build(_.clone(options[key]));
                        }
                    } else{
                        this[key] = this.buildField(field, options[key])
                    }
                } else if (_.isArray(field)){
                    this[key] = [];
                }
            });
            return this;

        }

        clone(){
            var m  = sl.getModel(name);
            var ob = new m(this.$injector, this.rootUrl, this);
            delete ob._id;
            return ob;
        }

        get $injector(){
            return this._injector;
        }

        set $injector($injector){
            this._injector = $injector;
        }

        get $http(){
            return this.$injector.get('$http');
        }


        buildField(model, value){
            return _.clone(value);

        }

        archive(){
            return this.$http.put(this.rootUrl + '/' + this._id + '/archive', null);
        }

        restore(){
            return this.$http.delete(this.rootUrl + '/' + this._id + '/archive');
        }

        remove(){
            return this.delete();
        }

        delete(){
            return this.$http.delete(this.rootUrl + '/' + this._id);
        }


        populate(field){
            var $q       = this.$injector.get('$q');
            var deferred = $q.defer();
            var self     = this;
            if (Array.isArray(model[field]) && Array.isArray(this[field]) && this[field].length){
              /**
               * The field is an array. It may contain mixed populated and unpopulated data.
               * first, sort it out (typeof unpopulated is string)
               */
              var grouped = _.groupBy(this[field], (i) => typeof i)
                /** No string = everything is populated (or array is empty), we're all set */
                if (!grouped.string){
                    deferred.resolve(this[field]);
                } else {
                  /** Resolve the model name and the corresponding DAO */
                  var name = model[field][0].ref;
                  if (!name)
                      deferred.reject('Cannot Populate: unknown model');
                  else{
                    var dao = sl.getDao(name);
                      if (!dao){
                          deferred.reject('Cannot Populate: unknown DAO');
                      } else{
                          return dao.get(dao.query().select(grouped.string)).then((d)=>{
                            /** To preserve order, we map the existing field, replacing only the populated values */
                              self[field] = self[field].map((f) => {
                                 if (typeof f === 'string'){
                                    return _.find(d.data, (foo) => { return (foo._id === f)})
                                 }
                                return f
                              })
                              return self;
                          })
                      }
                }
                }
            }

            if (!this[field] || (typeof this[field] === 'object')){
                // The field is empty or already populated. return.
                deferred.resolve(this[field]);
            } else{
                var name = model[field].ref;
                if (!name)
                    deferred.reject('Cannot Populate: unknown model');
                else{
                    var dao = sl.getDao(name);
                    if (!dao){
                        deferred.reject('Cannot Populate: unknown DAO');
                    } else{
                        return dao.getById(this[field]).then(function(sub){
                            self[field] = sub;
                            return self;
                        });
                    }
                }


            }

            return deferred.promise;

        }

        beforeSave(obj){
            obj = obj || _.cloneDeep(this);
            _.each(model, (field, key)=>{
                if (obj[key] && (field.ref || (_.isArray(field) && field[0].ref))){

                    if (_.isArray(obj[key])){
                        obj[key] = _.compact(obj[key].map((val) =>{
                            if (typeof(val) === 'object'){
                                return field.nested ? val : val._id;
                            } else if (typeof(val) === 'string'){
                                return val;
                            }
                        }));
                    } else{
                        obj[key] = obj[key]._id || obj[key];
                    }
                } else if (obj[key] && (field.type === Date || (_.isArray(field) && field[0].type === Date))){
                    obj[key] = new Date(moment(obj[key])).toISOString();
                }
            });
            return obj;

        }

        save(populate){
            var toSave = this.beforeSave();
            var callback;
            if (populate){
                var dao = sl.getDao(name);
                callback = ()=>{
                    return dao.getById(this._id, dao.query().populate(populate));
                }
            } else{
                callback = (data) =>{
                    this.build(data.data);
                    return data;
                }
            }

            if (this._id){
                return this.$http.put(this.rootUrl + '/' + this._id, toSave).then(callback)
            } else{
                return this.$http.post(this.rootUrl, toSave).then(callback);
            }
        }

        static getName(){
            return name;
        }

        static makePopObject(pop){
            return _.map(pop, function(p, k){
                p       = Array.isArray(p) ? p[0] : p;
                var ob  = {path: k};
                var sub = ActiveRecord.findSubPopulates(p.ref);
                if (sub && sub.length){
                    ob.populate = sub;
                }
                return ob;
            });
        }

        static findSubPopulates(ref){
            let serviceLocator = ServiceLocator.instance;
            var linkedModel    = serviceLocator.getModel(ref);
            if (linkedModel && linkedModel !== model){
                return linkedModel.populateParams();
            }
        }


        static populateParams(populateArray){

            // Get from the model the fields that reference another object
            var pop = _.pick(model, function(v){
                if (_.isArray(v))
                    return v[0].ref;
                return v.ref;
            });

            if (populateArray === 'all'){
                return ActiveRecord.makePopObject(pop);
            }
            var toPopulate = populateArray ? _.pick(pop, function(p, k){
                return _.contains(populateArray, k);
            }) : _.pick(pop, function(v){
                return v.populateDefault || (v[0] && v[0].populateDefault);
            });
            return ActiveRecord.makePopObject(toPopulate);

        }

        static getModel(){
            return model;
        }

    };
    //   sl.registerModel(name, ActiveRecord);
    return ActiveRecord;
}
