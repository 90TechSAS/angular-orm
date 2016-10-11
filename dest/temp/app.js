'use strict';

// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _DaoHelper = require('./DaoHelper');

var _DaoHelper2 = _interopRequireDefault(_DaoHelper);

var _managersTstManager1 = require('./managers/tstManager1');

var _managersTstManager12 = _interopRequireDefault(_managersTstManager1);

var _managersTstManager2 = require('./managers/tstManager2');

var _managersTstManager22 = _interopRequireDefault(_managersTstManager2);

var _managersTstManager3 = require('./managers/tstManager3');

var _managersTstManager32 = _interopRequireDefault(_managersTstManager3);

var _module = angular.module('tstModule', []);

_DaoHelper2['default'].registerService(_module, 'ModelManager', _managersTstManager12['default']);
_DaoHelper2['default'].registerService(_module, 'ModelManager2', _managersTstManager22['default']);
_DaoHelper2['default'].registerService(_module, 'ModelManager3', _managersTstManager32['default']);