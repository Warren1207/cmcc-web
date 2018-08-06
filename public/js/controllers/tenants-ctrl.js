angular.module('app').controller('TenantsListController',
    ['$rootScope', '$scope','$uibModal','$profile',function($rootScope, $scope,$modal,$profile) {
        $scope.$on('$viewContentLoaded', function() {
            $scope.tableConfig = ({
                ajax:{
                    url:'/tenants/list',
                },
                formPanel: [
                    {name: "name", text: "名称", type: 'text', size: 6},
                    {name: "code", text: "代码", type: 'text', size: 6}
                ],
                aoColumns : [
                    {mData: null, mRender: function (a, b, c) { return c['id'] || '' }},
                    {mData: null, mRender: function (a, b, c) { return c['name'] || '' }},
                    {mData: null, mRender: function (a, b, c) { return c['code'] || '' }},
                    {mData: null, mRender: function (a, b, c) { return c['idCardNo'] || '' }},
                    {mData: null, mRender: function (a, b, c) { return c['linkPhone'] || '' }},
                    {mData: null, mRender: function (a, b, c) { return c['email'] || '' }},
                    {mData: null, mRender: function (a, b, c) { return c['costRate'] || '' }},
                    {mData: null, mRender: function (a, b, c) { return c['expireDate'] || '' }},
                    {mData: null, mRender: function (a, b, c) { return c['isLeaf'] || '' }},
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
                            var url = '/tenants/display/delete/'+d.id
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
                        templateUrl : angular.url('/tenants/add'),
                        backdrop:"static",
                        size :'lg',
                        controller: 'TenantsEditCtrl',
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
                templateUrl : angular.url('/tenants/add'),
                backdrop:"static",
                size :'lg',
                controller: 'TenantsCreateCtrl',
                keyboard:'false',
                scope:$scope
            }).result.then(function(v){
                $scope.table.draw();
            })
        }
    }]);
app.controller('TenantsCreateCtrl', ['$scope','$uibModalInstance','$profile',function ($scope, $uibModalInstance,$profile) {
    $scope.cancle=$uibModalInstance.dismiss;
    $scope.title = "代理商资料新增";
    $scope.tenants={};
    $scope.selectReg = function(){
        $profile.open('/area/selected','selectedAreaCtrl').result.then(function(value){
            $scope.tenants.area=value.code.join(',');
            $scope.tenants.address=value.name.join(',');
        })
    }
    $scope.ok = function(isValid){
        if(isValid)
            $profile.postForm('/tenants/display/add/',$scope.tenants).then(function(data){
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


app.controller('TenantsEditCtrl', ['$scope','$uibModalInstance','$profile','action',
    function ($scope, $uibModalInstance,$profile,action) {
        $scope.cancle=$uibModalInstance.dismiss;
        $scope.title = "代理商资料编辑编辑";
        $scope.tenants={};
        $scope.init = function(){
            $profile.getRequest("/tenants/display/edit/"+action.id).then(function(data){
                $scope.tenants=data;
                $scope.tenants.isLeaf = data.isLeaf +""
            })
            $profile.getRequest('/tenants/display/dict/'+action.id).then(function(value){
                var areaAddress = $profile.areaAddress(value,'code','name');
                $scope.tenants.area=areaAddress.code.join(',');
                $scope.tenants.address=areaAddress.name.join(',')
            })
        }
        $scope.selectReg = function(){
            $profile.open('/area/selected','idSelectedAreaCtrl','lg',{
                "id":action.id
            }).result.then(function(value){
                $scope.tenants.area=value.code.join(',');
                $scope.tenants.address=value.name.join(',');
            })
        }
        $scope.init();
        $scope.ok = function(isValid){
            if(isValid)
                $profile.postForm('/tenants/display/add/',$scope.tenants).then(function(data){
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
