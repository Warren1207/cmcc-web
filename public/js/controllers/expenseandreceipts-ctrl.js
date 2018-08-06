angular.module('app').controller('ExpenseandreceiptsListController',
    ['$rootScope', '$scope','$uibModal','$profile',function($rootScope, $scope,$modal,$profile) {
        $scope.$on('$viewContentLoaded', function() {
            $scope.tableConfig = ({
                ajax:{
                    url:'/expenseandreceipts/list',
                },
                pageLength: 10,
                formPanel: [
                    {name: "no", text: "编号", type: 'text', size: 4},
                ],
                aoColumns : [
                    {mData: null, mRender: function (a, b, c) { return c['id'] || '' }},
                    {mData: null, mRender: function (a, b, c) { return c['no'] || '' }},
                    {mData: null, mRender: function (a, b, c) { return c['execDate'] || '' }},
                    {mData: null, mRender: function (a, b, c) {
                        var  r=c['type']||''
                        if(r) return "收";else return "支";
                    }},
                    {mData: null, mRender: function (a, b, c) { return c['subType'] || '' }},
                    {mData: null, mRender: function (a, b, c) { return c['amount'] || '' }},
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
                            var url = '/expenseandreceipts/display/delete/'+d.id
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
                        templateUrl : angular.url('/expenseandreceipts/display/add'),
                        backdrop:"static",
                        size :'lg',
                        controller: 'ExpenseandreceiptsEditCtrl',
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
                templateUrl : angular.url('/expenseandreceipts/display/add'),
                backdrop:"static",
                size :'lg',
                controller: 'ExpenseandreceiptsCreateCtrl',
                keyboard:'false',
                scope:$scope
            }).result.then(function(v){
                $scope.table.draw();
            })
        }
    }]);

 app.controller('ExpenseandreceiptsCreateCtrl', ['$scope','$uibModalInstance','$profile',function ($scope, $uibModalInstance,$profile) {
    $scope.cancle=$uibModalInstance.dismiss;
    $scope.title = "收支记录单新增";
    $scope.dict = {};
    $scope.expenseandreceipt={};
    $scope.ok = function(isValid){
        if(isValid)
            $profile.post('/expenseandreceipts/display/add/',$scope.expenseandreceipt).then(function(data){
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
app.controller('ExpenseandreceiptsEditCtrl', ['$scope','$uibModalInstance','$profile','action',function ($scope, $uibModalInstance,$profile,action) {

    $scope.cancle=$uibModalInstance.dismiss;
    $scope.title = "收支记录单编辑";
    $scope.expenseandreceipt={};
    $scope.init = function(){
        $profile.getRequest("/expenseandreceipts/display/edit/"+action.id).then(function(data){
            $scope.expenseandreceipt=data;
        })
    }
    $scope.init();
    $scope.ok = function(isValid){
        if(isValid)
            $profile.post('/expenseandreceipts/display/add/',$scope.expenseandreceipt).then(function(data){
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
