
angular.module('app').controller('CustomerListController',
['$rootScope', '$scope','$uibModal','$profile','$exportFactory',function($rootScope, $scope,$modal,$profile,$export) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax();
        $scope.tableConfig = ({
            ajax:{
                  url :'/customers/list'
            },
            formPanel: [
                {name: "name", text: "姓名", type: 'text', size: 4},
                {name: "mobile", text: "手机", type: 'text', size: 4},
                {name: "wxNo", text: "微信", type: 'text', size: 4}
            ],
            aoColumns: [
                { mData: null, mRender: function (a, b, c) { return c['name'] || '' }},
                { mData: null, mRender: function (a, b, c) { return c['alias'] || '' }},
                { mData: null, mRender: function (a, b, c) { return c['idCardNo'] || '' }},
                { mData: null, mRender: function (a, b, c) { return c['email'] || '' }},
                { mData: null, mRender: function (a, b, c) { return c['regName'] || '' }},
                {
                    mData: null, mRender: function (a, b, c) {
                    return c['level'] || ''
                }},
                {
                    mData: null, mRender: function (a, b, c) {
                    return c['agentName'] || ''
                }},
                {
                    mData: null, mRender: function (a, b, c) {
                    return c['wxNo'] || ''
                }},
                {
                    mData: null, mRender: function (a, b, c) {
                    return c['mobile'] || ''
                }},
                {
                    mData: null, mRender: function (a, b, c) {
                    return '<div class="buttons">\
                                <a class="btn green btn-xs btn-outline" href="#/cardsList?customerName='+c.name+'&customerId='+c.id+' "><i class="fa fa-edit"></i> 卡片信息 </a>\
                                <a class="btn green btn-xs btn-outline" href="#/cardsStatusList?customerName='+c.name+'&customerId='+c.id+' "><i class="fa fa-edit"></i> 当月状态 </a>\
                                <button class="btn green btn-xs btn-outline" data-action="edit" data-id="'+ c.id+ '">编辑</button>\
                                <button class="btn green btn-xs btn-outline" data-action="remove" data-id="'+ c.id+ '">删除</button>\
                            </div>'
                }}
            ],
            scope : $scope,
            remove_action: function (d, t) {
                swal({
                        title: "你确定吗?",
                        text: "删除数据后对应的卡片信息都将不可见。",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonText: "确定",
                        confirmButtonClass: "btn-danger",
                        cancelButtonText:"取消",
                        cancelButtonClass:"btn-info",
                        closeOnConfirm: false
                    },
                    function(){
                        var url = '/customers/display/delete/'+d.id
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
                    templateUrl : angular.url('/customers/display/add'),
                    backdrop:"static",
                    size :'lg',
                    windowTemplateUrl : 'uib/template/modal/window-qp.html',
                    controller: 'CustomerEditCtrl',
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
            templateUrl : angular.url('/customers/display/add'),
            backdrop:"static",
            windowTemplateUrl : 'uib/template/modal/window-qp.html',
            controller: 'CustomerCreateCtrl',
            keyboard:'false',
            scope:$scope
        }).result.then(function(v){
            $scope.table.draw();
        })
    }

    $scope.exportExcel = function() {
        $export.exportExcel(angular.url('/customers/export'),{})
    }
    $scope.importExcel = function() {
        $export.importExcel(angular.url('/customers/export/template'),angular.url('/customers/import'))
    }
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
}]);

app.controller('CustomerCreateCtrl', ['$scope','$uibModalInstance','$profile',function ($scope, $uibModalInstance,$profile) {
    $scope.cancle=$uibModalInstance.dismiss;
    $scope.title = "持卡人资料新增";
    $scope.dict = {};
    $scope.customer={};
    $scope.areas={};
    $scope.tenantList={};
    $scope.agents={};
    $profile.getRequest("/customers/dict").then(function(data){
        $scope.dict=data;
        $scope.areas = $profile.convSelect2($scope.dict.areas,"code")
        $scope.tenantList = $profile.convSelect2($scope.dict.tenantList,"id")
        $scope.agents = $profile.convSelect2($scope.dict.agents,"id")
    })
    $scope.ok = function(isValid){
        if(isValid)
            $profile.post('/customers/display/add/',$scope.customer).then(function(data){
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
app.controller('CustomerEditCtrl', ['$scope','$uibModalInstance','$profile','action',function ($scope, $uibModalInstance,$profile,action) {

    $scope.cancle=$uibModalInstance.dismiss;
    $scope.title = "持卡人资料修改";
    $scope.dict = {};
    $scope.customer={};
    $scope.areas={};
    $scope.tenantList={};
    $scope.agents={};
    $profile.getRequest("/customers/dict").then(function(data){
        $scope.dict=data;
        $scope.areas = $profile.convSelect2($scope.dict.areas,"code")
        $scope.tenantList = $profile.convSelect2($scope.dict.tenantList,"id")
        $scope.agents = $profile.convSelect2($scope.dict.agents,"id")
    })
    $scope.init = function(){
        $profile.getRequest("/customers/display/edit/"+action.id).then(function(data){
            $scope.customer=data;
            $scope.customer.vip=data.vip+"";
            $scope.customer.isemployee=data.isemployee+"";
            $scope.customer.agentId=data.agentId+"";
            $scope.customer.defaultOperId=data.defaultOperId+"";

        })
    }
    $scope.init();
    $scope.ok = function(isValid){
        if(isValid)
            $profile.post('/customers/display/add/',$scope.customer).then(function(data){
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
