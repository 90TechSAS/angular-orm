'use strict';

describe('Angular DAO', function () {

  var ModelManager, ModelManager3, httpBackend, $rootScope, $timeout;

  beforeEach(function () {

    module('tstModule', function (ModelManagerProvider, ModelManager2Provider) {
      ModelManagerProvider.setRootUrl('http://MOCKURL.com/model1');
      ModelManager2Provider.setRootUrl('http://MOCKURL.com/model2');
    });

    inject(function (_ModelManager_, _ModelManager3_, $httpBackend, _$rootScope_, _$timeout_) {
      ModelManager = _ModelManager_;
      ModelManager3 = _ModelManager3_;
      httpBackend = $httpBackend;
      $rootScope = _$rootScope_;
      $timeout = _$timeout_;
    });
  });

  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation();
  });

  it('should prepare to save refs and nested refs correctly', function () {
    var model = ModelManager.create({
      _id: '1234656',
      model2: { _id: '303030' },
      models2: ['77777', '4444', { _id: '888', toto: 'tutu' }]
    });
    model.model3 = ModelManager3.create({ _id: '00002' });
    model.models3 = [ModelManager3.create({ _id: '0001' })];
    expect(model.beforeSave()).toEqual({ model3: { _id: '00002' }, models3: [{ _id: '0001' }] });
  });

  it('should diff nested refs correctly', function () {
    var model = ModelManager.create({
      _id: '1234656',
      model2: { _id: '303030' },
      models2: ['77777', '4444', { _id: '888', toto: 'tutu' }],
      model3: { _id: '00002' },
      models3: [{ _id: '0001' }]
    });
    expect(model.beforeSave()).toEqual({});
  });

  it('should save only modified values', function () {
    var model = ModelManager.createModel({
      _id: '123456',
      model2: '7777',
      label: 'toto'
    });
    model.label = 'tutu';
    expect(model.$$pristine).toBeFalsy();
    httpBackend.expectPUT('http://MOCKURL.com/model1/123456', { label: 'tutu' }).respond();
    model.save();
    httpBackend.flush();
  });

  it('should save only modified values in arrays', function () {
    var model = ModelManager.createModel({
      _id: '123456',
      models2: ['7777'],
      label: 'toto'
    });
    model.models2.push('8888');
    expect(model.$$pristine).toBeFalsy();
    httpBackend.expectPUT('http://MOCKURL.com/model1/123456', { models2: ['7777', '8888'] }).respond();
    model.save();
    httpBackend.flush();
  });

  it('Should save new objects', function () {
    var model = ModelManager.createModel({
      model2: '77777'
    });
    expect(model.$$pristine).toBeFalsy();
    httpBackend.expectPOST('http://MOCKURL.com/model1', { model2: '77777' }).respond();
    model.save();
    httpBackend.flush();
  });

  it('Should not save unedited objects', function () {
    var model = ModelManager.createModel({
      _id: '123456',
      model2: '77777'
    });
    expect(model.$$pristine).toBeTruthy();
    model.save();
  });

  it('Should detect change when change is falsy', function () {
    var model = ModelManager.createModel({
      _id: '123456',
      label: 'AZE',
      num: 10
    });
    model.label = '';
    model.num = 0;
    expect(model.$$pristine).toBeFalsy();
    httpBackend.expectPUT('http://MOCKURL.com/model1/123456', { label: '', num: 0 }).respond();
    model.save();
    httpBackend.flush();
  });

  it('Should deep nested objects', function () {
    var model = ModelManager.createModel({
      label: 'toto',
      model2: { name: 'toto' }
    });
    httpBackend.expectPOST('http://MOCKURL.com/model2').respond({ name: 'toto', _id: '1111' });
    httpBackend.expectPOST('http://MOCKURL.com/model1').respond({ label: 'toto' });
    model.saveDeep();
    httpBackend.flush();
    expect(model.model2._id).toEqual('1111');
  });

  it('Should make a query with populate', function () {
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1?populate=[{"path":"model2"}]')).respond([]);
    ModelManager.get(ModelManager.query().populate('model2'));
    httpBackend.flush();
  });

  it('Should not make a diff with dates', function () {
    var model = ModelManager.create({
      _id: '007',
      when: new Date().toISOString()
    });
    model.save();
  });

  it('Should not make a diff with JS dates', function () {
    var model = ModelManager.create({
      _id: '007',
      when: new Date().toISOString()
    });
    model.when = new Date(model.when);
    model.save();
  });

  it('Should make a diff with dates if needed', function () {
    var model = ModelManager.create({
      _id: '007',
      when: new Date()
    });
    model.when = new Date(203939);
    httpBackend.expectPUT('http://MOCKURL.com/model1/007', {
      when: new Date(203939)
    }).respond();
    model.save();
  });

  it('Should not make a diff between populated and unpopulated nested field', function () {
    var model = ModelManager.create({
      _id: '1234656',
      model2: '888',
      models2: ['77777', '4444']
    });
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model2?conditions={"_id":{"$in":["77777","4444"]}}')).respond([{ _id: '77777' }, { _id: '4444' }]);
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model2/888')).respond({ _id: '888' });
    model.populate(['models2', 'model2']).then(function () {
      expect(model.models2[0]._id).toEqual('77777');
      expect(model.models2[1]._id).toEqual('4444');
      expect(model.model2._id).toEqual('888');
    });
    httpBackend.flush();
    model.save();
  });

  it('Should make a diff between populated and unpopulated nested field', function () {
    var model = ModelManager.create({
      _id: '1234656',
      model2: '888'
    });
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model2/888')).respond({ _id: '888' });
    model.populate(['models2', 'model2']).then(function () {
      expect(model.model2._id).toEqual('888');
    });
    httpBackend.flush();
    model.model2 = { _id: '999' };
    httpBackend.expectPUT('http://MOCKURL.com/model1/1234656', {
      model2: '999'
    }).respond();
    model.save();
  });

  it('Should make a diff between populated and unpopulated nested fields array', function () {
    var model = ModelManager.create({
      _id: '1234656',
      models2: ['888']
    });
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model2?conditions={"_id":"888"}')).respond([{ _id: '888' }]);
    model.populate(['models2', 'model2']).then(function () {
      expect(model.models2[0]._id).toEqual('888');
    });
    httpBackend.flush();
    model.models2.push({ _id: '999' });
    httpBackend.expectPUT('http://MOCKURL.com/model1/1234656', {
      models2: ['888', '999']
    }).respond();
    model.save();
  });

  it('Should not save irrelevant fields', function () {
    var model = ModelManager.create({
      _id: '1234656',
      models2: ['888']
    });
    model.iShouldntBeThere = 'but I am';
    model.save();
  });

  it('should not save irrelevant fields, but still save others', function () {
    var model = ModelManager.createModel({
      _id: '123456',
      model2: '7777',
      label: 'toto'
    });
    model.label = 'tutu';
    model.iShouldntBeThere = 'but I am';
    httpBackend.expectPUT('http://MOCKURL.com/model1/123456', { label: 'tutu' }).respond();
    model.save();
    httpBackend.flush();
  });

  it('should allow to save a nested field as null', function () {
    var model = ModelManager.createModel({
      _id: '123456',
      model3: {
        _id: '23456',
        name: 'toto'
      }
    });

    model.model3 = null;
    httpBackend.expectPUT('http://MOCKURL.com/model1/123456', { model3: null }).respond();
    model.save();
    httpBackend.flush();
  });
});