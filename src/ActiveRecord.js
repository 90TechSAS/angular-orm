_ = require('lodash');

/**
 *
 * @param Object Mongoose Style Model
 * @returns {$ES6_ANONYMOUS_CLASS$}
 */
export default function ActiveRecord(model){
    return class {
        constructor($injector, rootUrl, options){
            this.$injector = $injector;
            this.$http     = $injector.get('$http');
            this.rootUrl   = rootUrl;
            _.each(model, (field, key)=>{
                if (options && options[key]){
                    this[key] = _.clone(options[key]);
                } else if (_.isArray(field)){
                    this[key] = [];
                }
            });
        }

        save(){
            if (this._id){
                return this.$http.put(this.rootUrl + '/' + this._id, this)
            } else{
                return this.$http.post(this.rootUrl, this);
            }
        }

    }
}
