angular.module('app').controller('AgentsListController',
    ['$rootScope', '$scope','$uibModal','$profile',function($rootScope, $scope,$modal,$profile) {
        $scope.$on('$viewContentLoaded', function() {
            App.initAjax();
            $scope.tableConfig = ({
                ajax:{
                    url :'/agents/list'
                },
                pageLength: 10,
                formPanel: [
                    {name: "name", text: "姓名", type: 'text', size: 4},
                    {name: "wxNo", text: "微信", type: 'text', size: 4}
                ],
                aoColumns : [
                    {
                        mData: null, mRender: function (a, b, c) {
                        return c['id'] || ''
                    }},
                    {
                        mData: null, mRender: function (a, b, c) {
                        return c['name'] || ''
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
                        return c['wxNo'] || ''
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
                            var url = '/agents/display/delete/'+d.id
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
                        templateUrl : angular.url('/agents/display/add'),
                        backdrop:"static",
                        size :'lg',
                        controller: 'AgentsEditCtrl',
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
                templateUrl : angular.url('/agents/display/add'),
                backdrop:"static",
                size :'lg',
                controller: 'AgentsCreateCtrl',
                keyboard:'false',
                scope:$scope
            }).result.then(function(v){
                $scope.table.draw();
            })
        }
    }]);

app.controller('AgentsCreateCtrl', ['$scope','$uibModalInstance','$profile',function ($scope, $uibModalInstance,$profile) {
    $scope.cancle=$uibModalInstance.dismiss;
    $scope.title = "归属人资料新增";
    $scope.dict = {};
    $scope.agent={};
    $scope.ok = function(isValid){
        if(isValid)
            $profile.post('/agents/display/add/',$scope.agent).then(function(data){
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

app.controller('AgentsEditCtrl', ['$scope','$uibModalInstance','$profile','action',function ($scope, $uibModalInstance,$profile,action) {

    $scope.cancle=$uibModalInstance.dismiss;
    $scope.title = "归属人资料编辑";
    $scope.agent={};
    $scope.init = function(){
        $profile.getRequest("/agents/display/edit/"+action.id).then(function(data){
            $scope.agent=data;
        })
    }
    $scope.init();
    $scope.ok = function(isValid){
        if(isValid)
            $profile.post('/agents/display/add/',$scope.agent).then(function(data){
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

