'use strict';
angular.module('uix.select',[]).value('uixSelectConfig', {}).
directive('uixSelect',['uixSelectConfig', '$profile',
function(uixSelectConfig, $profile) {
    return {
        restrict: 'A',
        template: '<option value="{{item.id}}" ng-repeat="item in items">{{ item.text }}</option>',
        compile: function uiJqCompilingFunction(tElm, tAttrs) {
            return function(scope, elm, attrs) {
                var _url = angular.url("/main/lookup/get/",attrs['uixSelect'])
                scope.items=[];
                $profile.getRequest(_url).then(function(data){
                    scope.items=data;
                })
            }
        }
    }
}])
