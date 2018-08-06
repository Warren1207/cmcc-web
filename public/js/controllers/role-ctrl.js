angular.module('app').controller('RolesCtrl', ['$rootScope', '$scope', '$uibModal','$profile',
    function($rootScope, $scope, $modal,$profile) {
        $scope.$on('$viewContentLoaded', function() {
            $scope.tableConfig = ({
                ajax:{
                    url:angular.url('/main/system/role/loadData'),
                },
                "pageLength": 5,
                formPanel: [
                    {name:"name",text:"角色名",type:'text'}
                ],
                aoColumns: [
                    {
                        "mDataProp": "id",
                        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                            var htm = ['<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline" name="cb-check-item">'
                                ,"<input type='checkbox' class='iCheck' name='checkList' value='" + sData + "'>",'<span></span></label>']
                            $(nTd).html(htm.join(''));
                        }
                    },
                    { mData:null,mRender : function(a,b,c){
                        return ['<a class="text-u-l" data-action="edit" data-id="',c['id'],'">',c['name']||'',"</a>"].join('');
                    } },
                    { mData:null,mRender : function(a,b,c){
                        return c['code']||''
                    } },
                    { mData:null,mRender : function(a,b,c){
                        return c['tenantName']||''
                    } },
                    { mData:null,mRender : function(a,b,c){
                        return c['desc']||''
                    } },
                    { mData:null,mRender : function(a,b,c){
                        return c['created']||''
                    } },
                    { mData:null,mRender : function(a,b,c){
                        return c['date']||''
                    } },
                    { mData: null ,mRender:function(a,b,c){
                        var _h = '<span class="pull-right" data-action="remove"  data-id="'+ c.id +'">\
                    <a data-action="remove" title="删除.">\
                    <i class="fa fa-times fa-fw"></i>\
                    </a>\
                    </span>';
                        return _h
                    }}
                ],
                scope : $scope,
                edit_action : function(d,t) {
                    $profile.open('/main/system/role/create','RoleEditCtrl','lg',{id : d.id}).result.then(function(v){
                        $scope.table.draw();
                    })
                },
                remove_action : function(d,t){
                    swal({
                        title: "确定删除?",
                        text: "你确定删除当前的角色吗?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "确定",
                        cancelButtonText : "取消",
                        closeOnConfirm: false,
                        showLoaderOnConfirm: true
                    }, function(){
                        $profile.post(angular.url('/main/system/role/remove/', d.id),{id : d.id}).then(function(data) {
                            if(data.success){
                                $profile.alter(data.message,function(){
                                    t.draw();
                                })
                            }else{
                                $profile.error(data.message)
                            }
                        })
                    });
                }
            })
            $scope.open = function(){
                $profile.open('/main/system/role/create','RoleCreateCtrl','lg',{}).result.then(function(v){
                    $scope.table.draw();
                })
            }
            $rootScope.settings.layout.pageContentWhite = true;
            $rootScope.settings.layout.pageBodySolid = false;
            $rootScope.settings.layout.pageSidebarClosed = false;
        });
    }]);


app.controller('RoleCreateCtrl', ['$scope','$uibModalInstance','$profile',function ($scope, $uibModalInstance,$profile) {
    $scope.cancel=$uibModalInstance.dismiss;
    $scope.title = "新增角色";
    $scope.initTree = function(a){
        $scope.tree = $(a).jstree({
            "core" : {
                "themes" : {
                    "responsive": false
                },
                "check_callback" : true,
                'data' : {
                    'url' : function (node) {
                        return '/main/system/column/node/all';
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
            "plugins" : [ "wholerow", "checkbox", "types" ]
        })
    }
    $scope.role = {};
    $scope.tenant={}
    $profile.getRequest("/main/system/role/dict").then(function(data){
        $scope.tenant=$profile.convSelect2(data.tenant,"code")
    })
    $scope.ok = function(isValid){
        var chk = $scope.tree.jstree().get_checked(true);
        var ids = [];
        $.each(chk,function() {
            ids.push(this.id);
            ids.push(this.parent)
        })
        $scope.role.resources = ids.join(',');
        if(isValid)
            $profile.postForm(angular.url('/main/system/role/create/'),$scope.role).then(function(data){
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


app.controller('RoleEditCtrl', ['$scope','$uibModalInstance','$profile','action',function ($scope, $uibModalInstance,$profile,action) {
    $scope.cancel=$uibModalInstance.dismiss;
    $scope.title = "修改角色";
    $scope.initTree = function(a){
        $scope.tree = $(a).jstree({
            "core" : {
                "themes" : {
                    "responsive": false
                },
                "check_callback" : true,
                'data' : {
                    'url' : function (node) {
                        return angular.url('/main/system/column/node/all/',action.id);
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
            "plugins" : [ "wholerow", "checkbox", "types" ]
        })
    }
    $scope.role = {};
    $scope.tenant={}
    $profile.getRequest("/main/system/role/dict").then(function(data){
        $scope.tenant=$profile.convSelect2(data.tenant,"code")
    })
    $profile.getRequest(angular.url('/main/system/role/id/',action.id)).then(function(data){
        $scope.role=data;
        $scope.role.tenantId = data.tenantId+""
    })
    $scope.ok = function(isValid){
        var chk = $scope.tree.jstree().get_checked(true);
        var ids = [];
        $.each(chk,function() {
            ids.push(this.id);
            ids.push(this.parent)
        })
        $scope.role.resources = ids.join(',');
        if(isValid)
            $profile.postForm(angular.url('/main/system/role/edit'),$scope.role).then(function(data){
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


