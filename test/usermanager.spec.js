(function(){
    'use strict';


    describe('AuthService', function(){

        var fakeUrl = 'http://fakeurl/users';

        var fakeUser = {
            "_id"           : "0d0c8af7-9837-4147-b300-ea89877e2574",
            "__v"           : 0,
            "createdAt"     : "2015-02-07T21:28:56.000Z",
            "email"         : "john@90tech.fr",
            "firstname"     : "John",
            "lastname"      : "DOE",
            "isArchived"    : false,
            "updatedAt"     : "2015-09-07T11:40:07.515Z",
            "windowsDevices": [],
            "iOSDevices"    : [],
            "androidDevices": [],
            "companies"     : [],
            "recoveryEmails": [],
            "id"            : "0d0c8af7-9837-4147-b300-ea89877e2574"
        }

        beforeEach(function(){
            angular.module('90Tech.user-manager.test', ['90Tech.user-manager']);

            module('90Tech.user-manager.test', function(UserManagerProvider){
                UserManagerProvider.setRootUrl(fakeUrl);

            });
        });

        describe('UserManager', function(){

            var UserManager, httpBackend, rootScope;


            beforeEach(function(){
                inject(function(_UserManager_, $httpBackend, $rootScope){
                    UserManager = _UserManager_;
                    httpBackend = $httpBackend;
                    rootScope   = $rootScope;
                })
            });

            afterEach(function(){
                httpBackend.verifyNoOutstandingExpectation()
            });


            it('should exist', function(){
                expect(UserManager).toBeDefined();
            });

            it('should have set rootUrl', function(){
                expect(UserManager.rootUrl).toEqual(fakeUrl);
            });

            it('should query usersList', function(){
                httpBackend.expectGET(fakeUrl).respond();
                UserManager.getList();
            });

            it('should retrieve the list', function(){
                httpBackend.expectGET(fakeUrl).respond([fakeUser]);
                UserManager.getList().then(function(userList){
                    expect(userList.data.length).toEqual(1);
                });
                httpBackend.flush();
            });


            it ('should make complex query', function(){
                var expectedQuery = {
                    "limit": 100,
                    "skip": 10,
                    "conditions": {
                        "_id": {
                            "$in": [
                                1,
                                2,
                                3
                            ]
                        },
                        "$or": [
                            {
                                "firstname": {
                                    "$regex": ".*toto.*",
                                    "$options": "i"
                                }
                            },
                            {
                                "lastname": {
                                    "$regex": ".*toto.*",
                                    "$options": "i"
                                }
                            }
                        ]
                    },
                    "populate": '["titi","toto"]',
                    "archived": true,
                    "sort": "toto"
                } ;

                httpBackend.expectGET(new RegExp(fakeUrl + '\?' + '(.*)')).respond();

                UserManager.paginate({limit: 100, skip:10})
                .select([1,2,3])
                .populate(['titi', 'toto'])
                .archived(true)
                .sort('toto')
                .search('toto')
                .get();

                expect(UserManager.opts).toEqual(expectedQuery);
            });
        });
    });
})();