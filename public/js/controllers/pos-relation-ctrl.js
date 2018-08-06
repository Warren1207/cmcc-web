angular.module('app').controller('PosRelationListController',
    ['$rootScope', '$scope','$uibModal','$profile',function($rootScope, $scope,$modal,$profile) {
        $scope.$on('$viewContentLoaded', function() {
            $scope.arg1 = sessionStorage.getItem('posId');
            sessionStorage.removeItem("posId");
            if($scope.arg1 == null){
                $scope.arg1="";
            }
            $rootScope.arg1 = $scope.arg1;
            App.initAjax();
            $scope.tableConfig = ({
                ajax:{
                    url :'/pos/relation/list'
                },
                pageLength: 10,
                formPanel: [
                    {name: "posId", text: "POS ID", value: ""+$scope.arg1?$scope.arg1:""+"", type: 'text', size: 4},
                    {name: "merchantId", text: "商户 ID", type: 'text', size: 4}
                ],
                aoColumns : [
                    { mData: null, mRender: function (a, b, c) { return c['id'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['posNo'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['posName'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['merchantNo'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['merchantName'] || '' }},
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
                            var url = '/pos/relation/display/delete/'+d.id
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
                        templateUrl : angular.url('/pos/relation/display/add'),
                        backdrop:"static",
                        size :'lg',
                        controller: 'PosRelationEditCtrl',
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
                templateUrl : angular.url('/pos/relation/display/add'),
                backdrop:"static",
                size :'lg',
                controller: 'PosRelationCreateCtrl',
                windowTemplateUrl : 'uib/template/modal/window-qp.html',
                keyboard:'false',
                scope:$scope
            }).result.then(function(v){
                $scope.table.draw();
            })
        }
    }]);


app.controller('PosRelationCreateCtrl', ['$rootScope','$scope','$uibModalInstance','$profile',function ($rootScope,$scope, $uibModalInstance,$profile) {
    $scope.cancle=$uibModalInstance.dismiss;
    $scope.title = "pos商户资料新增";
    $scope.dict = {};
    $scope.poss={};
    $scope.possRelation={};
    $scope.merchants={};
    $scope.tenantList={};
    $scope.possRelation.posId = $rootScope.arg1;

    $profile.getRequest("/pos/relation/dict").then(function(data){
        $scope.dict=data;
        $scope.poss = $profile.convSelect2($scope.dict.pos,"code");
        $scope.merchants = $profile.convSelect2($scope.dict.merchant,"code");
    })
    $scope.ok = function(isValid){
        if(isValid)
            $profile.postForm('/pos/relation/display/add/',$scope.possRelation).then(function(data){
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


app.controller('PosRelationEditCtrl', ['$scope','$uibModalInstance','$profile','action',function ($scope, $uibModalInstance,$profile,action) {

    $scope.cancle=$uibModalInstance.dismiss;
    $scope.title = "pos商户对应编辑";
    $scope.dict = {};
    $scope.poss={};
    $scope.possRelation={};
    $scope.merchants={};
    $scope.tenantList={};

    $profile.getRequest("/pos/relation/dict").then(function(data){
        $scope.dict=data;
        $scope.poss = $profile.convSelect2($scope.dict.pos,"code");
        $scope.merchants = $profile.convSelect2($scope.dict.merchant,"code");
    })
    $scope.init = function(){
        $profile.getRequest("/pos/relation/display/edit/"+action.id).then(function(data){
            $scope.possRelation=data;
            $scope.possRelation.posId = data.posId + ""
            $scope.possRelation.merchantId = data.merchantId + ""
        })
    }
    $scope.init();
    $scope.ok = function(isValid){
        if(isValid)
            $profile.postForm('/pos/relation/display/add/',$scope.possRelation).then(function(data){
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