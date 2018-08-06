angular.module('app').controller('OperatorBankListController',
    ['$rootScope', '$scope','$uibModal','$profile',function($rootScope, $scope,$modal,$profile) {
        $scope.$on('$viewContentLoaded', function() {
            App.initAjax();
            $scope.tableConfig = ({
                ajax:{
                    url :'/operator/list'
                },
                pageLength: 10,
                formPanel: [
                    {name: "operatorId", text: " 操作员", type: 'text', size: 4},
                    {name: "bankCardNo", text: "银行卡号", type: 'text', size: 4},
                    {name: "bankOwner", text: "卡主", type: 'text', size: 4}
                ],
                aoColumns : [
                    { mData: null, mRender: function (a, b, c) { return c['id'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['operatorId'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['bankCardNo'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['bankId'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['bankOwner'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['defaultBank']}},
                    {
                        mData: null, mRender: function (a, b, c) {
                        return   '<div class="btn-group pull-right">\
                            <button class="btn green btn-xs btn-outline dropdown-toggle" data-toggle="dropdown">操作\
                                <i class="fa fa-angle-down"></i>\
                                </button>\
                                <ul class="dropdown-menu pull-right"> \
                                <li>\
                                <a href="javascript:;" data-action="edit" data-id="'+ c.id+ '">\
                                <i class="fa fa-edit"></i> 编辑 </a>\
                                </li>\
                                <li>\
                                <a href="javascript:;" data-action="remove" data-id="'+ c.id +'">\
                                <i class="fa fa-remove"></i> 删除 </a>\
                                </li>\
                            </ul> </div>';
                    }}
                ],
                scope : $scope,
                remove_action: function (d, t) {
                    swal({
                            title: "你确定吗?",
                            text: "你确定删除数据吗？。",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonText: "确定",
                            confirmButtonClass: "btn-danger",
                            cancelButtonText:"取消",
                            cancelButtonClass:"btn-info",
                            closeOnConfirm: false
                        },
                        function(){
                            var url = '/operator/display/delete/'+d.id
                            $profile.post(url,{}).then(function(data) {
                                if(data.success){
                                    $profile.alter(data.message,function(){
                                        t.draw();
                                    })
                                }else{
                                    $profile.error(data.message)
                                }
                            })
                        });
                },
                edit_action : function(d,t){
                    $modal.open({
                        templateUrl : angular.url('/operator/display/add'),
                        backdrop:"static",
                        size :'lg',
                        controller: 'OperatorBankEditCtrl',
                        windowTemplateUrl : 'uib/template/modal/window-qp.html',
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
                }
            })
        });

        $scope.openAddPage = function() {
            $modal.open({
                templateUrl : angular.url('/operator/display/add'),
                backdrop:"static",
                size :'lg',
                controller: 'OperatorBankCreateCtrl',
                windowTemplateUrl : 'uib/template/modal/window-qp.html',
                keyboard:'false',
                scope:$scope
            }).result.then(function(v){
                $scope.table.draw();
            })
        }
    }]);


app.controller('OperatorBankCreateCtrl', ['$scope','$uibModalInstance','$profile',function ($scope, $uibModalInstance,$profile) {
    $scope.cancle=$uibModalInstance.dismiss;
    $scope.title = "操作员银行资料新增";
    $scope.dict = {};
    $scope.operatorBank={};
    $scope.banks={};
    $scope.operators={};

    $profile.getRequest("/operator/dict").then(function(data){
        $scope.dict=data;
        $scope.banks = $profile.convSelect2($scope.dict.banks,"code");
        $scope.operators = $profile.convSelect2($scope.dict.operators,"id");
    })
    $scope.ok = function(isValid){
        if(isValid)
            $profile.postForm('/operator/display/add/',$scope.operatorBank).then(function(data){
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


app.controller('OperatorBankEditCtrl', ['$scope','$uibModalInstance','$profile','action',function ($scope, $uibModalInstance,$profile,action) {

    $scope.cancle=$uibModalInstance.dismiss;
    $scope.title = "操作员银行资料编辑";
    $scope.dict = {};
    $scope.operatorBank={};
    $scope.banks={};
    $scope.operators={};

    $profile.getRequest("/operator/dict").then(function(data){
        $scope.dict=data;
        $scope.banks = $profile.convSelect2($scope.dict.banks,"code");
        $scope.operators = $profile.convSelect2($scope.dict.operators,"id");

    })
    $scope.init = function(){
        $profile.getRequest("/operator/display/edit/"+action.id).then(function(data){
            $scope.operatorBank=data;
            $scope.operatorBank.operatorId = data.operatorId + ""
            $scope.operatorBank.bankId = data.bankId + ""
        })
    }
    $scope.init();
    $scope.ok = function(isValid){
        if(isValid)
            $profile.postForm('/operator/display/add/',$scope.operatorBank).then(function(data){
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