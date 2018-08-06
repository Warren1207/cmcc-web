angular.module('app').controller('PaySwipeController',
    ['$rootScope', '$scope','$uibModal','$profile',function($rootScope, $scope,$modal,$profile) {


        $scope.$on('$viewContentLoaded', function() {
            $scope.total ={E:10000,A:20000}

            $profile.getRequest('/operation/list/total').then(function(data) {
                $scope.total = data;
            })

            var sFn = function(c,name,ftl) {
                var et = c["E"+name] , val = c['A'+name] ? c[name] + '/' + c['A'+name] :c[name]
                if(et){  //如果上一个存在
                        return '<button type="button" class="btn red btn-block table-env-btn" data-action="open" data-id="'+ c['did'] + '" data-pos="'+ftl+'">'+val+'</button>'
                }else if(et==void 0 && val != void 0){
                    return '<button type="button" class="btn blue btn-block" disabled>'+val+'</button>'
                }else if(et===!1){
                    return '<button type="button" class="btn default btn-block" disabled>'+val+'</button>'
                }
                return '';
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
                                <button class="btn green btn-xs btn-outline" data-action="TMore" data-pos="12333" data-id="'+ c.id+ '">+</button>\
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
                                <button class="btn green btn-xs btn-outline" data-action="SMore" data-pos="12333" data-id="'+ c.id+ '">+</button>\
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
                            $profile.open(angular.url('/paySwipe/detail'),'PaySwipeDetailController','lg',{id:d.id,pos:d.pos}).result.then(function() {
                                $scope.table.draw();
                            })
                        }else{
                        }
                    })

                }
            })
        });
    }]);


app.controller("PaySwipeDetailController",['$scope','$http','$uibModalInstance','$profile','action',
    function($scope,$http,$uibModalInstance,$profile ,action) {
        $scope.pos=action.pos;
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.card = {};
        $scope.bankNos = {};
        $scope.accountWays = {};
        $scope.ccs = {};
        $scope.poss = {};
        $scope.merchants = {};
        $scope.card = {
            id:action.id
        };
        $profile.getRequest(angular.url('/operation/detailRepay/',action.id)).then(function(data) {
            $scope.card = data;
            $scope.card.posId = '';
            $scope.card.actualAmount = data.amount;
        })

        $profile.getRequest(angular.url('/operation/dict/')).then(function(data) {
            $scope.bankNos = $profile.convSelect2(data.bankNos,"id");
            $scope.ccs = $profile.convSelect2(data.ccs,"id");
            // $scope.bankNos = $scope.card.bankNos;
        })
        $profile.getRequest(angular.url('/operation/detailSwipe/',action.id)).then(function(data) {
            $scope.card = data;
            $scope.card.actualAmount = data.amount;
            $scope.accountWays = $scope.card.accountWays;
            //$scope.poss = $scope.card.todayPoss;
            // $scope.ccs = $profile.convSelect2(data.ccs , "id") || {};
            // if(! $scope.card.hasTodayPoss){
            //     $profile.error("没有今日POS资源！");
            //     $uibModalInstance.close('')
            //     return;
            // }
        })

        $scope.$watch('card.cityCode', function(){
            delete $scope.card.posId;
            delete $scope.card.merchantId;
            if(!!$scope.card.cityCode){
                $profile.getRequest(angular.url('/operation/get/pos/',$scope.card.cityCode)).then(function(data) {
                    $scope.poss = data;
                })
            }
        }, true);
        $scope.$watch('card.posId', function(){
            if(!!$scope.card.posId){
                $profile.getRequest(angular.url('/swipecard/dictSwipe/',$scope.card.posId)).then(function(data) {
                    $scope.merchants = data.merchants;
                    $scope.card.accountWay = data.accountWay;
                    $scope.card.merchantId = data.merchantId;
                    $scope.card.merchantChooseType = data.merchantChooseType;
                })
            }
        }, true);

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