angular.module('app').controller('OperationListController',
    ['$rootScope', '$scope','$uibModal','$profile',function($rootScope, $scope,$modal,$profile) {


        $scope.$on('$viewContentLoaded', function() {
            $scope.total ={E:10000,A:20000}

            $profile.getRequest('/operation/list/total').then(function(data) {
                $scope.total = data;
            })

            var sFn = function(c,name,f) {
                var et = c["E"+name] ,at = c["A"+name]||0 , val = c[name]
                if(!!val){
                    if(et===!1){  //如果上一个存在
                        val = [val,'/',at].join('');
                        var did = c[name+'ID']
                        return '<button type="button" class="btn red btn-block table-env-btn" data-action="open" data-id="'+ did+ '" data-pos="'+f+'">'+val+'</button>'
                    }else {
                        return '<button type="button" class="btn blue btn-block" disabled>'+val+'</button>'
                    }
                }
                return ''
            }
            $scope.tableConfig = ({
                ajax:{
                    url :'/operation/list'
                },
                pageLength: 10,
                //paging:false,
                formPanel: [
                    {name: "cardNo", text: "卡号", type: 'text', size: 4},
                    {name: "name", text: "持卡人", type: 'text', size: 4},
                    {name: "date", text: "日期", type: 'date', size: 4}
                ],
                aoColumns : [
                    {mData: null, mRender: function (a, b, c) { return c['owner'] || '' }},
                    {mData: null, mRender: function (a, b, c) { return c['bankName'] || '' }},
                    {mData: null, mRender: function (a, b, c) { return c['card_no'] || '' }},
                    {mData: null, mRender: function (a, b, c) { return c['cdcc024'] || '' }},
                    {mData: null, mRender: function (a, b, c) { return c['amount'] || '' }},
                    {mData: null, mRender: function (a, b, c) { return sFn(c,'T1',!1) }},
                    {mData: null, mRender: function (a, b, c) { return sFn(c,'T2',!1)  }},
                    {mData: null, mRender: function (a, b, c) { return sFn(c,'T3',!1)  }},
                    {mData: null, mRender: function (a, b, c) { return sFn(c,'T4',!1)  }},
                    {mData: null, mRender: function (a, b, c) { return sFn(c,'T5',!1)  }},
                    {
                        mData: null, mRender: function (a, b, c) {
                            return '<div class="buttons">\
                                <button class="btn green btn-xs btn-outline" data-action="TMore" data-id="'+ c.id+ '">+</button>\
                            </div>'
                        }},
                    {mData: null, mRender: function (a, b, c) { return c['T0'] || '' }},
                    {mData: null, mRender: function (a, b, c) { return sFn(c,'S1',!0)  }},
                    {mData: null, mRender: function (a, b, c) { return sFn(c,'S2',!0) }},
                    {mData: null, mRender: function (a, b, c) { return sFn(c,'S3',!0) }},
                    {mData: null, mRender: function (a, b, c) { return sFn(c,'S4',!0) }},
                    {mData: null, mRender: function (a, b, c) { return sFn(c,'S5',!0) }},
                    {
                        mData: null, mRender: function (a, b, c) {
                            return '<div class="buttons">\
                                <button class="btn green btn-xs btn-outline" data-action="SMore" data-id="'+ c.id+ '">+</button>\
                            </div>'
                        }},
                    {mData: null, mRender: function (a, b, c) { return c['S0'] || '' }},
                    {mData: null, mRender: function (a, b, c) { return c['T'] || '' }},
                    {mData: null, mRender: function (a, b, c) { return c[''] || '' }}
                ],
                scope : $scope,
                open_action :function(d,t) {
                    $profile.getRequest(angular.url('/users/display/currentUser')).then(function(data) {
                        if(data.isAdmin){
                            $profile.open(angular.url('/operation/detail'),'OperationDetailSuperController','lg',{id:d.id,pos:d.pos}).result.then(function() {
                                $scope.table.draw();
                            })
                        }else{
                            $profile.open(angular.url('/operation/detail'),'OperationDetailController','lg',{id:d.id,pos:d.pos}).result.then(function() {
                                $scope.table.draw();
                            })
                        }
                    })

                }
            })
        });
    }]);


app.controller("OperationDetailController",['$scope','$http','$uibModalInstance','$profile','action',
    function($scope,$http,$uibModalInstance,$profile ,action) {
        $scope.pos=action.pos;
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.card = {};
        $profile.getRequest(angular.url('/operation/detail/get/',action.id)).then(function(data) {
            $scope.card = data;
        })
    }])

app.controller("OperationDetailSuperController",['$scope','$http','$uibModalInstance','$profile','action',
    function($scope,$http,$uibModalInstance,$profile ,action) {
        $scope.pos=action.pos;
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.card = {};
        $profile.getRequest(angular.url('/operation/detail/get/',action.id)).then(function(data) {
            $scope.card = data;
        })
        $scope.ok = function(isValid) {
                $profile.postForm('/operation/detail/save/', $scope.card).then(function (data) {
                    if (data.success) {
                        $profile.alter(data.message, function () {
                            $uibModalInstance.close('')
                        })
                    } else {
                        $profile.error(data.message)
                    }
                })
        }
    }])