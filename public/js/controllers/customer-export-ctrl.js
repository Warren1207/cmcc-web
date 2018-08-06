
angular.module('app').controller('CustomerExportIndexCtrl',
    ['$rootScope', '$scope','$profile','$exportFactory',
        function($rootScope, $scope,$profile,$export) {
        $scope.$on('$viewContentLoaded', function() {
            App.initAjax();
            $scope.tableConfig = ({
                ajax:{
                    url: '/customer/export/list',
                },

                formPanel: [
                    {name: "innerName", text: "文件名", type: 'text', size: 6}
                ],
                aoColumns: [
                    {
                        mData: null, mRender: function (a, b, c) {
                        return ['<a title="下载" target="_blank" href="/customer/export/download/', c.id, '">', c['innerName'] || '', '</a>'].join('')
                    }
                    },
                    {
                        mData: null, mRender: function (a, b, c) {
                        return ['<a title="" data-action="show" data-id="' + c.id + '">查看详情</a>'].join('')
                    }
                    },
                    {
                        mData: null, mRender: function (a, b, c) {
                        return c['userCreated'] || ''
                    }
                    },
                    {
                        mData: null, mRender: function (a, b, c) {
                        return c['timeCreated'] || ''
                    }
                    },
                    {
                        mData: null, mRender: function (a, b, c) {
                        return c['timeModified'] || ''
                    }
                    },
                    {
                        mData: null, mRender: function (a, b, c) {
                        var status = c['status']
                        if (status == 0) {
                            return "待解析"
                        } else if (status == 1) {
                            return "解析完成"
                        } else {
                            return "解析错误"
                        }
                    }
                    }
                ],
                scope: $scope,
                show_action: function (d, t) {
                    $profile.open(angular.url('/customer/export/log/detail'),'CustomerExportLogDetail','lg',{id:d.id})
                }
            });
        });
        $scope.importExcel = function() {
            $export.importExcel(angular.url('/customers/export/template'),angular.url('/customer/export/import')).result.then(function(){
                $scope.table.draw();
            })
        }

    }]);


app.controller("CustomerExportLogDetail",['$scope','$http','$uibModalInstance','action',
    function($scope,$http,$uibModalInstance,action) {
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.tableConfig = ({
            ajax : {
                url : angular.url('/customer/export/log/detail/',action.id),
            },
            formPanel: [
                {name: "item", text: "卡号", type: 'text', size: 6}
            ],
            aoColumns: [
                {mData: null, mRender: function (a, b, c) { return c['item'] || '' }},
                {mData: null, mRender: function (a, b, c) { return c['message'] || '' }}
            ],
            scope: $scope
        });

    }])