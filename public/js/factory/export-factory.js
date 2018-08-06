var app = angular.module("app").factory('$exportFactory',['$http','$uibModal','$q','$profile',
    function($http,$modal,$q,$profile){
        return {
            exportExcel : function(_url) {
                var url = angular.url('/export/index');
                return $profile.open(url,'ExportIndexCtrl','lg',{
                    'currentPage':_url,
                    'allPage':_url
                })
            },
            importExcel : function(templateUrl,oUrl) {
                var url = angular.url('/export/import');
                return $profile.open(url,'ImportIndexCtrl','lg',{
                    'templateUrl':templateUrl,
                    'upload':oUrl
                })
            }
        }
    }]);

app.controller("ExportIndexCtrl",['$scope','$http','$uibModalInstance','action',
    function($scope,$http,$uibModalInstance,action) {
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.action = action;
    }])
angular.module("app").controller("ImportIndexCtrl",['$scope','$http','$uibModalInstance','FileUploader','action',
    function($scope,$http,$uibModalInstance,FileUploader,action) {
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.action = action;
        var uploader = $scope.uploader = new FileUploader({
            url: $scope.action.upload
        });

        // FILTERS

        uploader.filters.push({
            name: 'customFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 10;
            }
        });
        uploader.onSuccessItem = function(fileItem, response, status, headers)
        {
            fileItem.isError = !response.success
            fileItem.isSuccess = response.success
            fileItem.message = response.message;
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
    }])