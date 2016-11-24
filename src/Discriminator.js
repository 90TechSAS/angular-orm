//_ = require('lodash');
import ServiceLocator from './ServiceLocator'
import SessionManager from './SessionManager'


export default function Discriminator (Model, type, url) {

  let Discriminator = class extends Model{
    static get type (){
      return type
    }

    constructor ($injector, rootUrl, options) {
      super($injector, rootUrl, options);
      this.rootUrl = url
    }

    // static get discriminatorUrl(){
    //   return url
    // }
  };

  return Discriminator;
}
