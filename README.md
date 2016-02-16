# angular-orm
Easily communicate with mongoose/baucis api


## Structure
  - ActiveRecord
    
    Represents your business objects. Your object classes should inherit ActiveRecord to be usable in angular-orm. 
    This extends their behaviour with methods such as save(), archive(), populate()...

  - GenericDao
    
    Your DAOs should extend GenericDAO to be able to perform queries.
    
  - QueryBuilder
    
    You can chose to use stock QueryBuilder or extend it to add custom querying behaviour. 
    It is necessary to obtain a QueryBuilder instance from the DAO's query method before passing it back in the QB's get() method

  - ServieLocator (Singleton)
    
    Internally used by the other classes to retrieve corresponding DAO from ActiveRecord, or the ActiveRecord from the DAO. 
    Objects will be automatically registered in the SL when creating the DAO.
    
  - DaoHelper 
    
    Helps registering the DAO in angularjs, providing it with the injector it needs to work.
    
## Getting Started

  - Create a class defining your model
    
  ``` ES6
    import ActiveRecord from '../ActiveRecord'
    var model = {
      _id: {
          type  : String
      },
    // Whatever mongoose scheme you need
    };
    
    // Creating a class from your model
    var AR = ActiveRecord(model, 'Address');

    // Either export AR or extend it if you need business methods
    export default class Address extends AR {
    // Business methods here
    }
  ```
    
    
    
    
    
