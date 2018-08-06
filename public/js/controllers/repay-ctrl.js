angular.module('app').controller('RepayOperationListController',
    ['$rootScope', '$scope','$uibModal','$profile',function($rootScope, $scope,$modal,$profile) {
        $scope.$on('$viewContentLoaded', function() {
            var sFn = function(c,name,ftl) {
                var et = c["E"+name] , val = c['A'+name] ? c[name] + '/' + c['A'+name] :c[name]
                if(et){  //如果上一个存在
                    if(ftl) {
                        return '<button type="button" class="btn red btn-block table-env-btn" data-action="open" data-id="'+ c['did'] + '">'+val+'</button>'
                    }else{
                        return '<button type="button" class="btn red btn-block table-env-btn" disabled data-id="'+ c['did']+ '">'+val+'</button>'
                    }
                }else if(et==void 0 && val != void 0){
                    return '<button type="button" class="btn blue btn-block" disabled>'+val+'</button>'
                }else if(et===!1){
                    return '<button type="button" class="btn default btn-block" disabled>'+val+'</button>'
                }
                return '';
            }
            $scope.tableConfig = ({
                ajax:{
                    url :'/swipecard/list'
                },
                pageLength: 10,
                formPanel: [
                    {name: "cardNo", text: "卡号", type: 'text', size: 4},
                ],
                aoColumns : [
                    {mData: null, mRender: function (a, b, c) { return c['owner'] || '' }},
                    {mData: null, mRender: function (a, b, c) { return c['bankName'] || '' }},
                    {mData: null, mRender: function (a, b, c) { return c['card_no'] || '' }},
                    {mData: null, mRender: function (a, b, c) { return c['cdcc024'] || '' }},
                    {mData: null, mRender: function (a, b, c) { return c['amount'] || '' }},
                    {mData: null, mRender: function (a, b, c) { return sFn(c,'T1',!0)  }},
                    {mData: null, mRender: function (a, b, c) { return sFn(c,'T2',!0)  }},
                    {mData: null, mRender: function (a, b, c) { return sFn(c,'T3',!0)  }},
                    {mData: null, mRender: function (a, b, c) { return sFn(c,'T4',!0)  }},
                    {mData: null, mRender: function (a, b, c) { return sFn(c,'T5',!0)  }},
                    {mData: null, mRender: function (a, b, c) { return c['T0'] || '' }},
                    {mData: null, mRender: function (a, b, c) { return sFn(c,'S1',!1)  }},
                    {mData: null, mRender: function (a, b, c) { return sFn(c,'S2',!1) }},
                    {mData: null, mRender: function (a, b, c) { return sFn(c,'S3',!1) }},
                    {mData: null, mRender: function (a, b, c) { return sFn(c,'S4',!1) }},
                    {mData: null, mRender: function (a, b, c) { return sFn(c,'S5',!1) }},
                    {mData: null, mRender: function (a, b, c) { return c['S0'] || '' }},
                    {mData: null, mRender: function (a, b, c) { return c['T'] || '' }},
                    {mData: null, mRender: function (a, b, c) { return c[''] || '' }}
                ],
                scope : $scope,
                open_action :function(d,t) {
                    $profile.open(angular.url('/repay/detail'),'RepayOperationDetailController','lg',{id:d.id,pos:false}).result.then(function() {
                        $scope.table.draw();
                    })
                }
            })
        });
    }]);

app.controller("RepayOperationDetailController",['$scope','$http','$uibModalInstance','$profile','action',
    function($scope,$http,$uibModalInstance,$profile ,action) {
        $scope.pos = action.pos;
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.card = {};
        $scope.bankNos = {};
        $profile.getRequest(angular.url('/operation/detailRepay/',action.id)).then(function(data) {
            $scope.card = data;
            $scope.card.posId = '';
            $scope.card.actualAmount = data.amount;
        })

        $profile.getRequest(angular.url('/operation/dict/')).then(function(data) {
            $scope.bankNos = $profile.convSelect2(data.bankNos,"id");
            // $scope.bankNos = $scope.card.bankNos;
        })
        $scope.ok = function(isValid){
            if(isValid)
                $profile.postForm('/swipecard/create/',$scope.card).then(function(data){
                    if(data.success){
                        $profile.alter(data.message,function() {
                            $uibModalInstance.close('')
                        })
                    }else{
                        $profile.error(data.message)
                    }
                })

        }
    }])
