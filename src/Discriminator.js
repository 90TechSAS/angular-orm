//_ = require('lodash');
import ServiceLocator from './ServiceLocator'
import SessionManager from './SessionManager'


export default function Discriminator (Model, type) {

  let Discriminator = class extends Model{
    static get type (){
      return type
    }
  };

  return Discriminator;
}
