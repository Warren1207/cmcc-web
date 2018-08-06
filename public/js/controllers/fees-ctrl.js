angular.module('app').controller('FeesListController',
    ['$rootScope', '$scope','$uibModal','$profile',function($rootScope, $scope,$modal,$profile) {
        $scope.$on('$viewContentLoaded', function() {
            $scope.tableConfig = ({
                ajax:{
                    url :'/fees/list'
                },
                pageLength: 10,
                formPanel: [
                    {name: "creditCardNo", text: "卡号", type: 'text', size: 4},
                    {name: "billYear", text: "账单年", type: 'text', size: 4},
                    {name: "billMonth", text: "账单月", type: 'text', size: 4}
                ],
                aoColumns : [
                    {mData: null, mRender: function (a, b, c) { return c['id'] || '' }},
                    {mData: null, mRender: function (a, b, c) { return c['creditCardNo'] || '' }},
                    {mData: null, mRender: function (a, b, c) { return c['owner'] || '' }},
                    {mData: null, mRender: function (a, b, c) { return c['shortCardNo'] || '' }},
                    {mData: null, mRender: function (a, b, c) { return c['year'] || '' }},
                    {mData: null, mRender: function (a, b, c) { return c['month'] || '' }},
                    {mData: null, mRender: function (a, b, c) { return c['repayAmount'] || '' }},
                    {mData: null, mRender: function (a, b, c) { return c['cdcc035'] || '' }},
                    {mData: null, mRender: function (a, b, c) { return c['feeAmount'] || '' }},

                ],
                scope : $scope
            })
        });
    }]);

