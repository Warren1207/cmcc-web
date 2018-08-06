app.controller("selectedAreaCtrl",['$scope','$http','$uibModalInstance','$profile',
    function($scope,$http,$uibModalInstance,$profile ) {
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.tree = function(a){
            $scope.trees = $(a).on('changed.jstree', function (e, data) {
                var i, j, r = [];
                for(i = 0, j = data.selected.length; i < j; i++) {
                    node = data.instance.get_node(data.selected[i]);
                }
            })
                .jstree({
                    "core": {
                        "themes": {
                            "responsive": false
                        },
                        // so that create works
                        "check_callback": true,
                        'data': {
                            'url': function (node) {
                                return '/sysparameters/node/all';
                            },
                            'data': function (node) {
                                return {'parent': node.id};
                            }
                        }
                    },
                    "types" : {
                        "default" : {
                            "icon" : ""
                        },
                        "file" : {
                            "icon" : "fa fa-file icon-state-warning icon-lg"
                        }
                    },
                    "plugins" : [ "wholerow", "checkbox", "types" ]
                })
        }
        $scope.ok=function() {
            var data = $scope.trees.jstree().get_checked(true);
            var areaAddress = $profile.areaAddress(data,'id','text')
            $uibModalInstance.close(areaAddress);
        }
}])

app.controller("idSelectedAreaCtrl",['$scope','$http','$uibModalInstance','action','$profile',
    function($scope,$http,$uibModalInstance ,action,$profile) {
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.action = action;
        $scope.tree = function(a){
            $scope.trees = $(a).on('changed.jstree', function (e, data) {
                var i, j, r = [];
                for(i = 0, j = data.selected.length; i < j; i++) {
                    node = data.instance.get_node(data.selected[i]);
                }
            })
                .jstree({
                    "core": {
                        "themes": {
                            "responsive": false
                        },
                        // so that create works
                        "check_callback": true,
                        'data': {
                            'url': function (node) {
                                return '/sysparameters/node/all/'+$scope.action.id;
                            },
                            'data': function (node) {
                                return {'parent': node.id};
                            }
                        }
                    },
                    "types" : {
                        "default" : {
                            "icon" : ""
                        },
                        "file" : {
                            "icon" : "fa fa-file icon-state-warning icon-lg"
                        }
                    },
                    "plugins" : [ "wholerow", "checkbox", "types" ]
                })
        }
        $scope.ok=function() {
            var data = $scope.trees.jstree().get_checked(true);
            var areaAddress = $profile.areaAddress(data,'id','text')
            $uibModalInstance.close(areaAddress);
        }
    }])