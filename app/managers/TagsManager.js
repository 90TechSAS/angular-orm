'use strict';

import TagsModel from './../models/TagsModel.js';
import GenericDao from '../GenericDao';
import QueryBuilder from '../QueryBuilder';

var DAO = GenericDao(TagsModel);

export default class TagsModelManager extends DAO {
};
