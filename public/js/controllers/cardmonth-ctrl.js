angular.module('app').controller('CardMonthListController',
    ['$rootScope', '$scope','$uibModal','$location','$profile',function($rootScope, $scope,$modal,$location,$profile) {
        $scope.$on('$viewContentLoaded', function() {
            App.initAjax();
            $scope.params = {}
            $scope.colums=[];
            $scope.dataSource=[];
            $scope.sumdataSource=[];
            $scope.total=[];
            $scope.jqgridcolums=[];       //jqgrid 表头
            $scope.jqgridSumcolums=[];    //jqgrid 汇总表头
            $scope.jqgridweek={};      //jqgrid 表头-星期
            $scope.initData = function (arg){
                App.blockUI({
                    message: '数据加载中...',
                    target: '.page-content',
                    overlayColor: 'none',
                    cenrerY: true,
                    boxed: true
                });
                $profile.getRequest('/cardmonth/init').then(function(data){
                    if(arg) $scope.colums = data.colums;

                    $scope.jqgridcolums=[];
                    jQuery("#jqGrid-card-month").GridUnload();                  //刷新重载
                    //写gqgrid的表头，星期
                    for(var col in $scope.colums){
                        $scope.jqgridcolums.push($scope.colums[col].text);
                    }

                    $scope.dataSource = data.dataSource;
                    $scope.params = data.params;

                    jQuery("#jqGrid-card-month").jqGrid({
                        datatype: "local",
                        colNames: $scope.jqgridcolums,
                        colModel: [
                            {name: 'isfeed',index: 'isfeed', width: 60, sorttype: 'text'},
                            {name: 'cardNo',index: 'cardNo', width: 140, sorttype: 'text'},
                            {name: 'bankName',index: 'bankName', width: 120, sorttype: 'text'},
                            {name: 'owner', index: 'owner', width: 65, sorttype: 'text'},
                            {name: 'shortcardNo', index: 'shortcardNo', width: 80, sorttype: 'text'},
                            {name: 'cardStatus', index: 'cardStatus', width: 65, sorttype: 'text',formatter:function(cellvalue, options, rowObject){
                                    var temp = "";
                                    if(cellvalue==0){
                                        temp = "0:有效";
                                    } else if(cellvalue==1){
                                        temp = "1:失效";
                                    } else {
                                        temp = "异常";
                                    }
                                    return temp;
                                }},
                            {name: 'isback', index: 'isback', width: 65, sorttype: 'text',formatter:function(cellvalue, options, rowObject){
                                    var temp = "";
                                    if(cellvalue==0){
                                        temp = "0:正常";
                                    } else if(cellvalue==1){
                                        temp = "1:退卡";
                                    } else {
                                        temp = "异常";
                                    }
                                    return temp;
                                }},
                            {name: 'yy', index: 'yy', width: 65, sorttype: 'number'},
                            {name: 'mm', index: 'mm', width: 65, sorttype: 'number'},
                            {name: 'sd', index: 'sd', width: 80, sorttype: 'date',},
                            {name: 'pd', index: 'pd', width: 80, sorttype: 'date'},
                            {name: 'currentStatus', index: 'currentStatus', width: 65, sorttype: 'text'},
                            {name: 'pr1', index: 'pr1', width: 100, formatter: 'number',sorttype: 'number',align:'right'},
                            {name: 'pr2', index: 'pr2', width: 100, formatter: 'number',sorttype: 'number',align:'right'},
                            {name: 'pr3', index: 'pr3', width: 100, formatter: 'number',sorttype: 'number',align:'right'},
                            {name: 'pr4', index: 'pr4', width: 100, formatter: 'number',sorttype: 'number',align:'right'}
                        ],
                        // width: 1100,
                        sortname: 'pd',
                        sortorder: "desc",
                        viewrecords: true,
                        rowNum:30,
                        rowList:[30,50,100],
                        autowidth: true,
                        // scroll: true,
                        jsonReader: {
                            repeatitems : false
                        },
                        pager : '#gridpager-card-month',
                        shrinkToFit: false,
                        multiselect : false,
                        // multikey : "ctrlKey",
                        rownumbers: true,
                        // caption: "Frozen Column with Group header",
                        height: 800,
                        lastpage:1
                    });

                    //排期列表填充表格数据
                    for(var i = 0;i<= $scope.dataSource.length;i++){
                        jQuery("#jqGrid-card-month").jqGrid('addRowData', i + 1, $scope.dataSource[i]);
                    }
                    //设定分页
                    jQuery("#jqGrid-card-month").jqGrid('navGrid', '#gridpager-card-month', {edit : false,add : false,del : false,search:false,refresh:false});

                    App.unblockUI('.page-content');

                })

            }

            //单元格风格设定
            function addCellAttr(rowID,val,rawObject,cm,rdata){
                return "style='background:White'";
            }

            $scope.initData(true);

        });

    }]);
