(function(){
    'use strict';


    describe('UserModel', function(){

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
        };

        beforeEach(function(){
            angular.module('90Tech.user-manager.test', ['90Tech.user-manager']);

            module('90Tech.user-manager.test', function(UserManagerProvider){
                UserManagerProvider.setRootUrl(fakeUrl);

            });
        });

        describe('UserModel', function(){

            var UserManager, httpBackend, rootScope, user;


            beforeEach(function(){
                inject(function(_UserManager_, $httpBackend, $rootScope){
                    UserManager = _UserManager_;
                    httpBackend = $httpBackend;
                    rootScope   = $rootScope;
                    user        = UserManager.create();
                })
            });

            afterEach(function(){
                httpBackend.verifyNoOutstandingExpectation()
            });


            it('Should have a save method', function(){
                expect(user.save).toBeDefined();
            });

            it('Sould be able to save', function(){
                user.save();
                httpBackend.expectPOST('http://fakeurl/users').respond();
            });


        });
    });
})();