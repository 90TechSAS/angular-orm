'use strict';

let singleton         = Symbol();
let singletonEnforcer = Symbol();

/**
   At the moment, only used to register and find back models
    (to use in populate operations)
    Could be used for DI in the futur.
 **/
class ServiceLocator {

    constructor(enforcer){
        if (enforcer !== singletonEnforcer){
            throw "Cannot construct singleton"
        }
        // TODO Maybe a separate class (no need for now)
        this.modelRegistry = {};
        this.daoRegistry = {};
    }

    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new ServiceLocator(singletonEnforcer);
        }
        return this[singleton];
    }

    getModel(name){
        return this.modelRegistry[name];
    }

    getDao(name){
        return this.daoRegistry[name];
    }

    registerDao(name, dao){
        this.daoRegistry[name] = dao;
    }

    registerModel(name, model){
        this.modelRegistry[name] = model;
    }

}

export default ServiceLocator;