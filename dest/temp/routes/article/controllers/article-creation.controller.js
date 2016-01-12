/**
 * Created by Renaud ROHLINGER on 06/01/2015.
 * Article controller
 */

'use strict';

(function () {

    'use strict';

    angular.module('angularOrm.article').controller('ArticleCreationController', ArticleCreationController);
    function ArticleCreationController($state, $stateParams, $timeout, NotificationService, PostsManager, TagsManager, UsersManager) {
        var self = this;
        //var getArticle;
        // get id from stateParam
        //var id = $stateParams.instanceID;  	
        var newTag = {};
        var name = "";
        var firstname = "";
        var description = "";
        var title = "";
        var tags = [];
        var tagslist = [];
        var users = [];
        var user = {};

        function AddTag() {
            if (self.newTag != {} && tags.indexOf(self.newTag) == -1) {
                tags.push(self.newTag);
                self.newTag = {};
            }
        }

        function RemoveTag(tag) {
            var i = tags.indexOf(tag);
            if (i != -1) {
                tags.splice(i, 1);
            }
        }
        function GetUserFullName(user) {
            return user.firstName + ' ' + user.lastName;
        };

        UsersManager.get().then(function (users) {
            self.users = users.data;
        });
        TagsManager.get().then(function (tags) {
            self.tagslist = tags.data;
        });

        function createArticle(isValid) {
            if (isValid) {
                PostsManager.create({ title: self.title, content: self.description, user: self.user, tags: self.tags }).save().then(function (data) {
                    NotificationService.notify('notify', "success", "L'élément à été ajouté avec succès");
                });
                // event,type,message
            }
        }

        /*PostsManager.getById(id,PostsManager.query().populate(['tags','user'])).then(function(data){
               self.getArticle = data;
           });*/
        /*    PostsManager.post('/items/submit/new-item', function(req, res){
              new PostsModel(req.body.formContents).save(function (e) {
                res.send('item saved');
              });
            });*/

        _.assign(self, {
            AddTag: AddTag,
            RemoveTag: RemoveTag,
            GetUserFullName: GetUserFullName,
            createArticle: createArticle,
            tags: tags,
            newTag: newTag,
            name: name,
            firstname: firstname,
            description: description,
            title: title,
            user: user,
            users: users,
            tagslist: tagslist
        });
    }
})();