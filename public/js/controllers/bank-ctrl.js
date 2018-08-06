angular.module('app').controller('BankController',
    ['$rootScope', '$scope','$uibModal','$location','$profile',function($rootScope, $scope,$modal,$location,$profile) {
        $scope.$on('$viewContentLoaded', function() {
            $scope.tableConfig = ({
                ajax:{
                    url :'/sysparameters/bank/list'
                },
                "paging": false ,
                formPanel: [
                    {name: "name", text: "银行名", type: 'text', size: 6},
                    {name: "statue", text: "状态", type: 'select', size: 6,data: [
                        {value: '启用', key: "Y"}, {value: '禁止', key: "N"}, {value: '全部', key: ""}]}
                ],
                aoColumns : [
                    // {mData: null, mRender: function (a, b, c) {return c['id'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['name'] || ''}},
                    {
                        mData: null, mRender: function (a, b, c) {
                        var checked = '';
                        if(c['status']=='Y'){
                            checked = 'checked'
                        }
                        return '<input type="checkbox" data-id="'+c.id+'" class="make-switch" '+checked+' data-off-text="禁用" data-size="small" data-on-text="启用">'
                    }
                    },
                    {mData: null, mRender: function (a, b, c) {return c['cdba007'] || ''}},
                    {
                        mData: null, mRender: function (a, b, c) {
                        return   '<div class="btn-group pull-right">\
                                <button class="btn green btn-xs btn-outline dropdown-toggle" data-toggle="dropdown">操作\
                                <i class="fa fa-angle-down"></i>\
                                </button>\
                                <ul class="dropdown-menu pull-right"> \
                                <li>\
                                <a href="javascript:;" data-action="remove" data-id="'+ c.id +'">\
                                <i class="fa fa-remove"></i> 删除 </a>\
                                </li>\
                            </ul> </div>'
                    }}
                ],
                fnDrawCallback:function() {
                    $('.make-switch').bootstrapSwitch({
                        onSwitchChange:function(a,b){
                            var t = a.target;
                            var id = $(t).data('id');
                            $profile.postForm('/sysparameters/bank/update/statue/'+id,{s:!b},function(data){
                                if(data.success){
                                    $scope.table.draw();
                                }
                            },'json')
                        }
                    })
                },
                scope : $scope,
                remove_action: function (d, t) {
                    swal({
                            title: "你确定吗?",
                            text: "删除数据?",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonText: "确定",
                            confirmButtonClass: "btn-danger",
                            cancelButtonText:"取消",
                            cancelButtonClass:"btn-info",
                            closeOnConfirm: false
                        },
                        function(){
                            $profile.post('/sysparameters/bank/delete/'+d.id,{}).then(function(data){
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
                        templateUrl : angular.url('/sysparameters/bank/add'),
                        backdrop:"static",
                        size :'lg',
                        controller: 'BankEditCtrl',
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
            $scope.openAddPage = function() {
                $modal.open({
                    templateUrl : angular.url('/sysparameters/bank/add'),
                    backdrop:"static",
                    size :'lg',
                    controller: 'BankCreateCtrl',
                    keyboard:'false',
                    scope:$scope,
                    resolve:{
                        action:{
                            id : $scope.customerId,
                            name: $scope.customerName
                        }
                    }
                }).result.then(function(v){
                    $scope.table.draw();
                })
            }
        });

    }]);

app.controller('BankCreateCtrl', ['$scope','$uibModalInstance','$profile','action',function ($scope, $uibModalInstance,$profile,action) {
    $scope.cancle=$uibModalInstance.dismiss;
    $scope.bankName ="";
    $scope.ok = function(isValid){
        if(isValid)
            $profile.postForm('/sysparameters/bank/add/',{
                name : $scope.bankName,
                shortname:$scope.shortname
            }).then(function(data){
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


app.controller('BankEditCtrl', ['$scope','$uibModalInstance','$profile','action',function ($scope, $uibModalInstance,$profile,action) {

    $scope.cancle=$uibModalInstance.dismiss;
    $scope.title = "卡片资料编辑";
    $scope.bank ={};
    $scope.ok = function(isValid) {
        if (isValid)
            $profile.postForm('/cards/display/add/', $scope.card).then(function (data) {
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

