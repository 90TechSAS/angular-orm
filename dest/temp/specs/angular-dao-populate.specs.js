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

  it('Should make subPopulate queries', function () {
    var model = ModelManager.create({
      _id: '1234656',
      model2: '77777'
    });
    httpBackend.expectGET('http://MOCKURL.com/model2/77777').respond();
    model.populate('model2');
    httpBackend.flush();
  });

  it('Should make subPopulate queries on arrays', function () {
    var model = ModelManager.create({
      _id: '1234656',
      models2: ['77777', '4444', { _id: '888', toto: 'tutu' }]
    });
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model2?conditions={"_id":{"$in":["77777","4444"]}}')).respond([{ _id: '77777' }, { _id: '4444' }]);
    model.populate('models2').then(function () {
      expect(model.models2[0]._id).toEqual('77777');
      expect(model.models2[1]._id).toEqual('4444');
      expect(model.models2[2]._id).toEqual('888');
    });
    httpBackend.flush();
  });

  it('Should not make useless subPopulate queries on arrays', function () {
    var model = ModelManager.create({
      _id: '1234656',
      models2: [{ _id: '77777', name: 'toto' }, { _id: '888', toto: 'tutu' }]
    });
    model.populate('models2').then(function () {
      expect(model.models2[0]._id).toEqual('77777');
      expect(model.models2[1]._id).toEqual('888');
    });
  });

  it('Should make subPopulate queries on several fields', function () {
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
  });

  it('should populate again after save', function () {
    var model = ModelManager.create({
      _id: '1234656',
      model2: { _id: '888', name: 'tutu' },
      models2: ['999']
    });
    httpBackend.expectPUT(encodeURI('http://MOCKURL.com/model1/1234656')).respond({
      _id: '1234656',
      model2: '888',
      models2: ['999']
    });
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1/1234656?populate=[{"path":"models2"},{"path":"model2"}]')).respond({
      _id: '1234656',
      model2: { _id: '888', name: 'tutu' },
      models2: [{ _id: '999' }]
    });
    model.save({ force: true, populate: ['model2', 'models2'] }).then(function (pop) {
      expect(pop.models2[0]._id).toEqual('999');
    });
    httpBackend.flush();
  });

  it('should not override populated values on save', function () {
    var model = ModelManager.create({
      _id: '1234656',
      model2: { _id: '888', name: 'tutu' }
    });
    httpBackend.expectPUT(encodeURI('http://MOCKURL.com/model1/1234656')).respond({
      _id: '1234656',
      model2: '888'
    });
    model.save({ force: true }).then(function () {
      expect(model.model2._id).toEqual('888');
    });
    httpBackend.flush();
  });

  it('should override if populated value isnt the same', function () {
    var model = ModelManager.create({
      _id: '1234656',
      model2: { _id: '888', name: 'tutu' }
    });
    httpBackend.expectPUT(encodeURI('http://MOCKURL.com/model1/1234656')).respond({
      _id: '1234656',
      model2: '777'
    });
    model.save({ force: true }).then(function () {
      expect(model.model2).toEqual('777');
    });
    httpBackend.flush();
  });

  it('Should not override populated arrays on save', function () {
    var model = ModelManager.create({
      _id: '1234656',
      models2: [{ _id: '888', name: 'tutu' }]
    });
    httpBackend.expectPUT(encodeURI('http://MOCKURL.com/model1/1234656')).respond({
      _id: '1234656',
      models2: ['888']
    });
    model.save({ force: true }).then(function () {
      expect(model.models2[0]._id).toEqual('888');
    });
    httpBackend.flush();
  });

  it('Should not override populated arrays values, but be able to add newly added values', function () {
    var model = ModelManager.create({
      _id: '1234656',
      models2: [{ _id: '888', name: 'tutu' }]
    });
    httpBackend.expectPUT(encodeURI('http://MOCKURL.com/model1/1234656')).respond({
      _id: '1234656',
      models2: ['888', '999']
    });
    model.save({ force: true }).then(function () {
      expect(model.models2.length).toEqual(2);
      expect(model.models2[0]._id).toEqual('888');
      expect(model.models2[0].name).toEqual('tutu');
      expect(model.models2[1]).toEqual('999');
    });
    httpBackend.flush();
  });

  it('Should not override populated arrays values, but detect deleted values', function () {
    var model = ModelManager.create({
      _id: '1234656',
      models2: [{ _id: '888', name: 'tutu' }, { _id: '111', name: 'toto' }]
    });
    httpBackend.expectPUT(encodeURI('http://MOCKURL.com/model1/1234656')).respond({
      _id: '1234656',
      models2: ['999', '111']
    });
    model.save({ force: true }).then(function () {
      expect(model.models2.length).toEqual(2);
      expect(model.models2[0]).toEqual('999');
      expect(model.models2[1]._id).toEqual('111');
      expect(model.models2[1].name).toEqual('toto');
    });
    httpBackend.flush();
  });

  it('Should make a query with populate', function () {
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1?populate=[{"path":"model2"}]')).respond([]);
    ModelManager.get(ModelManager.query().populate('model2'));
    httpBackend.flush();
  });
});