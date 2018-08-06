angular.module('app').controller('OverpastController',
    ['$rootScope', '$scope','$uibModal','$profile',function($rootScope, $scope,$modal,$profile) {
        $scope.$on('$viewContentLoaded', function() {
            $scope.tableConfig = ({
                ajax:{
                    url :'/overpast/list'
                },
                pageLength: 10,
                formPanel: [
                    {name: "cardNo", text: "卡号", type: 'text', size: 4},
                    {name: "owner", text: "卡主", type: 'text', size: 4}
                ],
                aoColumns : [
                    {mData: null, mRender: function (a, b, c) {return c['owner'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['cardNo'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['cdap009'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['bankname'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['payInReturn'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['nf'] || '0'}},
                    {mData: null, mRender: function (a, b, c) {return c['nf'] || c['payInReturn'] || '0'}},
                    {mData: null, mRender: function (a, b, c) {return c['cdcc014'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['cdcc015'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['fee'] || ''}},
                    {
                        mData: null, mRender: function (a, b, c) {


                            return '<div class="buttons">\
                                <button class="btn green btn-xs btn-outline" data-action="bark" data-id="'+ c.id+ '">退卡</button>\
                            </div>'

                       // return   '<div class="btn-group pull-left"><button class="btn green btn-xs " data-action="bark" data-id="'+ c.id+ '">退卡</button></div>'
                    }}
                ],
                scope : $scope,
                option_action : function(d,t){
                    $modal.open({
                        templateUrl : angular.url('/expire/payment'),
                        backdrop:"static",
                        size :'lg',
                        controller: 'CardsPaymentEditCtrl',
                        keyboard:'false',
                        scope:$scope,
                        resolve:{
                            action:{
                                id : d.id
                            }
                        }
                    }).result.then(function(v){
                        $scope.table.draw();
                    })
                },
                bark_action : function(d,t){
                    swal({
                            title: "你确定吗?",
                            text: "你确定需要退卡吗？。",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonText: "确定",
                            confirmButtonClass: "btn-danger",
                            cancelButtonText:"取消",
                            cancelButtonClass:"btn-info",
                            closeOnConfirm: false
                        },
                        function(){
                            var url = angular.url('/overpast/bark/',d.id);
                            $profile.post(url,{}).then(function(data){
                                if(data.success){
                                    $profile.alter(data.message,function(){
                                        t.draw();
                                    })
                                }else{
                                    $profile.error(data.message)
                                }
                            })
                        });
                }
            })
        });

    }]);


app.controller('CardsPaymentEditCtrl', ['$scope','$uibModalInstance','$profile','action',function ($scope, $uibModalInstance,$profile,action) {

    $scope.cancle=$uibModalInstance.dismiss;
    $scope.title = "缴费单";
    $scope.fee = {};
    $scope.changeAmount = function() {
        var confirmationAmount = $scope.fee.confirmationAmount;
        $scope.fee.projectedFee = confirmationAmount * $scope.fee.returnRate/100;
        $scope.fee.actualFee = $scope.fee.projectedFee
    }
    $scope.init = function(){
        $profile.getRequest("/expire/payment/"+action.id).then(function(data){
            $scope.fee=data;
        })
    }
    $scope.init();
    $scope.ok = function(isValid) {
        if (isValid)
            $profile.postForm('/expire/payment/save/', $scope.fee).then(function (data) {
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
