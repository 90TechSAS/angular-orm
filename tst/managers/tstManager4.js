'use strict';

import Model4 from './../models/tstModel4.js';
import GenericDao from '../GenericDao';
import Discriminator from '../Discriminator'

var D1 = Discriminator(Model4, 'Type1')
var D2 = Discriminator(Model4, 'Type2')


var DAO = GenericDao(Model4, undefined, [D1, D2]);

export default class ModelManager4 extends DAO {
};
