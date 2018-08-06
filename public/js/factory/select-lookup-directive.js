/**
 * Created by warren on 2017/7/30.
 */
(function(angular, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['angular'], function(angular) {
            return factory(angular);
        });
    } else {
        return factory(angular);
    }
}(window.angular || null, function(angular) {
        var app = angular.module('lockingGrid',[]);
        app.run(["$templateCache", function($templateCache) {
            $templateCache.put("selectLookupView.html",
                '<select class="form-control"><option ng-repeat="item in items">{{item.text}}</option></select>'
            );
        }]);

        app.directive('selectLookup',function($http){
        return {
            restrict: 'EA',
            templateUrl: 'selectLookupView.html',
            replace: true,
            scope: {
                source : '=',
                colums : '=',
                lockingWidth : '=',
                bindData : '=',
                onReturn : '&'
            },
            link: function(scope, element, attrs) {

                scope.lockStyle = {};
                /** lockHeadArray锁定列表头 unlockHeadArray未锁定列表头  **/
                scope.lockHeadArray = [];
                scope.unlockHeadArray = [];
                /** lockArray锁定列数据 unlockArray未锁定列数据  **/
                scope.lockArray = [[]];
                scope.unlockArray = [[]];

                var upMonth = null;
                var weekArray = [];
                var dataArray = [];
                scope.unlockHeadArray = [];

                scope.$watch('colums',function(newValue,oldValue){
                    angular.forEach(scope.colums,function(data,index,array){
                        if(data.lock){
                            scope.lockHeadArray.push(data);
                        }else{
                            if( !upMonth ){
                                weekArray = [];
                                dataArray = [];
                                upMonth = data.month;

                                weekArray.push({colSpan : 1, name : data.name, text : data.week, isRest : data.isRest});
                                dataArray.push({colSpan : 1, name : data.name, text : data.date, isRest : data.isRest});
                            }else if( upMonth && upMonth!=data.month ){
                                var length = weekArray.length;
                                if(scope.unlockHeadArray.length == 0){
                                    scope.unlockHeadArray = [[],[],[]];
                                }
                                scope.unlockHeadArray[0].push({colSpan : length,text : upMonth});
                                scope.unlockHeadArray[1] = scope.unlockHeadArray[1].concat(dataArray);
                                scope.unlockHeadArray[2] = scope.unlockHeadArray[2].concat(weekArray);

                                weekArray = [];
                                dataArray = [];
                                upMonth = data.month;

                                weekArray.push({colSpan : 1, name : data.name, text : data.week, isRest : data.isRest});
                                dataArray.push({colSpan : 1, name : data.name, text : data.date, isRest : data.isRest});

                            }else{
                                weekArray.push({colSpan : 1, name : data.name, text : data.week, isRest : data.isRest});
                                dataArray.push({colSpan : 1, name : data.name, text : data.date, isRest : data.isRest});
                            }

                            if( index == array.length-1 ){
                                var length = weekArray.length;
                                if(scope.unlockHeadArray.length == 0){
                                    scope.unlockHeadArray = [[],[],[]];
                                }
                                scope.unlockHeadArray[0].push({colSpan : length,text : upMonth});
                                scope.unlockHeadArray[1] = scope.unlockHeadArray[1].concat(dataArray);
                                scope.unlockHeadArray[2] = scope.unlockHeadArray[2].concat(weekArray);

                                scope.lockStyle = {
                                    width : scope.lockHeadArray.length * 100 +'px'
                                }
                            }
                        }
                    });
                });

                scope.$watch('source',function(newValue,oldValue){
                    angular.forEach(newValue,function(data,index,array){
                        var lArray = [],unlArray=[];
                        angular.forEach(scope.lockHeadArray,function(col){
                            var name = col.name;
                            lArray.push({
                                name : name,
                                text : data[name]
                            });
                        });
                        scope.lockArray.push(lArray);
                        angular.forEach(scope.unlockHeadArray[2],function(col){
                            var name = col.name;
                            unlArray.push({
                                name : name,
                                isRest : col.isRest,
                                text : data[name]
                            });
                        });
                        scope.unlockArray.push(unlArray);
                    })
                });

                element.find('.unlockedbody').scroll(function(){
                    var leftIndex = $(this).scrollLeft();
                    element.find('.unlockedHead').scrollLeft(leftIndex);
                });

                scope.editCell = function(colIndex,rowIndex,isLock){
                    var attrName = null;
                    if(isLock){
                        attrName = scope.lockHeadArray[colIndex]["name"];
                    }else{
                        attrName = scope.unlockHeadArray[2][colIndex]["name"];
                    }
                    scope.source[rowIndex-1][attrName]=222;
                    swal({
                            title: "Modify",
                            text: "Write something interesting:",
                            type: "input",
                            showCancelButton: true,
                            closeOnConfirm: false,
                            animation: "slide-from-top",
                            inputPlaceholder: "提示信息"
                        },
                        function(inputValue){
                            if (inputValue === false) return false;

                            if (inputValue === "") {
                                swal.showInputError("You need to write something!");
                                return false
                            }
                            swal("Nice!", "填写成功！", "success");
                            scope.$apply(function () {
                                scope.source[rowIndex-1][attrName]=inputValue;
                            });
                        });
                }
            }
        }
    });

}));