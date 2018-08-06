angular.module('app').controller('CardsStatusListController',
    ['$rootScope', '$scope','$uibModal','$location','$profile',function($rootScope, $scope,$modal,$location,$profile) {
        $scope.$on('$viewContentLoaded', function() {
            App.initAjax();
            $scope.customerName = $location.search().customerName
            $scope.customerId = $location.search().customerId
            $scope.tableConfig = ({
                ajax:{
                    url: '/cardsstatus/list',
                },
                pageLength: 10,
                formPanel: [
                    {name: "owner", text: "姓名",value:$scope.customerName, type: 'text', size: 4},
                    {name: "cardNo", text: "卡号", type: 'text', size: 4},
                ],
                "fnServerParams": function ( aoData ) {
                    aoData.push( { "owner": $scope.customerName } );
                },
                aoColumns : [
                    { mData: null, mRender: function (a, b, c) { return c['owner'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['cardNo'] || '' }},
                    { mData: null, mRender: function (a, b, c) { return c['isBack'] || '' }},
                ],
                scope : $scope
            })
        });
    }]);

