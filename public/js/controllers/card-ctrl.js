angular.module('app').controller('CardListController',
    ['$rootScope', '$scope','$uibModal','$location','$profile',function($rootScope, $scope,$modal,$location,$profile) {
        $scope.$on('$viewContentLoaded', function() {
            App.initAjax();
            $scope.customerName = $location.search().customerName
            $scope.customerId = $location.search().customerId
            $scope.tableConfig = ({
                ajax:{
                    url :'/cards/list'
                },
                pageLength: 10,
                formPanel: [
                    {name: "owner", text: "姓名", value:$scope.customerName,type: 'text', size: 4},
                    {name: "cardNo", text: "卡号", type: 'text', size: 4},
                    {name: "statementDate", text: "账单日", type: 'text', size: 4},
                    {name: "paymentDate", text: "还款日", type: 'text', size: 4},
                ],
                "fnServerParams": function ( aoData ) {
                    aoData.push( { "owner": $scope.customerName } );
                },
                aoColumns : [
                    {mData: null, mRender: function (a, b, c) {return c['cardNo'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['owner'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['bankName'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['fixedAmount'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['tmpAmount'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['statementDate'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['paymentDate'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['lastPaymentDate'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['repaymentDate'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['expireDate'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['riskInfo'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['riskLevel'] || ''}},
                    {
                        mData: null, mRender: function (a, b, c) {
                        return '<div class="buttons">\
                                <button class="btn green btn-xs btn-outline" data-action="edit" data-id="'+ c.id+ '">编辑</button>\
                                <button class="btn green btn-xs btn-outline" data-action="bark" data-id="'+ c.id+ '">退卡</button>\
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
                            $profile.post('/cards/display/delete/'+d.id,{}).then(function(data){
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
                bark_action:function(d,t){
                    swal({
                            title:"你确定吗？",
                            text:"你确定要退卡吗？",
                            type:"warning",
                            showCancelButton:true,
                            confirmButtonText:"确定",
                            confirmButtonClass:"btn-danger",
                            cancelButtonText:"取消",
                            cancelButtonClass:"btn-info",
                            closeOnConfirm:false
                        },
                        function () {
                            var url = angular.url('/overdue/bark/',d.id);
                            $profile.post(url,{}).then(function (data) {
                                if(data.success){
                                    $profile.alter(data.message,function () {
                                        t.draw();
                                    })
                                }else {
                                    $profile.error(data.message)
                                }
                            })
                        })
                },
                edit_action : function(d,t){
                    $modal.open({
                        templateUrl : angular.url('/cards/display/add'),
                        backdrop:"static",
                        size :'lg',
                        windowTemplateUrl : 'uib/template/modal/window-qp.html',
                        controller: 'CardsEditCtrl',
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
                    templateUrl : angular.url('/cards/display/add'),
                    backdrop:"static",
                    size :'lg',
                    windowTemplateUrl : 'uib/template/modal/window-qp.html',
                    controller: 'CardsCreateCtrl',
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

app.controller('CardsCreateCtrl', ['$scope','$uibModalInstance','$profile','action',function ($scope, $uibModalInstance,$profile,action) {
    $scope.cancle=$uibModalInstance.dismiss;
    $scope.title = "卡片资料新增";
    $scope.dict = {};
    $scope.card={};
    $scope.showSelectBtn = !!action.id
    $scope.banks={};
    $scope.teant={};
    $scope.agent={};
    $scope.strategy={}
    $profile.getRequest("/customers/display/edit/"+action.id).then(function(data){
        $scope.card.owner=data.alias;
        $scope.card.customerId=action.id;
        $scope.card.maxSingleRepaymentRate=data.repaymentRate+"";
        $scope.card.returnRate=data.returnRate+"";
        $scope.card.agentId=data.agentId+"";
        $scope.card.defaultOperId=data.defaultOperId+"";

    })
    $profile.getRequest("/cards/dict").then(function(data){
        $scope.dict=data;
        $scope.banks = $profile.convSelect2($scope.dict.banks,"code")
        $scope.agent = $profile.convSelect2($scope.dict.agent,"id")
        $scope.teant = $profile.convSelect2($scope.dict.teant,"id")
        $scope.strategy=$profile.convSelect2($scope.dict.strategy,"code");
    })
    $scope.ok = function(isValid){
        if(isValid)
        $profile.postForm('/cards/display/add/',$scope.card).then(function(data){
            if(data.success){
                $profile.alter(data.message,function() {
                    $uibModalInstance.close('')
                })
            }else{
                $profile.error(data.message)
            }
        })
    }
    $scope.selectOwner = function() {
        $profile.open('/customers/selected','SelectedOwnerCtrl').result.then(function(selectValue){
            $scope.card.owner = selectValue.name;
            $scope.card.customerId = selectValue.id;
            $scope.card.returnRate = selectValue.returnRate;
            $scope.card.maxSingleRepaymentRate = selectValue.maxSingleRepaymentRate+ "";
        })
    }
}])


app.controller('CardsEditCtrl', ['$scope','$uibModalInstance','$profile','action',function ($scope, $uibModalInstance,$profile,action) {

    $scope.cancle=$uibModalInstance.dismiss;
    $scope.title = "卡片资料编辑";
    $scope.dict={}
    $scope.banks={};
    $scope.agent={}
    $scope.teant={}
    $scope.strategy={}
    $scope.init = function(){
        $profile.getRequest("/cards/dict").then(function(data){
            $scope.dict=data;
            $scope.banks = $profile.convSelect2($scope.dict.banks,"code")
            $scope.agent = $profile.convSelect2($scope.dict.agent,"id")
            $scope.teant = $profile.convSelect2($scope.dict.teant,"id")
            $scope.strategy=$profile.convSelect2($scope.dict.strategy,"code");
        })
        $profile.getRequest("/cards/display/edit/"+action.id).then(function(data){
            $scope.card=data;
            $scope.card.strategyId = data.strategyId + "";
            $scope.card.agentId = data.agentId + "";
            $scope.card.defaultOperId = data.defaultOperId + "";
            $scope.card.bankId = data.bankId + "";
            $scope.card.isBack = data.isBack + "";
            $scope.card.stages = data.stages + "";
        })
    }
    $scope.init();
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
    $scope.selectOwner = function() {
        $profile.open('/customers/selected','SelectedOwnerCtrl').result.then(function(selectValue){
            $scope.card.owner = selectValue.name;
            $scope.card.customerId = selectValue.id;
            $scope.card.maxSingleRepaymentRate = selectValue.maxSingleRepaymentRate + "";
        })
    }
}])


app.controller("SelectedOwnerCtrl",['$scope','$http','$uibModalInstance',
            function($scope,$http,$uibModalInstance ) {
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.roles = [];
    $scope.tableConfig ={
        ajax:{
            url: '/customers/list',
        },
        formPanel: [
            {name: "name", text: "姓名", type: 'text', size: 4},
            {name: "mobile", text: "手机", type: 'text', size: 4},
            {name: "wxNo", text: "微信", type: 'text', size: 4}
        ],
        aoColumns: [
            { mData:null,mRender : function(a,b,c){
                return c['name']||''
            } },
            { mData:null,mRender : function(a,b,c){
                return c['alias']||''
            } },
            { mData:null,mRender : function(a,b,c){
                return c['idCardNo']||''
            } },
            { mData:null,mRender : function(a,b,c){
                return c['wxNo']||''
            } },
            { mData:null,mRender : function(a,b,c){
                return c['mobile']||''
            } }
        ],
        scope : $scope,
        dblclick : function(tr,data,tbl,scope) {
            $uibModalInstance.close(data);
        }

    }
}])
