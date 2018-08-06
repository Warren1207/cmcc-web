angular.module('app').controller('StrategyListController',
    ['$rootScope', '$scope','$uibModal','$profile',function($rootScope, $scope,$modal,$profile) {
        $scope.$on('$viewContentLoaded', function() {
            App.initAjax();
            $scope.tableConfig = ({
                ajax:{
                    url :'/strategys/list'
                },
                pageLength: 10,
                formPanel: [
                    {name: "name", text: "名称", type: 'text', size: 4}
                ],
                aoColumns : [
                    { mData: null, mRender: function (a, b, c) { return c['id'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['name'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['singleRepaymentLimitCount'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['maxOneDayLimitRate'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['cdst028'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['cdst029'] || '' }},
                    {
                        mData: null, mRender: function (a, b, c) {
                            if(c['isEdit']) {
                                return '<div class="btn-group pull-right">\
                                    <button class="btn green btn-xs btn-outline dropdown-toggle" data-toggle="dropdown">操作\
                                        <i class="fa fa-angle-down"></i>\
                                        </button>\
                                        <ul class="dropdown-menu pull-right"> \
                                        <li>\
                                        <a href="javascript:;" data-action="edit" data-id="' + c.id + '">\
                                        <i class="fa fa-edit"></i> 编辑 </a>\
                                        </li>\
                                        <li>\
                                        <a href="javascript:;" data-action="remove" data-id="' + c.id + '">\
                                        <i class="fa fa-remove"></i> 删除 </a>\
                                        </li>\
                                    </ul> </div>';
                            }
                            else return "";

                    }}
                ],
                scope : $scope,
                remove_action: function (d, t) {
                    swal({
                            title: "你确定吗?",
                            text: "删除数据后将无法恢复。",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonText: "确定",
                            confirmButtonClass: "btn-danger",
                            cancelButtonText:"取消",
                            cancelButtonClass:"btn-info",
                            closeOnConfirm: false
                        },
                        function(){
                            var url = '/strategys/display/delete/'+d.id
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
                        templateUrl : angular.url('/strategys/display/add'),
                        backdrop:"static",
                        size :'lg',
                        controller: 'StrategysEditCtrl',
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
                templateUrl : angular.url('/strategys/display/add'),
                backdrop:"static",
                size :'lg',
                controller: 'StrategysCreateCtrl',
                keyboard:'false',
                scope:$scope
            }).result.then(function(v){
                $scope.table.draw();
            })
        }
    }]);


app.controller('StrategysCreateCtrl', ['$scope','$uibModalInstance','$profile',function ($scope, $uibModalInstance,$profile) {
    $scope.cancle=$uibModalInstance.dismiss;
    $scope.title = "策略新增";
    $scope.dict = {};
    $scope.strategy={};
    $scope.ok = function(isValid){
        if(isValid)
            $profile.post('/strategys/display/add/',$scope.strategy).then(function(data){
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


app.controller('StrategysEditCtrl', ['$scope','$uibModalInstance','$profile','action',function ($scope, $uibModalInstance,$profile,action) {

    $scope.cancle=$uibModalInstance.dismiss;
    $scope.title = "策略编辑";
    $scope.strategy={};
    $scope.init = function(){
        $profile.getRequest("/strategys/display/edit/"+action.id).then(function(data){
            $scope.strategy=data;
            $scope.strategy.cdst029 = $scope.strategy.cdst029+"";
        })
    }
    $scope.init();
    $scope.ok = function(isValid){
        if(isValid)
            $profile.post('/strategys/display/add/',$scope.strategy).then(function(data){
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