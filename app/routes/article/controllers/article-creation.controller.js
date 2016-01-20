/**
 * Created by Renaud ROHLINGER on 06/01/2015.
 * Article controller
 */

(function() {

    'use strict';

    angular
    	.module('angularOrm.article')
        .controller('ArticleCreationController', ArticleCreationController);
    function ArticleCreationController($state,$stateParams,$timeout,NotificationService,LoadingService,PostsManager,TagsManager,UsersManager) {
        var vm = this;
        var newTag={};
        var name="";
        var firstname="";
        var description="";
        var title="";
        var tags=[];
        var tagslist=[];
        var users=[];
        var user={};


        function AddTag(){
            if(vm.newTag!={}&&tags.indexOf(vm.newTag)==-1){
                tags.push(vm.newTag);
                vm.newTag = {};  
            }
        }


        function RemoveTag(tag){
            var i = tags.indexOf(tag);
            if(i != -1) {
                tags.splice(i, 1);
            }
        }
        function GetUserFullName(user) {
            return user.firstName + ' ' + user.lastName;
        };


        activate();
        
        LoadingService.set(true);

        function activate() {
           
            getTags().then(function() {
                getUsers().then(function() {
                    LoadingService.set(false);
                }); 
            });
        }

        function getUsers() {
            return UsersManager.get().then(function(users){
                vm.users = users.data;
                return vm.users;
            });
        }

        function getTags() {
            return TagsManager.get().then(function(tags){
                vm.tagslist = tags.data;
                return vm.tagslist;
            });
        }

        function createArticle(isValid){
            if(isValid) {
                PostsManager.create({title:vm.title, content:vm.description,user:vm.user,tags:vm.tags}).save().then(function(data){
                    NotificationService.notify('notify',"success","L'élément à été ajouté avec succès");
                });
            }
        }

        _.assign(vm, {
            AddTag:AddTag,
            RemoveTag:RemoveTag,
        	GetUserFullName:GetUserFullName,
            createArticle:createArticle,
            tags:tags,
            newTag:newTag,
            name:name,
            firstname:firstname,
            description:description,
            title:title,
            user:user,
            users:users,
            tagslist:tagslist
        });
    }
})();
