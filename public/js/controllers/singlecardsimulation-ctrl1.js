angular.module('app').controller('ExpenseandreceiptsListController',
    ['$rootScope', '$scope','$uibModal','$location','$profile',function($rootScope, $scope,$modal,$location,$profile) {
        $scope.$on('$viewContentLoaded', function() {
            App.initAjax();
            $scope.header = [];
            $profile.getRequest('/trials/singlecardsimulation/already/init').then(function(data){
                $scope.header = data;
            })
        });

    }]);
