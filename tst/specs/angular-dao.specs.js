describe('Angular DAO', function () {

  var ModelManager, httpBackend, $rootScope, $timeout;

  beforeEach(function () {

    module('tstModule', function (ModelManagerProvider, ModelManager2Provider) {
      ModelManagerProvider.setRootUrl('http://MOCKURL.com/model1');
      ModelManager2Provider.setRootUrl('http://MOCKURL.com/model2');
    });

    inject(function (_ModelManager_, $httpBackend, _$rootScope_, _$timeout_) {
      ModelManager = _ModelManager_;
      httpBackend = $httpBackend;
      $rootScope = _$rootScope_;
      $timeout = _$timeout_;

    })

  });

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation()
  });

  it('should have a modelManager', function () {
    expect(ModelManager).toBeDefined();
  });

  it('should query for the list', function () {
    httpBackend.expectGET('http://MOCKURL.com/model1').respond();
    ModelManager.get();
  });

  it('should query for one element', function () {
    httpBackend.expectGET('http://MOCKURL.com/model1/ididid').respond();
    ModelManager.getById('ididid');
  });

  it('should deserialize numbers', function () {
    httpBackend.expectGET('http://MOCKURL.com/model1/ididid').respond({ num: 0, label: 'toto' });
    ModelManager.getById('ididid').then(function (data) {
      expect(data.num).toBeDefined()
    })
    httpBackend.flush();
  });

  it('should make a post query', function () {
    httpBackend.expectPOST('http://MOCKURL.com/model1/filters').respond();
    ModelManager.post();
  });

  it('should provide with a query builder', function () {
    var qb = ModelManager.query();
    expect(qb).toBeDefined();
  });

  it('Should have created field specific methods', function () {
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1?conditions={"label":"toto"}')).respond([]);
    ModelManager.selectByLabel('toto');
    httpBackend.flush();
  });

  it('Should have created field specific methods and extract object', function () {
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1?conditions={"model2":"2"}')).respond([]);
    ModelManager.selectByModel2([ { _id: "2" } ]);
    httpBackend.flush();
  });
  it('Should have created field specific methods and extract object with key', function () {
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1?conditions={"model2":"2"}')).respond([]);
    ModelManager.selectByModel2([ "2" ]);
    httpBackend.flush();
  });

  it('Should return an ActiveRecord element', function () {
    httpBackend.expectGET('http://MOCKURL.com/model1/123').respond({
      _id: '1234656'
    });
    ModelManager.getById('123').then(function (data) {
      expect(data.save).toBeDefined();
    });
    httpBackend.flush();
  });

  it('Should query by Id if not key specified', function () {
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1?conditions={"_id":"2"}')).respond([]);
    ModelManager.get(ModelManager.query().select('2'));
    httpBackend.flush();
  });

  it('Should query directly if array size === 1', function () {
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1?conditions={"_id":"2"}')).respond([]);
    ModelManager.get(ModelManager.query().select([ '2' ]));
    httpBackend.flush();
  });
  it('Should query with $in operator', function () {
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1?conditions={"_id":{"$in":["2","3"]}}')).respond([]);
    ModelManager.get(ModelManager.query().select([ '2', '3' ]));
    httpBackend.flush();
  });

  it('Should query on another field if specified', function () {
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1?conditions={"label":"2"}')).respond([]);
    ModelManager.get(ModelManager.query().select([ '2' ], 'label'));
    httpBackend.flush();
  });

  it('Should merge queries on the same field, two single queries', function () {
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1?conditions={"label":{"$in":["2","3"]}}')).respond([]);
    ModelManager.get(ModelManager.query().select('2', 'label').select('3', 'label'));
    httpBackend.flush();
  });

  it('Should merge queries on the same field, two arrays queries', function () {
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1?conditions={"label":{"$in":["2","3","4","5"]}}')).respond([]);
    ModelManager.get(ModelManager.query().select([ '2', '3' ], 'label').select([ '4', '5' ], 'label'));
    httpBackend.flush();
  });

  it('Should merge queries on the same field, single then array', function () {
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1?conditions={"label":{"$in":["2","3","4"]}}')).respond([]);
    ModelManager.get(ModelManager.query().select('2', 'label').select([ '3', '4' ], 'label'));
    httpBackend.flush();
  });

  it('Should merge queries on the same field, array then single', function () {
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1?conditions={"label":{"$in":["2","3","4"]}}')).respond([]);
    ModelManager.get(ModelManager.query().select([ '2', '3' ], 'label').select('4', 'label'));
    httpBackend.flush();
  });
  it('Should merge queries on the same field, array then single-array', function () {
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1?conditions={"label":{"$in":["2","3","4"]}}')).respond([]);
    ModelManager.get(ModelManager.query().select([ '2', '3' ], 'label').select([ '4' ], 'label'));
    httpBackend.flush();
  });

  it('Should query for archives', function () {
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1?archived=true')).respond([]);
    ModelManager.get(ModelManager.query().archived(true));
    httpBackend.flush();

  });

  it('Should query for deleted', function () {
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1?deleted=true')).respond([]);
    ModelManager.get(ModelManager.query().deleted(true));
    httpBackend.flush();

  });

  it('Should paginate', function () {
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1?limit=10&skip=5')).respond([]);
    ModelManager.get(ModelManager.query().paginate({ skip: 5, limit: 10 }));
    httpBackend.flush();
  });
  it('Should limit', function () {
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1?limit=10')).respond([]);
    ModelManager.get(ModelManager.query().limit(10));
    httpBackend.flush();
  });

  it('Should sort', function () {
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1?sort=toto')).respond([]);
    ModelManager.get(ModelManager.query().sort("toto"));
    httpBackend.flush();
  });

  it('Should select specific fields', function () {
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1?select=toto+tutu')).respond([]);
    ModelManager.get(ModelManager.query().fields([ "toto", "tutu" ]));
    httpBackend.flush();
  });

  it('Should search', function () {
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1?conditions={"name":{"$regex":".*toto.*","$options":"i"}}')).respond([]);
    ModelManager.get(ModelManager.query().search('toto'));
    httpBackend.flush();
  });

  it('Should search on another field', function () {
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1?conditions={"label":{"$regex":".*toto.*","$options":"i"}}')).respond([]);
    ModelManager.get(ModelManager.query().search('toto', 'label'));
    httpBackend.flush();
  });

  it('Should search on multiple fields', function () {
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1?conditions={"$or":[{"name":{"$regex":".*toto.*","$options":"i"}},{"label":{"$regex":".*toto.*","$options":"i"}}]}')).respond([]);
    ModelManager.get(ModelManager.query().search('toto', [ 'name', 'label' ]));
    httpBackend.flush();
  });

  it('Should count', function () {
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1?count=true')).respond([]);
    ModelManager.count()
    httpBackend.flush()
  })

  it('Should make subPopulate queries', function () {
    var model = ModelManager.create({
      _id: '1234656',
      model2: '77777'
    });
    httpBackend.expectGET('http://MOCKURL.com/model2/77777').respond();
    model.populate('model2');
    httpBackend.flush();
  });

  it('Should have a clone function', function () {
    var model = ModelManager.create({
      _id: '1234656',
      model2: '77777'
    });
    var clone = model.clone()
    expect(clone._id).not.toBeDefined()
  });

  it('Should Clone Deep', function(){
    var model = ModelManager.create({
      _id: '123456',
      model2: {
        _id: '1111',
        name: 'toto'
      },
      models2: [
        {
          _id: '2222',
          name: 'tutu'
        },
        {
          _id: '3333',
          name: 'titi'
        },
        '444'
      ]
    })
    var clone = model.cloneDeep()
    expect(clone._id).not.toBeDefined()
    expect(clone.model2._id).not.toBeDefined()
    expect(clone.models2[ 0 ]._id).not.toBeDefined()
    expect(clone.models2[ 1 ]._id).not.toBeDefined()
    expect(clone.models2[ 2 ]).toEqual('444')
  })

  it('Should make subPopulate queries on arrays', function () {
    var model = ModelManager.create({
      _id: '1234656',
      models2: [ '77777', '4444', { _id: '888', toto: 'tutu' } ]
    });
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model2?conditions={"_id":{"$in":["77777","4444"]}}')).respond([ { _id: '77777' }, { _id: '4444' } ]);
    model.populate('models2').then(function () {
      expect(model.models2[ 0 ]._id).toEqual('77777')
      expect(model.models2[ 1 ]._id).toEqual('4444')
      expect(model.models2[ 2 ]._id).toEqual('888')
    });
    httpBackend.flush()
  });

  it('Should not make useless subPopulate queries on arrays', function () {
    var model = ModelManager.create({
      _id: '1234656',
      models2: [ { _id: '77777', name: 'toto' }, { _id: '888', toto: 'tutu' } ]
    });
    model.populate('models2').then(function () {
      expect(model.models2[ 0 ]._id).toEqual('77777')
      expect(model.models2[ 1 ]._id).toEqual('888')
    });
  });

  it('Should make subPopulate queries on several fields', function () {
    var model = ModelManager.create({
      _id: '1234656',
      model2: '888',
      models2: [ '77777', '4444' ]
    });
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model2?conditions={"_id":{"$in":["77777","4444"]}}')).respond([ { _id: '77777' }, { _id: '4444' } ]);
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model2/888')).respond({ _id: '888' });
    model.populate([ 'models2', 'model2' ]).then(function () {
      expect(model.models2[ 0 ]._id).toEqual('77777');
      expect(model.models2[ 1 ]._id).toEqual('4444');
      expect(model.model2._id).toEqual('888');
    });
    httpBackend.flush()
  });

  it('should populate again after save', function () {
    var model = ModelManager.create({
      _id: '1234656',
      model2: { _id: '888', name: 'tutu' },
      models2: [ '999' ]
    });
    httpBackend.expectPUT(encodeURI('http://MOCKURL.com/model1/1234656')).respond({
      _id: '1234656',
      model2: '888',
      models2: [ '999' ]
    })
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1/1234656?populate=[{"path":"models2"},{"path":"model2"}]')).respond({
      _id: '1234656',
      model2: { _id: '888', name: 'tutu' },
      models2: [ { _id: '999' } ]
    })
    model.save([ 'model2', 'models2' ]).then(function (pop) {
      expect(pop.models2[ 0 ]._id).toEqual('999')
    })
    httpBackend.flush()
  })

  it('should not override populated values on save', function () {
    var model = ModelManager.create({
      _id: '1234656',
      model2: { _id: '888', name: 'tutu' }
    });
    httpBackend.expectPUT(encodeURI('http://MOCKURL.com/model1/1234656')).respond({
      _id: '1234656',
      model2: '888'
    })
    model.save().then(function () {
      expect(model.model2._id).toEqual('888')
    })
    httpBackend.flush()
  })

  it('should override if populated value isnt the same', function () {
    var model = ModelManager.create({
      _id: '1234656',
      model2: { _id: '888', name: 'tutu' }
    });
    httpBackend.expectPUT(encodeURI('http://MOCKURL.com/model1/1234656')).respond({
      _id: '1234656',
      model2: '777'
    })
    model.save().then(function () {
      expect(model.model2).toEqual('777')
    })
    httpBackend.flush()
  })

  it('Should not override populated arrays on save', function () {
    var model = ModelManager.create({
      _id: '1234656',
      models2: [ { _id: '888', name: 'tutu' } ]
    });
    httpBackend.expectPUT(encodeURI('http://MOCKURL.com/model1/1234656')).respond({
      _id: '1234656',
      models2: [ '888' ]
    });
    model.save().then(function () {
      expect(model.models2[ 0 ]._id).toEqual('888')
    })
    httpBackend.flush()
  })

  it('Should not override populated arrays values, but be able to add newly added values', function () {
    var model = ModelManager.create({
      _id: '1234656',
      models2: [ { _id: '888', name: 'tutu' } ]
    });
    httpBackend.expectPUT(encodeURI('http://MOCKURL.com/model1/1234656')).respond({
      _id: '1234656',
      models2: [ '888', '999' ]
    });
    model.save().then(function () {
      expect(model.models2.length).toEqual(2)
      expect(model.models2[ 0 ]._id).toEqual('888')
      expect(model.models2[ 0 ].name).toEqual('tutu')
      expect(model.models2[ 1 ]).toEqual('999')
    })
    httpBackend.flush()
  })

  it('Should not override populated arrays values, but detect deleted values', function () {
    var model = ModelManager.create({
      _id: '1234656',
      models2: [ { _id: '888', name: 'tutu' }, { _id: '111', name: 'toto' } ]
    });
    httpBackend.expectPUT(encodeURI('http://MOCKURL.com/model1/1234656')).respond({
      _id: '1234656',
      models2: [ '999', '111' ]
    });
    model.save().then(function () {
      expect(model.models2.length).toEqual(2)
      expect(model.models2[ 0 ]).toEqual('999')
      expect(model.models2[ 1 ]._id).toEqual('111')
      expect(model.models2[ 1 ].name).toEqual('toto')
    })
    httpBackend.flush()
  })

  it('Should save objects', function () {
    var model = ModelManager.createModel({
      _id: '1234656',
      model2: '77777'
    });
    httpBackend.expectPUT('http://MOCKURL.com/model1/1234656').respond();
    model.save();
    httpBackend.flush();
  });

  it('Should deep nested objects', function () {
    var model = ModelManager.createModel({
      label: 'toto',
      model2: { name: 'toto'}
    });
    httpBackend.expectPOST('http://MOCKURL.com/model2').respond({name: 'toto', _id: '1111'});
    httpBackend.expectPOST('http://MOCKURL.com/model1').respond({label: 'toto'});
    model.saveDeep();
    httpBackend.flush();
    expect(model.model2._id).toEqual('1111')
  });

  it('Should make a query with populate', function () {
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1?populate=[{"path":"model2"}]')).respond([]);
    ModelManager.get(ModelManager.query().populate('model2'));
    httpBackend.flush();

  })

});
