angular.module('app').controller('UsersListController',
    ['$rootScope', '$scope','$uibModal','$profile',function($rootScope, $scope,$modal,$profile) {
        $scope.$on('$viewContentLoaded', function() {
            App.initAjax();
            $scope.tableConfig = ({
                ajax:{
                    url :'/users/list'
                },
                pageLength: 10,
                formPanel: [
                    {name: "realName", text: "姓名", type: 'text', size: 4},
                    {name: "username", text: "用户名", type: 'text', size: 4}
                ],
                aoColumns : [
                    {
                        mData: null, mRender: function (a, b, c) {
                        return c['id'] || ''
                    }},
                    {
                        mData: null, mRender: function (a, b, c) {
                        return c['userName'] || ''
                    }},
                    {
                        mData: null, mRender: function (a, b, c) {
                        return c['realName'] || ''
                    }},
                    {
                        mData: null, mRender: function (a, b, c) {
                        return c['idCardNo'] || ''
                    }},
                    {
                        mData: null, mRender: function (a, b, c) {
                        return c['linkPhone'] || ''
                    }},
                    {
                        mData: null, mRender: function (a, b, c) {
                        return c['email'] || ''
                    }},
                    {
                        mData: null, mRender: function (a, b, c) {
                        return c['tenantName'];
                    }},
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
                            text: "你确定删除吗？。",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonText: "确定",
                            confirmButtonClass: "btn-danger",
                            cancelButtonText:"取消",
                            cancelButtonClass:"btn-info",
                            closeOnConfirm: false
                        },
                        function(){
                            var url = '/users/display/delete/'+d.id
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
                        templateUrl : angular.url('/users/display/add'),
                        backdrop:"static",
                        size :'lg',
                        controller: 'UsersEditCtrl',
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
                templateUrl : angular.url('/users/display/add'),
                backdrop:"static",
                size :'lg',
                controller: 'UsersCreateCtrl',
                keyboard:'false',
                scope:$scope
            }).result.then(function(v){
                $scope.table.draw();
            })
        }
    }]);

app.controller('UsersCreateCtrl', ['$scope','$uibModalInstance','$profile',function ($scope, $uibModalInstance,$profile) {
    $scope.cancle=$uibModalInstance.dismiss;
    $scope.title = "操作员新增";
    $scope.dict = {};
    $scope.role={}
    $scope.tenant={}
    $scope.user={};
    $profile.getRequest("/users/dict").then(function(data){
        $scope.dict=data;
        $scope.tenant=$profile.convSelect2($scope.dict.tenant,"code")
    })
    $scope.activeTenant = function(){
        $scope.user.role = "";
        var url = angular.url('/main/system/role/get/tenantId/',$scope.user.tenantId);
        $profile.getRequest(url).then(function(data){
            $scope.role=$profile.convSelect2(data,"id")
        })
    }
    $scope.ok = function(isValid){
        if(isValid)
            $profile.postForm('/users/display/add/',$scope.user).then(function(data){
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

app.controller('UsersEditCtrl', ['$scope','$uibModalInstance','$profile','action',function ($scope, $uibModalInstance,$profile,action) {

    $scope.cancle=$uibModalInstance.dismiss;
    $scope.title = "操作员编辑";
    $scope.dict={}
    $scope.user={};
    $scope.role={}
    $scope.tenant={}
    $scope.init = function(){
    $profile.getRequest("/users/dict").then(function(data){
        $scope.dict=data;
        $scope.role=$profile.convSelect2($scope.dict.role,"value")
        $scope.tenant=$profile.convSelect2($scope.dict.tenant,"code")

    })
        $scope.activeTenant = function(){
            $scope.user.role = "";
            var url = angular.url('/main/system/role/get/tenantId/',$scope.user.tenantId);
            $profile.getRequest(url).then(function(data){
                $scope.role=$profile.convSelect2(data,"id")
            })
        }
        $profile.getRequest("/users/display/edit/"+action.id).then(function(data){
            $scope.user=data;
            $scope.user.role = data.role+"";
            $scope.user.tenantId = data.tenantId+"";
            var url = angular.url('/main/system/role/get/tenantId/',$scope.user.tenantId);
            $profile.getRequest(url).then(function(data){
                $scope.role=$profile.convSelect2(data,"id")
            })
        })
    }
    $scope.init();
    $scope.ok = function(isValid){
        if(isValid)
            $profile.postForm('/users/display/add/'+action.id,$scope.user).then(function(data){
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
