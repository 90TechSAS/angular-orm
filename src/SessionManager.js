import ServiceLocator from './ServiceLocator'


export default function SessionManager(model){

  let SessionManager = class {

    constructor(){
      this.storage = {}
    }

    save(obj){
      if (!obj._id) return
      this.storage[obj._id] = obj
    }

    retrieve(id){
      return this.storage[id]
    }

    clean(){
      this.storage = {}
    }

    get model(){
      return model
    }

  }
  return SessionManager
}