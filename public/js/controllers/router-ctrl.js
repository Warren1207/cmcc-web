angular.module('app').controller('RouterCtrl', ['$rootScope', '$scope', '$uibModal','$profile',
    function($rootScope, $scope, $modal,$profile) {

        $scope.$on('$viewContentLoaded', function() {
            $scope.tableConfig ={
                ajax:{
                    url: angular.url('/main/system/router/loadData'),
                },
                formPanel:[
                    {name:"innerName",text:"内部名",type:'text',size:4},
                    {name:"outerName",text:"外部名",type:'text',size:4},
                    {name:"outerUrl",text:"路径",type:'text',size:4}
                ],
                aoColumns: [
                    {
                        "mDataProp": "id",
                        "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                            var htm = ['<label class="mt-checkbox mt-checkbox-single mt-checkbox-outline">'
                                ,"<input type='checkbox' class='iCheck' name='checkList' value='" + sData + "'>",'<span></span></label>']
                            $(nTd).html(htm.join(''));
                        }
                    },
                    { mData:null,mRender : function(a,b,c){
                        return ['<a class="text-u-l" data-action="view" data-id="',c['id'],'">',c['innerName']||'',"</a>"].join('');
                    } },
                    { mData:null,mRender : function(a,b,c){
                        return c['name']||''
                    } },

                    { mData:null,mRender : function(a,b,c){
                        return c['templateUrl']||''
                    } },
                    { mData:null,mRender : function(a,b,c){
                        return c['url']||''
                    } },
                    { mData:null,mRender : function(a,b,c){
                        return c['controller']||''
                    } },
                    { mData:null,mRender : function(a,b,c){
                        var n = !c['isAbs'] ? "remove" : "ok"
                        return ['<i class="glyphicon glyphicon-',n,'"/>'].join('');
                    } },
                    { mData:null,mRender : function(a,b,c){
                        var n = !c['abstract'] ? "remove" : "ok"
                        return ['<i class="glyphicon glyphicon-',n,'"/>'].join('');
                    } },
                    { mData:null,mRender : function(a,b,c){
                        //$(c['template']).append()
                        //return [ '<pre><code>',c['template'],'</code></pre>'].join("")
                        return c['template']||''

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
                view_action : function(d,t) {
                    $modal.open({
                        templateUrl : angular.url('/main/system/router/create'),
                        backdrop:"static",
                        size :'lg',
                        controller: 'RouterEditCtrl',
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
                remove_action : function(d,t){
                    swal({
                        title: "确定删除?",
                        text: "你确定删除当前的路由吗?",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "确定",
                        cancelButtonText : "取消",
                        closeOnConfirm: false,
                        showLoaderOnConfirm: true
                    }, function(){
                        $profile.post(angular.url('/main/system/router/remove/', d.id),{}).then(function(data) {
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

            }
            $scope.openAddPage = function() {
                $modal.open({
                    templateUrl : angular.url('/main/system/router/create'),
                    backdrop:"static",
                    controller: 'RouterCreateCtrl',
                    keyboard:'false',
                    size :'lg',
                    scope:$scope
                }).result.then(function(v){
                    $scope.table.draw();
                })
            }
            $rootScope.settings.layout.pageContentWhite = true;
            $rootScope.settings.layout.pageBodySolid = false;
            $rootScope.settings.layout.pageSidebarClosed = false;
        });
    }]);

app.controller('RouterCreateCtrl', ['$scope','$uibModalInstance','$profile',function ($scope, $uibModalInstance,$profile) {
    $scope.cancle=$uibModalInstance.dismiss;
    $scope.router={
        resolve:[{}]
    }
    $scope.title = "新增路由";
    $scope.addChild = function() {
        $scope.router.resolve.push({})
    }
    $scope.ok = function(isValid){
        if(isValid)
            $profile.post(angular.url('/main/system/router/create/'),$scope.router).then(function(data){
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

app.controller('RouterEditCtrl', ['$scope','$uibModalInstance','$profile','action',
    function ($scope, $uibModalInstance,$profile,action) {

    $scope.cancle=$uibModalInstance.dismiss;
    $scope.router={
        resolve:[{}]
    }
    $scope.title = "修改路由";
    $scope.addChild = function() {
        $scope.router.resolve.push({})
    }
    $scope.init = function(){
        var _url = angular.url('/main/system/router/edit/',action.id);
        $profile.getRequest(_url).then(function(data){
            $scope.router = data;
        })
    }
    $scope.init();
    $scope.ok = function(isValid){
        if(isValid)
            $profile.post('/main/system/router/edit',$scope.router).then(function(data){
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
