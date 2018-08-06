angular.module('app').controller('SysparametersListController',
    ['$rootScope', '$scope','$uibModal','$profile',function($rootScope, $scope,$modal,$profile) {
        $scope.$on('$viewContentLoaded', function() {
            $scope.tableConfig = ({
                ajax:{
                url:'/sysparameters/listnew',
                },
                pageLength: 10,
                formPanel: [
                    {name: "name", text: "名称", type: 'text', size: 4},
                    {name: "tenantID", text: "代理ID", type: 'text', size: 4},
                ],
                aoColumns : [
                    {mData: null, mRender: function (a, b, c) {return c['id'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['tenantId'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['param0'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['param1'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['param2'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['param3'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['param4'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['param5'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['param6'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['param7'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['param8'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['param9'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['param10'] || ''}},
                    {mData: null, mRender: function (a, b, c) {
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
                                <a href="javascript:;" data-action="remove" data-id="'+ c.id+ '">\
                                <i class="fa fa-edit"></i> 删除 </a>\
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
                            var url = '/sysparameters/display/delete/'+d.id
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
                        templateUrl : angular.url('/sysparameters/display/add'),
                        backdrop:"static",
                        size :'lg',
                        controller: 'SysparametersEditCtrl',
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
                templateUrl : angular.url('/sysparameters/display/add'),
                backdrop:"static",
                size :'lg',
                windowTemplateUrl : 'uib/template/modal/window-qp.html',
                controller: 'SysparametersCreateCtrl',
                keyboard:'false',
                scope:$scope
            }).result.then(function(v){
                $scope.table.draw();
            })
        }
    }]);

app.controller('SysparametersCreateCtrl', ['$scope','$uibModalInstance','$profile',function ($scope, $uibModalInstance,$profile) {
    $scope.cancle=$uibModalInstance.dismiss;
    $scope.title = "系统参数新增";
    $scope.dict = {};
    $scope.type={}
    $scope.sysparameter={};
    $profile.getRequest("/sysparameters/dict").then(function(data){
        // $scope.dict=data;
        // $scope.type=$profile.convSelect2($scope.dict.type,"code")
        angular.copy(data.head,$scope.sysparameter);
    })
    $scope.ok = function(isValid){
        if(isValid)
            $profile.post('/sysparameters/display/add/',$scope.sysparameter).then(function(data){
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

app.controller('SysparametersEditCtrl', ['$scope','$uibModalInstance','$profile','action',function ($scope, $uibModalInstance,$profile,sysParams) {

    $scope.cancle=$uibModalInstance.dismiss;
    $scope.title = "参数基本资料修改";
    $scope.sysparameter={};
    $scope.init = function(){
        $profile.getRequest("/sysparameters/display/edit/"+sysParams.id).then(function(data){
            $scope.sysparameter=data;
        })
    }
    $scope.init();
    $scope.ok = function(isValid){
        if(isValid)
            $profile.post('/sysparameters/display/add/',$scope.sysparameter).then(function(data){
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
