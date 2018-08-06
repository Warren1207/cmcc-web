angular.module('app').controller('MerchantsListController',
    ['$rootScope', '$scope','$uibModal','$profile',function($rootScope, $scope,$modal,$profile) {
        $scope.$on('$viewContentLoaded', function() {
            App.initAjax();
            $scope.tableConfig = ({
                ajax:{
                    url :'/merchants/list'
                },
                formPanel: [
                    {name: "name", text: "名称", type: 'text', size: 4}
                ],
                aoColumns : [
                    { mData: null, mRender: function (a, b, c) { return c['id'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['name'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['merchantNo'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['industry'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['maxAmount'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['minAmount'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['bestMaxAmount'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['bestMinAmount'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['startBestTime'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['endBestTime'] || '' }},
                    // { mData: null, mRender: function (a, b, c) { return c['posName'] || '' }},
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
                            var url = '/merchants/display/delete/'+d.id
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
                        templateUrl : angular.url('/merchants/display/add'),
                        backdrop:"static",
                        size :'lg',
                        controller: 'MerchantsEditCtrl',
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
                templateUrl : angular.url('/merchants/display/add'),
                backdrop:"static",
                size :'lg',
                windowTemplateUrl : 'uib/template/modal/window-qp.html',
                controller: 'MerchantsCreateCtrl',
                keyboard:'false',
                scope:$scope
            }).result.then(function(v){
                $scope.table.draw();
            })
        }
    }]);

app.controller('MerchantsCreateCtrl', ['$scope','$uibModalInstance','$profile',function ($scope, $uibModalInstance,$profile) {
    $scope.cancle=$uibModalInstance.dismiss;
    $scope.title = "商户资料新增";
    $scope.dict = { };
    $scope.areas={};
    $scope.poss={};
    $scope.postType={};
    $scope.banks={};
    $scope.tenantList={}
    $scope.platforms={};
    $scope.merchant={};
    $profile.getRequest("/merchants/dict").then(function(data){
        $scope.dict=data;
        $scope.poss = $scope.dict.poss;
    })
    $scope.ok = function(isValid){
        if(isValid)
            $profile.postForm('/merchants/display/add/',$scope.merchant).then(function(data){
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


app.controller('MerchantsEditCtrl', ['$scope','$uibModalInstance','$profile','action',function ($scope, $uibModalInstance,$profile,action) {
    $scope.cancle=$uibModalInstance.dismiss;
    $scope.title = "商户资料编辑";
    $scope.areas={};
    $scope.poss={};
    $scope.postType={};
    $scope.banks={};
    $scope.tenantList={}
    $scope.platforms={};
    $scope.merchant={};
    $profile.getRequest("/merchants/dict").then(function(data){
        $scope.dict=data;
        $scope.poss = $scope.dict.poss;
    })
    $scope.init = function(){
        $profile.getRequest("/merchants/display/edit/"+action.id).then(function(data){
            $scope.merchant=data;
            $scope.merchant.posId=data.posId + "";
        })
    }
    $scope.init();
    $scope.ok = function(isValid){
        if(isValid)
            $profile.postForm('/merchants/display/add/',$scope.merchant).then(function(data){
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


