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

  it('Should have a clone function', function () {
    var model = ModelManager.create({
      _id: '1234656',
      model2: '77777'
    });
    var clone = model.clone();
    expect(clone._id).not.toBeDefined();
  });

  it('Should Clone Deep', function () {
    var model = ModelManager.create({
      _id: '123456',
      model2: {
        _id: '1111',
        name: 'toto'
      },
      models2: [{
        _id: '2222',
        name: 'tutu'
      }, {
        _id: '3333',
        name: 'titi'
      }, '444']
    });
    var clone = model.cloneDeep();
    expect(clone._id).not.toBeDefined();
    expect(clone.model2._id).not.toBeDefined();
    expect(clone.models2[0]._id).not.toBeDefined();
    expect(clone.models2[1]._id).not.toBeDefined();
    expect(clone.models2[2]).toEqual('444');
  });
});