'use strict';

import PostsModel from './../models/PostsModel.js';
import GenericDao from '../GenericDao';
import QueryBuilder from '../QueryBuilder';

var DAO = GenericDao(PostsModel);

export default class ModelManager extends DAO {
};
