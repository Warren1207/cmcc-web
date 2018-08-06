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
            $templateCache.put("lockingGridView.html",
                '<div class="panel panel-default m-b-none">' +
                    '<div class="hbox-auto-sm hbox">' +
                        '<div class="col" ng-style="lockStyle">' +
                            '<div class="hbox hbox-auto-sm ">' +
                                '<div class="col v-middle text-center" ng-repeat="lockCol in lockHeadArray">' +
                                '{{lockCol.text}}' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="col unlockedHead" style="overflow: hidden;">' +
                            '<table class="table m-b-none">' +
                                '<tr class="text-center" ng-repeat="unlockRow in unlockHeadArray">' +
                                    '<td class="text-center"  colspan="{{unlockCol.colSpan}}" ng-if="$parent.$index != 2" ng-repeat="unlockCol in unlockRow">' +
                                        '<span style="padding: 1px;width: 100px;">{{unlockCol.text}}</span>' +
                                    '</td>' +
                                    '<td class="text-center" style="min-width: 116px;"  ng-class="{true : \'bg-light\',false : \'bg-success\'}[unlockCol.isRest]" colspan="{{unlockCol.colSpan}}" ng-if="$parent.$index == 2" ng-repeat="unlockCol in unlockRow">' +
                                        '<span style="padding: 1px;width: 100px;">{{unlockCol.text}}</span>' +
                                    '</td>' +
                                '</tr>' +
                            '</table>' +
                        '</div>' +
                    '</div>' +
                    '<div class="hbox-auto-sm hbox">' +
                        '<div class="col" ng-style="lockStyle">' +
                            '<table class="table m-b-none">' +
                                '<tr ng-repeat="lockRow in lockArray">' +
                                    '<td ng-click="editCell($index,$parent.$index,true)" title="{{col.text}}" class="text-center padding-l-r-none" ng-repeat="col in lockRow">' +
                                        '<span class="text-ellipsis" style="padding: 1px;width: 100px;">{{col.text}}</span>' +
                                    '</td>' +
                                '</tr>' +
                                '<tr class="bg-info">' +
                                    '<td ng-repeat="total in totalLock track by $index" class="text-center padding-l-r-none">' +
                                        '<span style="padding: 1px;width: 100px;">{{total}}</span>' +
                                    '</td>' +
                                '</tr>' +
                            '</table>' +
                        '</div>' +
                        '<div class="col unlockedbody" style="overflow-x: auto">' +
                            '<table class="table">' +
                                '<tr ng-repeat="unlockRow in unlockArray">' +
                                    '<td ng-click="editCell($index,$parent.$index,false)" style="height: 37px;" class="text-center" title="{{col.text}}" ng-class="{true : \'bg-light\',false : \'bg-success\'}[col.isRest]" ng-repeat="col in unlockRow">' +
                                        '<span class="text-ellipsis" style="padding: 1px;width: 100px;">{{col.text}}</span>' +
                                    '</td>' +
                                '</tr>' +
                                '<tr class="bg-info">' +
                                    '<td ng-repeat="total in totalUNLock track by $index" style="height: 37px;" class="text-center">' +
                                        '<span style="padding: 1px;width: 100px;">{{total}}</span>' +
                                    '</td>' +
                                '</tr>' +
                            '</table>' +
                        '</div>' +
                    '</div>'
            );
        }]);

        app.directive('lockingGrid',function($http){
        return {
            restrict: 'EA',
            templateUrl: 'lockingGridView.html',
            replace: true,
            scope: {
                source : '=',
                colums : '=',
                total : '=',
                lockingWidth : '=',
                bindData : '=',
                click : '=',
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

                /**  数据汇总 **/
                scope.totalLock = [];
                scope.totalUNLock = [];

                var upMonth = null;
                var weekArray = [];
                var dataArray = [];
                scope.unlockHeadArray = [];

                scope.$watch('colums',function(newValue,oldValue){
                    scope.lockHeadArray=[];
                    scope.unlockHeadArray = [];

                    /** lockArray锁定列数据 unlockArray未锁定列数据  **/
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
                    scope.lockArray = [[]];
                    scope.unlockArray = [[]];
                    angular.forEach(newValue,function(data,index,array){
                        var lArray = [],unlArray=[];
                        angular.forEach(scope.lockHeadArray,function(col,childIndex,childArray){
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

                scope.$watch('total',function(totalObj){
                    scope.totalLock = [];
                    scope.totalUNLock = [];
                    angular.forEach(scope.lockHeadArray,function(col){
                        var name = col.name;
                        scope.totalLock.push(isNaN(Number.parseFloat(scope.total[0][name]))?'':totalObj[0][name]);
                    });
                    angular.forEach(scope.unlockHeadArray[2],function(col){
                        var name = col.name;
                        scope.totalUNLock.push(isNaN(Number.parseFloat(scope.total[0][name]))?'':totalObj[0][name]);
                    });
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
                    var row = scope.source[rowIndex-1];
                    scope.click.apply(scope,[row])
                    // swal({
                    //         title: "Modify",
                    //         text: "Write something interesting:",
                    //         type: "input",
                    //         showCancelButton: true,
                    //         closeOnConfirm: false,
                    //         animation: "slide-from-top",
                    //         inputPlaceholder: "提示信息"
                    //     },
                    //     function(inputValue){
                    //         if (inputValue === false) return false;
                    //
                    //         if (inputValue === "") {
                    //             swal.showInputError("You need to write something!");
                    //             return false
                    //         }
                    //         swal("Nice!", "填写成功！", "success");
                    //         scope.$apply(function () {
                    //             scope.source[rowIndex-1][attrName]=inputValue;
                    //         });
                    //     });
                }
            }
        }
    });

}));