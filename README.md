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
  
  - Define the manager
    
  ```ES6  
    import Address from './../models/address';
    import GenericDao from '../GenericDao';
    import QueryBuilder from '../QueryBuilder';

    // If you extend QueryBuilder you can add custom query params
    class AddressQueryBuilder extends QueryBuilder{

    // Custom search function
    search(term){
        if (term){
            this.setQuery({fullAddress: {$regex: '.*' + term + '.*', $options: 'i'}})
        }
        // Don't forget to return this. It's what makes QB's methods chainable
        return this;
    }
    }

  // Create the Ad-Hoc class. AddressQueryBuilder param isn't mandatory. Ignore it to use the default queryBuilder
  var DAO = GenericDao(Address, AddressQueryBuilder);

  // Finally export the DAO
  export default class AddressManager extends DAO {
  };
  ```
  
  - Register it all in AngularJS
  ``` ES6
  import DaoHelper from './DaoHelper';
  import AddressManager from './managers/addressManager';
  var module = angular
    .module('myModule.myServices', []);
    DaoHelper.registerService(module, 'AddressManager', AddressManager);
  ```

  - Compile ES6 (or don't)
    I like to make an external module with all my services, compile it to Javascript using babel and browserify, and use it in my application as standard javascript.
    
  - Configure
    
    Use angular config step to define your urls.
    
    ``` javascript
    angular.module('myModule')
    // angular-orm provides you with configuration providers named after your DAO + 'provider'
    .config(['AddressManagerProvider', 
    function(AddressManagerProvider){
      AddressManagerProvider.setRootUrl('www.myserver.com/addresses')
    }])
    ```
  
  - Make Queries
    The simplest query you can do is `AddressManager.get()` this will call the specified url with GET method and deserialize the returned values to Address instances. 
    
    Note that get() will return a promise which will return an object such as
    ```javascript
    {
    'data': [ /* your data */],
    'meta': {
      'total': 100
    }
    }
    ```
    
    If you wish to perform more complicated queries, obtain a QueryBuilder instance with `var qb = AdressManager.query()`
    Then chain methods like `paginate populate sort`...
    And pass it back to the `get()` method of the Manager
  
    
    
    
    
