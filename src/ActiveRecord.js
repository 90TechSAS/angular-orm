export default class ActiveRecord {

    constructor($injector, rootUrl, options, model){
        this.$injector = $injector;
        this.$http   = $injector.get('$http');
        this.rootUrl = rootUrl;
        _.each(this.model, (field, key)=>{
            if (options && options[key]){
                this[key] = _.clone(options[key]);
            } else if (_.isArray(field)) {
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
