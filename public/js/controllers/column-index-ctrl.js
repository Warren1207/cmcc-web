angular.module('app').controller('ColumnController',
    ['$rootScope', '$scope','$uibModal','$state','$profile',function($rootScope, $scope,$modal,$state,$profile) {
        $scope.$on('$viewContentLoaded', function() {
            $scope.initTree = function(a){
                $scope.tree = $(a).jstree({
                    "core" : {
                        "themes" : {
                            "responsive": false
                        },
                        "check_callback" : true,
                        'data' : {
                            'url' : function (node) {
                                return '/main/system/column/node/';
                            },
                            'data' : function (node) {
                                var id = !node.original ? '#' : node.original.id;
                                return { 'parent' : id };
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
                    "state" : { "key" : "demo3" },
                    "plugins" : [ "dnd", "state", "types" ]
                }).bind('click.jstree', function(event) {
                    var data = $(a).jstree(true).get_node(event.target);
                    $state.go('columnList.detail',{id:data.id})
                });
            }
        });
    }]);

angular.module('app').controller('ColumnDetailController',
    ['$rootScope', '$scope','$stateParams','$profile',function($rootScope, $scope,$stateParams,$profile) {
        $scope.$on('$viewContentLoaded', function() {
            $scope.title="系统菜单";
            $scope.column = {}
            $profile.getRequest(angular.url('/main/system/column/detail/',$stateParams.id)).then(function(data){
                $scope.column=data;
            })
            $scope.newColumn = function() {
                $profile.open('/main/system/column/create','ColumnCreateCtrl','lg',{callback:function(){
                    $scope.$parent.tree.jstree('refresh')
                }})
            }
            $scope.editColumn = function() {
                $profile.open('/main/system/column/create','ColumnEditCtrl','lg',{callback:function(){
                    $scope.$parent.tree.jstree('refresh')
                }})
            }
            $scope.initData = function(){
                return $profile.getRequest(angular.url('/main/system/column/edit/',$scope.id)).then(function(data) {
                    $scope.column = data;
                });
            }
            $scope.removeColumn = function() {

            swal({
                    title: "你确定吗?",
                    text: "确定删除栏目吗？。",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonText: "确定",
                    confirmButtonClass: "btn-danger",
                    cancelButtonText:"取消",
                    cancelButtonClass:"btn-info",
                    closeOnConfirm: false
                },
                function(){
                    $profile.post(angular.url('/main/system/column/remove/',$stateParams.id),{}).then(function(data) {
                        if(data.success){
                            $profile.alter(data.message,function(){
                                $scope.$parent.tree.jstree('refresh')
                                $scope.initData();
                            })
                        }else{
                            $profile.error(data.message)
                        }
                    })
                });
            }
        });
    }]);


app.controller('ColumnCreateCtrl', ['$scope','$uibModalInstance','$stateParams','$profile','action',
function ($scope, $uibModalInstance,$stateParams,$profile,action) {
    $scope.cancel=$uibModalInstance.dismiss;
    $scope.column={
        icon :'glyphicon-plus'
    }
    $scope.title="新建栏目"
    $scope.id = !$stateParams.id ? "#" : $stateParams.id ;
    $scope.initData = function(){
        return $profile.getRequest(angular.url('/main/system/column/edit/',$scope.id)).then(function(data) {
            $scope.column.parentName = data.name;
            $scope.column.parentId = data.id;
        });
    }
    $scope.addIconFun = function() {
        $profile.open('/main/system/column/icon','SelectedIconCtrl','lg',{}).result.then(function(data){
            $scope.column.icon = data;
        })
    }
    $scope.selectedRouter = function() {
        $profile.open(angular.url('/main/system/router/selected'),'RouterSelectCtrl','lg',{}).
        result.then(function(selectValue){
            $scope.column.routerId = selectValue.id;
            $scope.column.routerName = selectValue.innerName;
        })
    }
    $scope.initData();
    $scope.ok = function(isValid) {
        if(isValid){
            $profile.postForm(angular.url('/main/system/column/create/'),$scope.column).then(function(data){
                if(data.success){
                    $profile.alter(data.message,function() {
                        $uibModalInstance.close('')
                        action.callback && action.callback();
                    })
                }else{
                    $profile.error(data.message)
                }
            })

        }
    }
}])


app.controller('ColumnEditCtrl', ['$scope','$uibModalInstance','$stateParams','$profile','action',
    function ($scope, $uibModalInstance,$stateParams,$profile,action) {
        $scope.cancel=$uibModalInstance.dismiss;
        $scope.column={
            icon :'glyphicon-plus'
        }
        $scope.title="栏目编辑"
        $scope.id = !$stateParams.id ? "#" : $stateParams.id ;
        $scope.initData = function(){
            return $profile.getRequest(angular.url('/main/system/column/edit/',$scope.id)).then(function(data) {
                $scope.column = data;
            });
        }
        $scope.addIconFun = function() {
            $profile.open('/main/system/column/icon','SelectedIconCtrl','lg',{}).result.then(function(data){
                    $scope.column.icon = data;
            })
        }
        $scope.selectedRouter = function() {
            $profile.open(angular.url('/main/system/router/selected'),'RouterSelectCtrl','lg',{}).
            result.then(function(selectValue){
                $scope.column.routerId = selectValue.id;
                $scope.column.routerName = selectValue.innerName;
            })
        }
        $scope.initData();
        $scope.ok = function(isValid) {
            if(isValid){
                $profile.postForm(angular.url('/main/system/column/edit'),$scope.column).then(function(data){
                    if(data.success){
                        $profile.alter(data.message,function() {
                            $uibModalInstance.close('')
                            action.callback && action.callback();
                        })
                    }else{
                        $profile.error(data.message)
                    }
                })

            }
        }
    }])
app.controller('SelectedIconCtrl', ['$scope','$uibModalInstance','$stateParams','$profile','action',
    function ($scope, $uibModalInstance,$stateParams,$profile,action) {
        $scope.cancel=$uibModalInstance.dismiss;

        $scope.selectedIcon = function(el) {
            $uibModalInstance.close($(el.target).find('i').attr('class'))
        }
    }])

app.controller('RouterSelectCtrl', ['$scope','$uibModalInstance','$stateParams','$profile','action',
    function ($scope, $uibModalInstance,$stateParams,$profile,action) {
        $scope.cancel=$uibModalInstance.dismiss;

        $scope.tableConfig ={
            ajax : {
                url : angular.url('/main/system/router/loadData'),
            },
            formPanel:[
                {name:"innerName",text:"内部名",type:'text',size:4},
                {name:"outerName",text:"外部名",type:'text',size:4},
                {name:"outerUrl",text:"路径",type:'text',size:4}
            ],
            aoColumns: [
                { mData:null,mRender : function(a,b,c){
                    return c['innerName']||''
                } },
                { mData:null,mRender : function(a,b,c){
                    return c['name']||''
                } },

                { mData:null,mRender : function(a,b,c){
                    return c['templateUrl']||''
                } },
                { mData:null,mRender : function(a,b,c){
                    return c['url']||''
                } }
            ],
            scope : $scope,
            dblclick : function(tr,data,tbl,scope) {
                $uibModalInstance.close(data);
            }


        }
    }])
