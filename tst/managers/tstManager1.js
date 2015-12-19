'use strict';

import Model from './../models/tstModel1.js';
import GenericDao from '../GenericDao';
import QueryBuilder from '../QueryBuilder';

var DAO = GenericDao(Model);

export default class ModelManager extends DAO {
};
