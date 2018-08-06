angular.module('app').controller('grossListController',
    ['$rootScope', '$scope','$uibModal','$location','$profile',function($rootScope, $scope,$modal,$location,$profile) {
        $scope.$on('$viewContentLoaded', function() {
            App.initAjax();
            $scope.tableConfig = ({
                ajax:{
                    url :'/gross/list'
                },
                scrollX:true,
                aoColumns : [
                    { mData: null, mRender: function (a, b, c) { return c['id'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['tenantId'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['tenantCode'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['tenantName'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['status'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['profit'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['remarks'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['grossDate'] || '' }}
                ],
                scope : $scope
            })
        });

        $scope.openAddPage=function(){
            $modal.open({
                templateUrl:angular.url("/gross/display/add"),
                backdrop:'static',
                size:'lg',
                controller:'grossCreateController',
                keyboard:'false',
                scope:$scope
            }).result.then(function(v){
                $scope.table.draw();
            })
        }
    }]);

app.controller('grossCreateController', ['$scope','$uibModalInstance','$profile',function ($scope, $uibModalInstance,$profile) {
    $scope.cancle=$uibModalInstance.dismiss;
    $scope.title = "收支资料新增";
    $scope.dict = {};
    $scope.gross={};

    $scope.ok = function(isValid){
        if(isValid)
            $profile.postForm('/gross/display/add/',$scope.gross).then(function(data){
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