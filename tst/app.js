
import DaoHelper from './DaoHelper';

import ModelManager from './managers/tstManager1';
import ModelManager2 from './managers/tstManager2';
import ModelManager3 from './managers/tstManager3';
import ModelManager4 from './managers/tstManager4';


var module = angular
    .module('tstModule', []);

DaoHelper.registerService(module, 'ModelManager', ModelManager);
DaoHelper.registerService(module, 'ModelManager2', ModelManager2);
DaoHelper.registerService(module, 'ModelManager3', ModelManager3);
DaoHelper.registerService(module, 'ModelManager4', ModelManager4);