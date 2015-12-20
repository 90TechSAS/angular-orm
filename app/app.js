
import DaoHelper from './DaoHelper';

import ModelManager from './managers/tstManager1';
import ModelManager2 from './managers/tstManager2';


var module = angular
    .module('tstModule', []);

DaoHelper.registerService(module, 'ModelManager', ModelManager);
DaoHelper.registerService(module, 'ModelManager2', ModelManager2);