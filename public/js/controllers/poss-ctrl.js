angular.module('app').controller('PossListController',
    ['$rootScope', '$scope','$uibModal','$profile','$compile',function($rootScope, $scope,$modal,$profile,$compile) {
        $scope.$on('$viewContentLoaded', function() {
            App.initAjax();
            $scope.tableConfig = ({
                ajax:{
                    url :'/poss/list'
                },
                pageLength: 10,
                formPanel: [
                    {name: "name", text: "姓名", type: 'text', size: 4},
                    {name: "posNo", text: "设备编号", type: 'text', size: 4},
                    {name: "modelNo", text: "设备型号", type: 'text', size: 4}
                ],
                aoColumns : [
                    { mData: null, mRender: function (a, b, c) { return c['id'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['name'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['posNo'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['modelNo'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['cityName'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['platform'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['ownerName'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['bankName'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['cardNo'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['posType'] || '' }},
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
                                <li>\
                                <a href="javascript:;" data-action="relation" data-id="'+ c.id +'">\
                                <i class="fa fa-edit"></i> POS-商户关系 </a>\
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
                            var url = '/poss/display/delete/'+d.id
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
                        templateUrl : angular.url('/poss/display/add'),
                        backdrop:"static",
                        size :'lg',
                        controller: 'PossEditCtrl',
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
                },
                relation_action : function(d,t){
                    sessionStorage.setItem('posId',d.id);
                    var contentView = angular.element('.desktop-pagelist-ccms');
                    if(contentView.length>0){
                        var childView = contentView.find('div[ui-view="posRelationList"]');
                        if(childView.length == 0){
                            var $el = $('<div ui-view="posRelationList" class="fade-in-up"></div>').appendTo('.desktop-pagelist-ccms');
                            $compile($el)($scope);
                        }
                    }
                    $rootScope.$apply(function(){
                        $rootScope.headerArray.push({
                            id : 22554,
                            pid : 613,
                            text : "POS商户对应关系",
                            url : "posRelationList"
                        });
                        $rootScope.currentId = 22554;
                        $rootScope.currentUrl = "posRelationList";
                    });
                    $('.desktop-pagelist-ccms').find('div[ui-view="posRelationList"]').show();
                    // $modal.open({
                    //     templateUrl : angular.url('/poss/display/relation'),
                    //     backdrop:"static",
                    //     size :'lg',
                    //     controller: 'PossRelationCtrl',
                    //     windowTemplateUrl : 'uib/template/modal/window-qp.html',
                    //     keyboard:'false',
                    //     scope:$scope,
                    //     resolve:{
                    //         action:{
                    //             id : d.id
                    //         }
                    //     }
                    // }).result.then(function(v){
                    //     $scope.table.draw();
                    // })
                }
            })
        });

        $scope.openAddPage = function() {
            $modal.open({
                templateUrl : angular.url('/poss/display/add'),
                backdrop:"static",
                size :'lg',
                controller: 'PossCreateCtrl',
                windowTemplateUrl : 'uib/template/modal/window-qp.html',
                keyboard:'false',
                scope:$scope
            }).result.then(function(v){
                $scope.table.draw();
            })
        }
    }]);


app.controller('PossCreateCtrl', ['$scope','$uibModalInstance','$profile',function ($scope, $uibModalInstance,$profile) {
    $scope.cancle=$uibModalInstance.dismiss;
    $scope.title = "pos资料新增";
    $scope.dict = {};
    $scope.areas={};
    $scope.poss={};
    $scope.banks={};
    $scope.platforms={};
    $scope.tenantList={};
    $scope.ownerName = {};
    $scope.accountWay = {};

    $profile.getRequest("/poss/dict").then(function(data){
        $scope.dict=data;
        $scope.areas = $profile.convSelect2($scope.dict.areas,"code");
        $scope.banks = $profile.convSelect2($scope.dict.banks,"code");
        $scope.accountWay = $scope.dict.accountWay;
        $scope.platforms = $scope.dict.platforms;
        var agents = [];
        for(var i in $scope.dict.agents){
            var agent = {};
            var agent = {"code":$scope.dict.agents[i].id,"name":$scope.dict.agents[i].name};
            agents.push(agent);
        }
        $scope.ownerName = $profile.convSelect2(agents,"code");
    })
    $scope.ok = function(isValid){
        if(isValid)
            $profile.postForm('/poss/display/add/',$scope.poss).then(function(data){
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


app.controller('PossEditCtrl', ['$scope','$uibModalInstance','$profile','action',function ($scope, $uibModalInstance,$profile,action) {

    $scope.cancle=$uibModalInstance.dismiss;
    $scope.title = "pos资料编辑";
    $scope.dict = {};
    $scope.areas={};
    $scope.poss={};
    $scope.banks={};
    $scope.platforms={};
    $scope.tenantList={};
    $scope.ownerName = {};
    $scope.accountWay = {};

    $profile.getRequest("/poss/dict").then(function(data){
        $scope.dict=data;
        $scope.areas = $profile.convSelect2($scope.dict.areas,"code");
        $scope.banks = $profile.convSelect2($scope.dict.banks,"code");
        $scope.accountWay = $scope.dict.accountWay;
        $scope.platforms = $scope.dict.platforms;
        var agents = [];
        for(var i in $scope.dict.agents){
            var agent = {};
            var agent = {"code":$scope.dict.agents[i].id,"name":$scope.dict.agents[i].name};
            agents.push(agent);
        }
        $scope.ownerName = $profile.convSelect2(agents,"code");
    })
    $scope.init = function(){
        $profile.getRequest("/poss/display/edit/"+action.id).then(function(data){
            $scope.poss=data;
            $scope.poss.ownerId = data.ownerId + "";
            $scope.poss.bankId = data.bankId + "";
            $scope.poss.merchantChooseType = data.merchantChooseType+"";
        })
    }
    $scope.init();
    $scope.ok = function(isValid){
        if(isValid)
            $profile.postForm('/poss/display/add/',$scope.poss).then(function(data){
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