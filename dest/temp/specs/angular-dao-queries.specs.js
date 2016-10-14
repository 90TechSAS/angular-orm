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

  it('Should query by Id if not key specified', function () {
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1?conditions={"_id":"2"}')).respond([]);
    ModelManager.get(ModelManager.query().select('2'));
    httpBackend.flush();
  });

  it('Should query directly if array size === 1', function () {
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1?conditions={"_id":"2"}')).respond([]);
    ModelManager.get(ModelManager.query().select(['2']));
    httpBackend.flush();
  });

  it('Should query with $in operator', function () {
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1?conditions={"_id":{"$in":["2","3"]}}')).respond([]);
    ModelManager.get(ModelManager.query().select(['2', '3']));
    httpBackend.flush();
  });

  it('Should query on another field if specified', function () {
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1?conditions={"label":"2"}')).respond([]);
    ModelManager.get(ModelManager.query().select(['2'], 'label'));
    httpBackend.flush();
  });

  it('Should merge queries on the same field, two single queries', function () {
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1?conditions={"label":{"$in":["2","3"]}}')).respond([]);
    ModelManager.get(ModelManager.query().select('2', 'label').select('3', 'label'));
    httpBackend.flush();
  });

  it('Should merge queries on the same field, two arrays queries', function () {
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1?conditions={"label":{"$in":["2","3","4","5"]}}')).respond([]);
    ModelManager.get(ModelManager.query().select(['2', '3'], 'label').select(['4', '5'], 'label'));
    httpBackend.flush();
  });

  it('Should merge queries on the same field, single then array', function () {
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1?conditions={"label":{"$in":["2","3","4"]}}')).respond([]);
    ModelManager.get(ModelManager.query().select('2', 'label').select(['3', '4'], 'label'));
    httpBackend.flush();
  });

  it('Should merge queries on the same field, array then single', function () {
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1?conditions={"label":{"$in":["2","3","4"]}}')).respond([]);
    ModelManager.get(ModelManager.query().select(['2', '3'], 'label').select('4', 'label'));
    httpBackend.flush();
  });
  it('Should merge queries on the same field, array then single-array', function () {
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1?conditions={"label":{"$in":["2","3","4"]}}')).respond([]);
    ModelManager.get(ModelManager.query().select(['2', '3'], 'label').select(['4'], 'label'));
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
    ModelManager.get(ModelManager.query().fields(["toto", "tutu"]));
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
    ModelManager.get(ModelManager.query().search('toto', ['name', 'label']));
    httpBackend.flush();
  });

  it('Should count', function () {
    httpBackend.expectGET(encodeURI('http://MOCKURL.com/model1?count=true')).respond([]);
    ModelManager.count();
    httpBackend.flush();
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
});