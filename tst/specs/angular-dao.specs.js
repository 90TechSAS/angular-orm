describe('Angular DAO', function(){

    var ModelManager, httpBackend, $rootScope;

    beforeEach(function(){

        module('tstModule', function(ModelManagerProvider, ModelManager2Provider){
            ModelManagerProvider.setRootUrl('http://MOCKURL.com/model1');
            ModelManager2Provider.setRootUrl('http://MOCKURL.com/model2');
        });

        inject(function(_ModelManager_, $httpBackend, _$rootScope_){
            ModelManager = _ModelManager_;
            httpBackend  = $httpBackend;
            $rootScope = _$rootScope_;


        })

    });

    afterEach(function(){
        httpBackend.verifyNoOutstandingExpectation()
    });


    it('should have a modelManager', function(){
        expect(ModelManager).toBeDefined();
    });

    it('should query for the list', function(){
        httpBackend.expectGET('http://MOCKURL.com/model1').respond();
        ModelManager.get();
    });

    it('should query for one element', function(){
        httpBackend.expectGET('http://MOCKURL.com/model1/ididid').respond();
        ModelManager.getById('ididid');
    });

    it('should make a post query', function(){
        httpBackend.expectPOST('http://MOCKURL.com/model1/filters').respond();
        ModelManager.post();
    });

    it('should provide with a query builder', function(){
        var qb = ModelManager.query();
        expect(qb).toBeDefined();
    });

    it('Should return an ActiveRecord element', function(){
        httpBackend.expectGET('http://MOCKURL.com/model1/123').respond({
            _id: '1234656'
        });
        ModelManager.getById('123').then(function(data){
            expect(data.save).toBeDefined();
        });
        httpBackend.flush();

    });

    it('Should make subPopulate queries', function(){
        var model = ModelManager.create({
            _id   : '1234656',
            model2: '77777'
        });
        httpBackend.expectGET('http://MOCKURL.com/model2/77777').respond();
        model.populate('model2');
        httpBackend.flush();
       // $rootScope.$digest();

    });


});