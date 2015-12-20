'use strict';

import UsersModel from './../models/UsersModel.js';
import GenericDao from '../GenericDao';
import QueryBuilder from '../QueryBuilder';

var DAO = GenericDao(UsersModel);

export default class UsersModelManager extends DAO {
};
