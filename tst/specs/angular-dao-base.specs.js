describe('Angular DAO Basics', function () {

  var ModelManager, ModelManager3, httpBackend, $rootScope, $timeout;

  beforeEach(function () {

    module('tstModule', function (ModelManagerProvider, ModelManager2Provider) {
      ModelManagerProvider.setRootUrl('http://MOCKURL.com/model1');
      ModelManager2Provider.setRootUrl('http://MOCKURL.com/model2');
    });

    inject(function (_ModelManager_,_ModelManager3_, $httpBackend, _$rootScope_, _$timeout_) {
      ModelManager = _ModelManager_;
      ModelManager3 = _ModelManager3_;
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

  it('Should build an empty array when server return 204', function () {
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1')).respond(function(method, url, data) {
      return [204, undefined, {'X-Total-Count': 0}]
    });
    ModelManager.get().then(function (data) {
      expect(data).toEqual({data: [], meta: {total: '0'}})
    });
    httpBackend.flush();

  })

});
