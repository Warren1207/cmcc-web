angular.module('app').controller('DailyPosReportController',
    ['$rootScope', '$scope','$uibModal','$profile',function($rootScope, $scope,$modal,$profile) {
        $scope.$on('$viewContentLoaded', function() {
            App.initAjax();
            $scope.tableConfig = ({
                ajax:{
                    url :'/daily/pos/list'
                },
                pageLength: 10,
                formPanel: [
                    {name: "day", text: "日期", type: 'text', size: 4}
                ],
                aoColumns : [
                    { mData: null, mRender: function (a, b, c) { return c['id'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['day'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['cityCode'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['pos1'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['pos2'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['pos3'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['pos4'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['pos5'] || '' }}
                ],
                scope : $scope
            })
        });

        $scope.openAddPage = function() {
            $profile.confirm('确定','是否产生今天的POS资源清单',function(){
                $(event.target).parent().prop('disabled',true);
                $profile.post('/daily/pos/add').then(function(data) {
                    if(data.success){
                        $profile.alter(data.message,function(){
                            $scope.table.draw();
                        })
                    }else{
                        $profile.error(data.message)
                    }
                    $(event.target).parent().prop('disabled',false);
                })
            })
        }
    }]);


app.controller('DailyPosCreateCtrl', ['$scope','$uibModalInstance','$profile',function ($scope, $uibModalInstance,$profile) {
    $scope.cancle=$uibModalInstance.dismiss;
    $scope.title = "pos资料新增";
    $scope.dict = {};
    $scope.areas={};
    $scope.pos={};
    $scope.banks={};
    $scope.platforms={};
    $scope.tenantList={};
    $scope.ownerName = {};
    $scope.accountWay = {};

    $profile.getRequest("/pos/dict").then(function(data){
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
            $profile.postForm('/pos/display/add/',$scope.pos).then(function(data){
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
