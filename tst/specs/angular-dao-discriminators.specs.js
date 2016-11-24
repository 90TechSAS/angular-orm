describe('Angular DAO', function () {

  var ModelManager, ModelManager3, httpBackend, $rootScope, $timeout;

  beforeEach(function () {

    module('tstModule', function (ModelManager4Provider) {
      ModelManager4Provider.setRootUrl('http://MOCKURL.com/model2');
      ModelManager4Provider.setDiscriminatorUrl('Type1', 'http://fakeurl/type1');
      ModelManager4Provider.setDiscriminatorUrl('Type2', 'http://fakeurl/type2');
    });

    inject(function (_ModelManager4_, $httpBackend, _$rootScope_, _$timeout_) {
      ModelManager4 = _ModelManager4_;
      httpBackend = $httpBackend;
      $rootScope = _$rootScope_;
      $timeout = _$timeout_;
    })
  });

  it ('should be possible to instantiate discriminators', function(){
    expect(ModelManager4.discriminators.length).toEqual(2)
    expect(ModelManager4.discriminators[0].type).toEqual('Type1')
    expect(ModelManager4.discriminators[1].type).toEqual('Type2')
    expect(ModelManager4.discriminators[0].discriminatorUrl).toEqual('http://fakeurl/type1')
    expect(ModelManager4.discriminators[1].discriminatorUrl).toEqual('http://fakeurl/type2')
  })

  it ('should make GET queries on parent url', function(){
    httpBackend.expectGET('http://MOCKURL.com/model2').respond();
    ModelManager4.get();
    httpBackend.flush();
  })

  it ('should instanciate discriminators according to __t value', function(){
    // TODO : make a GET request, respond with two types, and check their urls
    httpBackend.expectGET('http://MOCKURL.com/model2').respond([{_id: 123, name: 'Type1', __t: 'Type1'}, {_id: 321, name: 'Type2', __t: 'Type2'}]);

    ModelManager4.get().then(function (data) {
      expect(data.data[0].rootUrl).toEqual('http://fakeurl/type1');
      expect(data.data[1].rootUrl).toEqual('http://fakeurl/type2');
    });
    httpBackend.flush();
  })

  it ('should make POST queries on correct discriminator URL', function () {
    var obj = ModelManager4.createModel({_id: 123456, name: '12345', __t: 'Type1'})
    obj.name = '23456'
    httpBackend.expectPUT('http://fakeurl/type1/123456', {name: '23456'}).respond()
    obj.save()
  })



  afterEach(function () {
    httpBackend.verifyNoOutstandingExpectation()
  });

});
