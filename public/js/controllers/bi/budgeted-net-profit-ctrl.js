angular.module('app').controller('BudgetedNetProfitController',
    ['$rootScope', '$scope','$uibModal','$location','$profile',function($rootScope, $scope,$modal,$location,$profile) {
        $scope.$on('$viewContentLoaded', function() {
            App.initAjax();
            $scope.tableConfig = ({
                ajax:{
                    url :'/bi/budgetedNetProfit/list'
                },
                pageLength: 10,
                formPanel: [
                    {name: "year", text: "年",type: 'text', size: 4},
                    {name: "month", text: "月",type: 'text', size: 4}
                ],
                aoColumns : [
                    {mData: null, mRender: function (a, b, c) {return c['year'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['month'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['tenantId'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['tenantCode'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['tenantName'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['revenue'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['expense'] || ''}},
                    {mData: null, mRender: function (a, b, c) {return c['profit'] || ''}},
                    // {
                    //     mData: null, mRender: function (a, b, c) {
                    //     return '<div class="buttons">\
                    //             <button class="btn green btn-xs btn-outline" data-action="detail" data-id="'+ c.id+ '">明细</button>\
                    //         </div>'
                    // }}
                ],
                scope : $scope,
                detail_action : function(d,t){
                    $modal.open({
                        templateUrl : angular.url('/bi/budgetedNetProfit/display/detail'),
                        backdrop:"static",
                        size :'lg',
                        windowTemplateUrl : 'uib/template/modal/window-qp.html',
                        controller: 'BudgetedNetProfitDetailController',
                        keyboard:'false',
                        scope:$scope,
                        resolve:{
                            action:{
                                year  : d.year,
                                month : d.month,
                                tenantId: d.tenantId
                            }
                        }
                    }).result.then(function(v){
                        $scope.table.draw();
                    })
                }
            })
        });

    }]);


app.controller('BudgetedNetProfitDetailController', ['$scope','$uibModalInstance','$profile','action',function ($scope, $uibModalInstance,$profile,action) {

    $scope.cancle=$uibModalInstance.dismiss;
    $scope.title = "预估净利润表明细";
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
}])
