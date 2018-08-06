angular.module('app').controller('ExpenseandreceiptsAlreadyListController',
    ['$rootScope', '$scope','$uibModal','$location','$profile',function($rootScope, $scope,$modal,$location,$profile) {
        $scope.$on('$viewContentLoaded', function() {
            App.initAjax();
            $scope.header = [];
            $scope.colums=[];
            $scope.dataSource=[];
            $scope.sumdataSource=[];
            $scope.total=[];
            $scope.jqgridcolums=[];       //jqgrid 表头
            $scope.jqgridSumcolums=[];    //jqgrid 汇总表头
            $scope.jqgridweek={};      //jqgrid 表头-星期
            $scope.THidden={};         //jqgird T-1...T28 是否隐藏
            $scope.TCheckbox={};       //jqgird 表头勾选框
            $scope.initData = function (arg){
                App.blockUI({
                    message: '数据加载中...',
                    target: '.page-content',
                    overlayColor: 'none',
                    cenrerY: true,
                    boxed: true
                });
                $profile.getRequest('/trials/singlecardsimulation/already/init').then(function(data){
                    var lastsel;
                    if(arg) $scope.colums = data.colums;

                    $scope.jqgridcolums=[];
                    $scope.jqgridSumcolums =[];
                    $scope.jqgridweek={};
                    $scope.TCheckbox.pricechk = {};
                    $scope.TCheckbox.datechk = {};
                    // jQuery("#jqGrid-already").jqGrid("clearGridData");    //清空表数据
                    // jQuery("#jqGrid-already").trigger("reloadGrid");      //重新加截
                    jQuery("#jqGrid-already").GridUnload();                  //刷新重载
                    jQuery("#jqGrid-d-already").GridUnload();
                    //写gqgrid的表头，星期
                    for(var col in $scope.colums){
                        if($scope.colums[col].name.match("T[-10123456789]")){
                            var ttitle = $scope.colums[col].date+"("+$scope.colums[col].name+")"+
                                "  <i style='font-size: 16px' class=\"fa fa-square-o fa-square-ofa-check-square-o\" tname='"+$scope.colums[col].name+"'   name='pricechk"+$scope.colums[col].name+"'></i> "+
                                "  <i style='font-size: 16px' class=\"fa fa-square-o fa-square-ofa-check-square-o\" tname='"+$scope.colums[col].name+"'   name='datechk"+$scope.colums[col].name+"'></i> "
                            $scope.jqgridcolums.push(ttitle);
                            var key = $scope.colums[col].name;
                            var value = $scope.colums[col].week;
                            $scope.jqgridweek[key] = value;
                        }else{
                            $scope.jqgridcolums.push($scope.colums[col].text);
                        }
                    }
                    //写gqgridSum的表头，星期
                    for(var col in $scope.colums){
                        if($scope.colums[col].name.match("T[-10123456789]")){
                            var ttitle = $scope.colums[col].date+"("+$scope.colums[col].name+")"
                            $scope.jqgridSumcolums.push(ttitle);
                        }else{
                            if($scope.colums[col].name =="name"){
                                $scope.jqgridSumcolums.push("汇总项");
                            }
                        }
                    }

                    $scope.dataSource = $scope.dataProcess(data.dataSource);
                    $scope.total  = $scope.dataTotalProcess(data.total1,data.total2,data.total3);
                    $scope.THidden = $scope.THiddenProcess();

                    jQuery("#jqGrid-already").jqGrid({
                        datatype: "local",
                        colNames: $scope.jqgridcolums,
                        colModel: [
                            {name: 'name',index: 'name', width: 60, sorttype: 'text', frozen : true},
                            {name: 'cardNo', label:'信用卡号',index: 'cardNo', width: 120, sorttype: 'text',hidden:true,frozen : true},
                            {name: 'shortcardNo', label:'短卡号',index: 'shortcardNo', width: 60, sorttype: 'text', frozen : true},
                            {name: 'sd', label:'账单日',index: 'sd', width: 75, sorttype: 'text', frozen : true},
                            {name: 'pd', label:'还款日',index: 'pd', width: 75, sorttype: 'date', frozen : true},
                            {name: 'rf', label:'账单金额', index: 'rf', width: 60, sorttype: 'number',align:'right', frozen : true},
                            {name: 'number', label:'期别',index: 'number', width: 60, sorttype: 'text', frozen : true},
                            {name: 'strategy', label:'策略',index: 'strategy', width: 60, sorttype: 'text', frozen : true},
                            {name: 'T-1', index: 'T-1', width: 140, formatter: 'text', sorttype: 'text', align: 'right',sortable:false,hidden:$scope.THidden.T_1,cellattr:addCellAttr },
                            {name: 'T0', index: 'T0', width: 140 ,formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T0,cellattr:addCellAttr},
                            {name: 'T1', index: 'T1', width: 140 ,formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T1,cellattr:addCellAttr},
                            {name: 'T2', index: 'T2', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T2,cellattr:addCellAttr},
                            {name: 'T3', index: 'T3', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T3,cellattr:addCellAttr},
                            {name: 'T4', index: 'T4', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T4,cellattr:addCellAttr},
                            {name: 'T5', index: 'T5', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T5,cellattr:addCellAttr},
                            {name: 'T6', index: 'T6', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T6,cellattr:addCellAttr},
                            {name: 'T7', index: 'T7', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T7,cellattr:addCellAttr},
                            {name: 'T8', index: 'T8', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T8,cellattr:addCellAttr},
                            {name: 'T9', index: 'T9', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T9,cellattr:addCellAttr},
                            {name: 'T10', index: 'T10', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T10,cellattr:addCellAttr},
                            {name: 'T11', index: 'T11', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T11,cellattr:addCellAttr},
                            {name: 'T12', index: 'T12', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T12,cellattr:addCellAttr},
                            {name: 'T13', index: 'T13', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T13,cellattr:addCellAttr},
                            {name: 'T14', index: 'T14', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T14,cellattr:addCellAttr},
                            {name: 'T15', index: 'T15', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T15,cellattr:addCellAttr},
                            {name: 'T16', index: 'T16', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T16,cellattr:addCellAttr},
                            {name: 'T17', index: 'T17', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T17,cellattr:addCellAttr},
                            {name: 'T18', index: 'T18', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T18,cellattr:addCellAttr},
                            {name: 'T19', index: 'T19', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T19,cellattr:addCellAttr},
                            {name: 'T20', index: 'T20', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T20,cellattr:addCellAttr},
                            {name: 'T21', index: 'T21', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T21,cellattr:addCellAttr},
                            {name: 'T22', index: 'T22', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T22,cellattr:addCellAttr},
                            {name: 'T23', index: 'T23', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T23,cellattr:addCellAttr},
                            {name: 'T24', index: 'T24', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T24,cellattr:addCellAttr},
                            {name: 'T25', index: 'T25', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T25,cellattr:addCellAttr},
                            {name: 'T26', index: 'T26', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T26,cellattr:addCellAttr},
                            {name: 'T27', index: 'T27', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T27,cellattr:addCellAttr},
                            {name: 'T28', index: 'T28', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T28,cellattr:addCellAttr}
                        ],
                        width: 1100,
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
                        pager : '#gridpager-already',
                        shrinkToFit: false,
                        multiselect : true,
                        // multikey : "ctrlKey",
                        rownumbers: true,
                        // caption: "Frozen Column with Group header",
                        height: 500,
                        lastpage:1,
                        ondblClickRow : function(rowid,iRow,iCol,e) {
                            // if (rowid &&  rowid !== lastsel) {
                            if (rowid ) {
                                lastsel = rowid;
                                var row = $scope.dataSource[rowid-1];
                                $profile.open('/trials/singlecardsimulation/scheduling/row/edit','EditAlreadySchedulingCtrl','',{row:row,columns:$scope.colums},true).result.then(function(row){
                                    $scope.initData(true);
                                })
                            }
                        },
                        onSelectRow : function (rowid,status) {
                            var sl=$(".ui-jqgrid-bdiv").scrollLeft();
                            $scope.gettotal3();
                            $($(".ui-jqgrid-bdiv")[0]).scrollLeft(sl);
                            $($(".ui-jqgrid-bdiv")[2]).scrollLeft(sl);
                        },
                        onSelectAll: function(aRowids,status){
                            $scope.gettotal3();
                        }
                    });
                    jQuery("#jqGrid-d-already").jqGrid({
                        datatype: "local",
                        colNames: $scope.jqgridSumcolums,
                        colModel: [
                            {name: 'name',index: 'name', width: 450, align: 'center',sorttype: 'text', frozen : true},
                            {name: 'T-1', index: 'T-1', width: 140, formatter: 'text', sorttype: 'text', align: 'right',sortable:false,hidden:$scope.THidden.T_1,cellattr:addCellAttr },
                            {name: 'T0', index: 'T0', width: 140 ,formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T0,cellattr:addCellAttr},
                            {name: 'T1', index: 'T1', width: 140 ,formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T1,cellattr:addCellAttr},
                            {name: 'T2', index: 'T2', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T2,cellattr:addCellAttr},
                            {name: 'T3', index: 'T3', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T3,cellattr:addCellAttr},
                            {name: 'T4', index: 'T4', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T4,cellattr:addCellAttr},
                            {name: 'T5', index: 'T5', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T5,cellattr:addCellAttr},
                            {name: 'T6', index: 'T6', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T6,cellattr:addCellAttr},
                            {name: 'T7', index: 'T7', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T7,cellattr:addCellAttr},
                            {name: 'T8', index: 'T8', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T8,cellattr:addCellAttr},
                            {name: 'T9', index: 'T9', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T9,cellattr:addCellAttr},
                            {name: 'T10', index: 'T10', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T10,cellattr:addCellAttr},
                            {name: 'T11', index: 'T11', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T11,cellattr:addCellAttr},
                            {name: 'T12', index: 'T12', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T12,cellattr:addCellAttr},
                            {name: 'T13', index: 'T13', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T13,cellattr:addCellAttr},
                            {name: 'T14', index: 'T14', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T14,cellattr:addCellAttr},
                            {name: 'T15', index: 'T15', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T15,cellattr:addCellAttr},
                            {name: 'T16', index: 'T16', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T16,cellattr:addCellAttr},
                            {name: 'T17', index: 'T17', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T17,cellattr:addCellAttr},
                            {name: 'T18', index: 'T18', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T18,cellattr:addCellAttr},
                            {name: 'T19', index: 'T19', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T19,cellattr:addCellAttr},
                            {name: 'T20', index: 'T20', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T20,cellattr:addCellAttr},
                            {name: 'T21', index: 'T21', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T21,cellattr:addCellAttr},
                            {name: 'T22', index: 'T22', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T22,cellattr:addCellAttr},
                            {name: 'T23', index: 'T23', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T23,cellattr:addCellAttr},
                            {name: 'T24', index: 'T24', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T24,cellattr:addCellAttr},
                            {name: 'T25', index: 'T25', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T25,cellattr:addCellAttr},
                            {name: 'T26', index: 'T26', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T26,cellattr:addCellAttr},
                            {name: 'T27', index: 'T27', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T27,cellattr:addCellAttr},
                            {name: 'T28', index: 'T28', width: 140, formatter: 'number', sorttype: 'number', align: 'right',sortable:false,hidden:$scope.THidden.T28,cellattr:addCellAttr}
                        ],
                        width: 1100,
                        sortname: 'pd',
                        sortorder: "desc",
                        viewrecords: true,
                        rowNum:10,
                        autowidth: true,
                        multiselect : true,
                        jsonReader: {
                            repeatitems : false
                        },
                        shrinkToFit: false,
                        rownumbers: true,
                        // caption: "Frozen Column with Group header",
                        height: 100,
                        lastpage:1
                    });

                    //排期列表填充表格数据
                    for(var i = 0;i<= $scope.dataSource.length;i++){
                        jQuery("#jqGrid-already").jqGrid('addRowData', i + 1, $scope.dataSource[i]);
                    }
                    //排期汇总表填充数据
                    $scope.getSumData();

                    //组出单头上的星期
                    if(arg) jQuery("#jqGrid-already").jqGrid('setGroupHeaders', {
                        useColSpanStyle: true,
                        groupHeaders:[
                            {startColumnName: 'T-1',align: 'center', numberOfColumns: 1,  titleText: $scope.jqgridweek['T-1']},
                            {startColumnName: 'T0',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T0']},
                            {startColumnName: 'T1',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T1']},
                            {startColumnName: 'T2',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T2']},
                            {startColumnName: 'T3',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T3']},
                            {startColumnName: 'T4',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T4']},
                            {startColumnName: 'T5',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T5']},
                            {startColumnName: 'T6',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T6']},
                            {startColumnName: 'T7',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T7']},
                            {startColumnName: 'T8',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T8']},
                            {startColumnName: 'T9',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T9']},
                            {startColumnName: 'T10',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T10']},
                            {startColumnName: 'T11',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T11']},
                            {startColumnName: 'T12',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T12']},
                            {startColumnName: 'T13',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T13']},
                            {startColumnName: 'T14',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T14']},
                            {startColumnName: 'T15',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T15']},
                            {startColumnName: 'T16',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T16']},
                            {startColumnName: 'T17',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T17']},
                            {startColumnName: 'T18',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T18']},
                            {startColumnName: 'T19',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T19']},
                            {startColumnName: 'T20',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T20']},
                            {startColumnName: 'T21',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T21']},
                            {startColumnName: 'T22',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T22']},
                            {startColumnName: 'T23',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T23']},
                            {startColumnName: 'T24',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T24']},
                            {startColumnName: 'T25',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T25']},
                            {startColumnName: 'T26',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T26']},
                            {startColumnName: 'T27',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T27']},
                            {startColumnName: 'T28',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T28']}

                        ]
                    });
                    if(arg) jQuery("#jqGrid-d-already").jqGrid('setGroupHeaders', {
                        useColSpanStyle: true,
                        groupHeaders:[
                            {startColumnName: 'T-1',align: 'center', numberOfColumns: 1,  titleText: $scope.jqgridweek['T-1']},
                            {startColumnName: 'T0',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T0']},
                            {startColumnName: 'T1',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T1']},
                            {startColumnName: 'T2',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T2']},
                            {startColumnName: 'T3',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T3']},
                            {startColumnName: 'T4',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T4']},
                            {startColumnName: 'T5',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T5']},
                            {startColumnName: 'T6',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T6']},
                            {startColumnName: 'T7',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T7']},
                            {startColumnName: 'T8',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T8']},
                            {startColumnName: 'T9',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T9']},
                            {startColumnName: 'T10',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T10']},
                            {startColumnName: 'T11',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T11']},
                            {startColumnName: 'T12',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T12']},
                            {startColumnName: 'T13',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T13']},
                            {startColumnName: 'T14',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T14']},
                            {startColumnName: 'T15',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T15']},
                            {startColumnName: 'T16',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T16']},
                            {startColumnName: 'T17',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T17']},
                            {startColumnName: 'T18',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T18']},
                            {startColumnName: 'T19',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T19']},
                            {startColumnName: 'T20',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T20']},
                            {startColumnName: 'T21',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T21']},
                            {startColumnName: 'T22',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T22']},
                            {startColumnName: 'T23',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T23']},
                            {startColumnName: 'T24',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T24']},
                            {startColumnName: 'T25',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T25']},
                            {startColumnName: 'T26',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T26']},
                            {startColumnName: 'T27',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T27']},
                            {startColumnName: 'T28',align: 'center', numberOfColumns: 1, titleText: $scope.jqgridweek['T28']}

                        ]
                    });
                    //设定分页
                    jQuery("#jqGrid-already").jqGrid('navGrid', '#gridpager-already', {edit : false,add : false,del : false,search:false,refresh:false});
                    //设定窗口冻结
                    jQuery("#jqGrid-already").jqGrid('setFrozenColumns');
                    jQuery("#jqGrid-d-already").jqGrid('setFrozenColumns');
                    // 设定CheckBox勾选事件
                    $scope.checkBoxChoose();

                    //上下表格的滚动条保持一致
                    $($(".ui-jqgrid-bdiv")).on('scroll',function(){
                        var sl=$(this).scrollLeft();
                        // console.log(sl);
                        $($(".ui-jqgrid-bdiv")[0]).scrollLeft(sl);
                        $($(".ui-jqgrid-bdiv")[2]).scrollLeft(sl);
                    });

                    //隐藏第二个表格的单头，保持列锁定
                    $($(".ui-jqgrid-hdiv"))[2].style.display="none";
                    $($(".ui-jqgrid-hdiv"))[3].style.display="none";
                    $($('.frozen-bdiv.ui-jqgrid-bdiv')[1]).css('top','0')

                    App.unblockUI('.page-content');

                })

            }

            //单元格风格设定
            function addCellAttr(rowID,val,rawObject,cm,rdata){
                var TName = cm.name;
                /*
                颜色设置规则：
                  TN 不存在：灰色；
                  TN 存在，不是T-1 ：白色；
                  TN 存在，是 T-1，实际=0，调整=0 ：红色；
                  TN 存在，是 T-1，实际+调整=计划，调整>0 ：黄色；
                  TN 存在，是 T-1，实际+调整=计划，调整=0 ：绿色；
                  TN 存在，是 T-1，实际+调整!=计划 ：橙色；
                 */
                if(!rawObject.plan){
                    return "style='background:White'";
                }
                if(TName != null){
                    if(rawObject[TName] ){ //判rawObject里面是否有TName这个Key另外判断这个Key是否有值
                        if(TName=="T-1"){
                            var actual_T_1 = !!rawObject.actual[TName] ? rawObject.actual[TName] : 0 ;
                            var adjusted_T_1 = !!rawObject.adjusted[TName] ? rawObject.adjusted[TName] : 0 ;
                            var plan_T_1 = !!rawObject.plan[TName] ? rawObject.plan[TName] : 0 ;
                            if(actual_T_1 == 0 && adjusted_T_1 ==0 && plan_T_1 !=0){
                                return "style='background:Red'";
                            }else if(adjusted_T_1+actual_T_1 == plan_T_1){
                                if(adjusted_T_1 > 0 ){
                                    return "style='background:Yellow'";
                                }else{
                                    return "style='background:Green'";
                                }
                            }else{
                                return "style='background:Orange'";
                            }
                        }else {
                            return "style='background:White'";
                        }
                    }else{
                        return "style='background:DarkGray'";
                    }
                }
            }

            //勾选框事件
            $scope.checkBoxChoose = function(){
                $('.fa-square-ofa-check-square-o').click(function() {
                    var sl=$(".ui-jqgrid-bdiv").scrollLeft();

                    var T = this.getAttribute('tname');
                    var name = this.getAttribute('name');
                    /** 第一个复选框 checkboxOne 第二个复选框 checkboxTwo **/
                    var checkboxOne = null,checkboxTwo = null;
                    /**  判断是第一还是第二个复选框 **/
                    var checkboxType = name.indexOf('pricechk')>=0?1:2;
                    /**  T-1 的第二个复选框 没有点击事件  **/
                    if(checkboxType == 2 && T=="T-1"){
                        return
                    }
                    if(checkboxType == 1){
                        checkboxOne = $(this);
                        var name = name.replace('pricechk','datechk');
                        checkboxTwo = $("i[name='"+name+"']");
                    }else{
                        checkboxTwo = $(this);
                        var name = name.replace('datechk','pricechk');
                        checkboxOne = $("i[name='"+name+"']");
                    }
                    /** true 为未选中  false 为选中 **/
                    var isChecked =$(this).hasClass('fa-square-o');

                    if(isChecked){
                        $(this).removeClass('fa-square-o');
                        $(this).addClass('fa-check-square-o');
                        if(checkboxType == 1){
                            $scope.TCheckbox.pricechk[T] = "Y";
                        }else{
                            $scope.TCheckbox.datechk[T] = "Y";
                            //第2个勾选框勾选上，第1个自动跟着勾上
                            $scope.TCheckbox.pricechk[T] = "Y";
                            checkboxOne.removeClass('fa-square-o');
                            checkboxOne.addClass('fa-check-square-o');
                        }
                    }else{
                        $scope.TCheckbox.pricechk[T] = "N";
                        $(this).removeClass('fa-check-square-o');
                        $(this).addClass('fa-square-o');

                        if(checkboxType == 1){
                            $scope.TCheckbox.pricechk[T] = "N";
                            //第1个勾选框取消勾，第2个自动取消勾
                            $scope.TCheckbox.datechk[T] = "N";
                            checkboxTwo.removeClass('fa-check-square-o');
                            checkboxTwo.addClass('fa-square-o');
                        }else{
                            $scope.TCheckbox.datechk[T] = "N";
                            checkboxTwo.removeClass('fa-check-square-o');
                            checkboxTwo.addClass('fa-square-o');
                        }

                    }

                    $scope.gettotal3();
                    $($(".ui-jqgrid-bdiv")[0]).scrollLeft(sl);
                    $($(".ui-jqgrid-bdiv")[2]).scrollLeft(sl);

                });
            }
            $scope.initData(true);
            $scope.dataProcess = function(data){

                for(var i = 0;i<data.length;i++) {
                    // var planObj = data[i].plan;
                    var planObj={};
                    angular.copy(data[i].plan,planObj);
                    // delete data[i].plan;
                    var T_1 = "T-1";
                    planObj[T_1] = !!data[i].actual[T_1] ? data[i].actual[T_1]:0
                    planObj[T_1] = planObj[T_1]+"/"+(!!data[i].adjusted[T_1] ? data[i].adjusted[T_1]:0);
                    planObj[T_1] = planObj[T_1]+"/"+(!!data[i].plan[T_1] ? data[i].plan[T_1]:0);
                    angular.extend(data[i], planObj);

                }
                return data;
            }

            $scope.dataTotalProcess = function(data1,data2,data3){
                var total = [];
                total.push({});
                total.push({});
                total.push({});

                angular.extend(total[0],data1);
                angular.extend(total[1],data2);
                angular.extend(total[2],data3);

                var T_1 = "T-1";
                total[0][T_1] = "";
                total[1][T_1] = "";
                total[2][T_1] = "";

                total[0].name = "已排汇总";
                total[1].name = "初排+已排汇总：";
                total[2].name = "勾选金额汇总：";
                return total;

            }

            $scope.THiddenProcess = function(){
                //找到所有的卡片还款计划中最大的 T+N 日期
                for(var i = -1;i<=28;i++) {
                    var tday = "T" + i;
                    if (tday == "T-1") {
                        continue;
                    } else{
                        for (var data in $scope.dataSource) {
                            if (tday in $scope.dataSource[data]) {
                                $scope.THidden.maxTday = i;
                                break;
                            }
                        }
                    }
                }

                //根据最大的 T+N 来设置动态隐藏表头，N 日期之后的全部隐藏起来
                if($scope.THidden.maxTday != null){
                    for(var j = -1;j<=28;j++){
                        var tday = "T"+j;
                        if(tday == "T-1"){ tday = "T_1" ;}
                        if(j<= $scope.THidden.maxTday){
                            $scope.THidden[tday] = false;
                        }else{
                            $scope.THidden[tday] = true;
                        }
                    }
                }
                return $scope.THidden;
            }

            $scope.genScheduling = function() {
                $profile.confirm('确定','确定将已勾选卡片的初排转成已排',function(){
                    $(event.target).parent().prop('disabled',true);
                    var selectSource = [];
                    // angular.copy($scope.dataSource,selectSource);
                    var selectRows = jQuery("#jqGrid-already").jqGrid('getGridParam', 'selarrrow');
                    if(selectRows != null){
                        for(var i = 0;i< selectRows.length;i++){
                            selectSource.push($scope.dataSource[selectRows[i]-1]);
                        }
                    }
                    $profile.post('/trials/singlecardsimulation/scheduling/confirm',selectSource).then(function(data) {
                        if(data.success){
                            $profile.alter(data.message,function(){
                                $scope.initData(true);
                            })
                        }else{
                            $profile.error(data.message)
                        }
                        $(event.target).parent().prop('disabled',false);
                    })
                })
            }

            $scope.regeneration = function(isValid){
                var l_yes1 = "N";
                var l_yes2 = "N";
                var selectSource = [];
                // angular.copy($scope.dataSource,selectSource);

                //检查至少勾选了一条信用卡
                var selectRows = jQuery("#jqGrid-already").jqGrid('getGridParam', 'selarrrow');
                if(selectRows != null){
                    for(var i = 0;i< selectRows.length;i++){
                        selectSource.push($scope.dataSource[selectRows[i]-1]);
                    }
                }
                if(selectSource ==null || selectSource.length == 0){
                    $profile.error("至少勾选1笔信用卡资料");
                    return;
                }

                //检查至少勾选了一天的pricechk 和 datachk
                var ispchk = false;
                var isdchk = false;
                for(var pchk in $scope.TCheckbox.pricechk){
                    if($scope.TCheckbox.pricechk[pchk] == "Y"){
                        ispchk = true;
                    }
                }
                for(var dchk in $scope.TCheckbox.datechk){
                    if($scope.TCheckbox.datechk[dchk] == "Y"){
                        isdchk = true;
                    }
                }
                if(ispchk == false || isdchk == false){
                    $profile.error("至少勾选需要操作的一天数据");
                    return;
                }

                $profile.confirm('确定','确定重排已选中的计划吗？',function() {
                    var batch = [];
                    for(var i =0;i< selectSource.length;i++) {
                        var columns = [];
                        for (var t = -1; t <= $scope.THidden.maxTday; t++) {
                            var eleT = {};
                            var TN = "T" + t;
                            eleT.id = TN;
                            eleT.value = $scope.dataSource[selectRows[i] - 1][TN];
                            if (!eleT.value) {
                                eleT.value = 0;
                            }
                            if ($scope.TCheckbox.pricechk[TN] == "Y") {
                                eleT.pricechk = "Y";
                            } else {
                                eleT.pricechk = "N";
                            }
                            if ($scope.TCheckbox.datechk[TN] == "Y") {
                                eleT.datechk = "Y";
                            } else {
                                eleT.datechk = "N";
                            }
                            for (var col in $scope.colums) {
                                if ($scope.colums[col].name == TN) {
                                    eleT.text = $scope.colums[col].date + $scope.colums[col].week;
                                    break;
                                }
                            }
                            columns.push(eleT);
                        }
                        batch.push({});
                        batch[i].head = selectSource[i];
                        batch[i].columns = columns;
                        batch[i].reGenerationStatus = "1";
                    }
                    $profile.post('/trials/singlecardsimulation/scheduling/batchRegeneration',{
                        batch:batch
                    }).then(function (data) {
                        if (data.success) {
                            $profile.alter(data.message, function () {
                                // $uibModalInstance.close('');
                                $scope.initData(true);
                            })
                        } else {
                            $profile.error(data.message);
                        }
                    })
                    // $profile.alter(data.message, function () {
                    //     $uibModalInstance.close('')
                    // });
                })
            }

            $scope.getSumData = function(){
                jQuery("#jqGrid-d-already").jqGrid('addRowData', 1, $scope.total[0]);
                jQuery("#jqGrid-d-already").jqGrid('addRowData', 2, $scope.total[1]);
                jQuery("#jqGrid-d-already").jqGrid('addRowData', 3, $scope.total[2]);

            }

            $scope.gettotal3 = function(){
                var selectSource = [];
                // angular.copy($scope.dataSource,selectSource);
                var selectRows = jQuery("#jqGrid-already").jqGrid('getGridParam', 'selarrrow');
                if(selectRows != null){
                    for(var pchk in $scope.TCheckbox.pricechk){
                        var total2_sum = 0;
                        if($scope.TCheckbox.pricechk[pchk] == "Y"){
                            //T-1 需要解析字符串  0/0/2700
                            if(pchk == "T-1"){
                                var total2_sum0 = 0;    //实际
                                var total2_sum1 = 0;    //调整
                                var total2_sum2 = 0;    //计划

                                for (var i = 0; i < selectRows.length; i++) {
                                    var T_1price = $scope.dataSource[selectRows[i] - 1][pchk];
                                    if(! T_1price) {T_1price = "0/0/0"; }
                                    var T_1Array = T_1price.split("/");
                                    total2_sum0 = total2_sum0 + Number(T_1Array[0]);
                                    total2_sum1 = total2_sum1 + Number(T_1Array[1]);
                                    total2_sum2 = total2_sum2 + Number(T_1Array[2]);
                                }
                                total2_sum = total2_sum0+"/"+total2_sum1+"/"+total2_sum2;
                            }else {
                                for (var i = 0; i < selectRows.length; i++) {
                                    total2_sum = total2_sum + (!!$scope.dataSource[selectRows[i] - 1][pchk] ? $scope.dataSource[selectRows[i] - 1][pchk] : 0);
                                }
                            }
                            $scope.total[2][pchk] = total2_sum;
                        }else{
                            $scope.total[2][pchk] = total2_sum;
                        }
                    }
                }
                $("#jqGrid-d-already").jqGrid('clearGridData');//清空表格
                $("#jqGrid-d-already").jqGrid('setGridParam',{
                    datatype:'local',
                    data:$scope.total,//newData是符合格式要求的重新加载的数据
                    page:1//哪一页的值
                }).trigger("reloadGrid");
            }
        });

    }]);

app.controller('EditAlreadySchedulingCtrl', ['$scope','$uibModalInstance','$profile','action',
    function ($scope, $uibModalInstance,$profile,action) {
        $scope.cancel=$uibModalInstance.dismiss;
        $scope.title = "修改排期数据";
        $scope.row = action.row;
        $scope.columns = [];
        var todayTime = new Date();
        var today = new Date(todayTime.getFullYear(),todayTime.getMonth(),todayTime.getDate());
        var year = today.getFullYear();
        var tdate = today;
        var ishide = false;
        angular.forEach(action.columns,function(data,index,array){
            if(!data.lock) {
                // $scope.columns.push({text:data.date,id:data.name,value:$scope.row[data.name]||0,chk:'N'});
                var ishide = false;
                tdate = new Date((year+"-"+data.date).replace(/-/g,"/"));
                //解决跨年后的1.1日，T-1不显示
                if(data.name == "T-1" && tdate>today){
                    tdate =  new Date((year-1+"-"+data.date).replace(/-/g,"/"));
                }
                if(tdate < today && data.name != "T-1"){
                    tdate.setYear(year+1);
                }
                if(tdate - new Date($scope.row.pd.replace(/-/g,"/")) > 5*24*60*60*1000){
                    ishide = true;
                }else{
                    ishide = false;
                }
                if(data.isRest){
                    labeldata = "【休】"+(data.week).substr(1,1)+data.date+"("+data.name+")";
                }else{
                    labeldata = "      "+(data.week).substr(1,1)+data.date+"("+data.name+")";
                }
                if(data.name == "T-1"){
                    setPriceChkEntry = false;
                    setDateChkEntry = true;
                    var backcolor ;
                    var actual_T_1 = !! $scope.row.actual[data.name] ? $scope.row.actual[data.name]: 0 ;
                    var adjusted_T_1 = !! $scope.row.adjusted[data.name] ? $scope.row.adjusted[data.name]  : 0 ;
                    var plan_T_1 = !! $scope.row.plan[data.name]  ? $scope.row.plan[data.name] : 0 ;
                    if(actual_T_1 == 0 && adjusted_T_1 ==0){
                        backcolor = "Red";
                    }else if(adjusted_T_1+actual_T_1 == plan_T_1){
                        if(adjusted_T_1 > 0 ){
                            backcolor= "Yellow";
                        }else{
                            backcolor= "Green";
                        }
                    }else{
                        backcolor= "Orange";
                    }
                    // var a = $scope.row.actual[data.name]||0;
                    // var p = $scope.row.plan[data.name]||0;
                    // $scope.row[data.name] = a+"/"+p;
                }else{
                    setPriceChkEntry = false;
                    setDateChkEntry = false;
                    backcolor="White";
                }
                $scope.columns.push({text:labeldata,id:data.name,value:$scope.row[data.name]||0,setPriceChkEntry:setPriceChkEntry,setDateChkEntry:setDateChkEntry,hide:ishide,"backcolor":backcolor});
            }
        })

        $scope.ok = function(isValid) {
            angular.forEach($scope.columns,function(data){
                delete $scope.row[data.id];
                if(data.value>0){
                    $scope.row[data.id] = data.value;
                }
                $uibModalInstance.close($scope.row);
            })
        }
        $scope.setDateChkChange = function (item) {
            if(item.datechk == "Y"){
                item.pricechk = "Y";
            }
        }
        $scope.setPriceChkChange = function (item) {
            if(item.pricechk == "N"){
                item.datechk = "N";
            }
        }
        $scope.afterFieldregenTotal = function (name) {
            if($scope.row.regenTotal == undefined || $scope.row.regenTotal =="" || $scope.row.regenTotal ==null){
                return;
            }else{
                //所有的priceChk 都勾上，dateChk 只勾上T0,T1
                for(var i=0; i < $scope.columns.length; i++){
                    if($scope.columns[i].hide == false ){
                        $scope.columns[i].pricechk = "Y";
                        $scope.columns[i].datechk = "Y";
                        // if($scope.columns[i].id.match("T[01]")){
                        //     $scope.columns[i].datechk = "Y";
                        // }else{
                        //     $scope.columns[i].datechk = "N";
                        // }
                    }
                }
            }
        };
        $scope.regeneration = function(isValid){
            var l_yes1 = "N";
            var l_yes2 = "N";
            for(var i = 0; i < $scope.columns.length; i++) {
                //日期重排如果勾选上，那当天的金额一定要勾上纳入重排
                if ($scope.columns[i].datechk == "Y") {
                    $scope.columns[i].pricechk = "Y";
                    l_yes2 = "Y";
                }
                if ($scope.columns[i].pricechk == "Y") {
                    l_yes1 = "Y";
                }
            }
            if(l_yes1 == "N" || l_yes2 =="N"){
                $profile.error("至少勾选1笔资料");
                return;
            }
            $profile.confirm('确定','确定重排已选中的计划吗？',function() {
                if (isValid)
                    $profile.post('/trials/singlecardsimulation/scheduling/regeneration',{
                        head:$scope.row,columns:$scope.columns,reGenerationStatus:"1"
                    }).then(function (data) {
                        if (data.success) {
                            $profile.alter(data.message, function () {
                                // $profile.getRequest('/trials/singlecardsimulation/init').then(function(data){
                                //     $scope.colums = data.colums;
                                //     $scope.dataSource = data.dataSource;
                                //     $scope.total = data.total;
                                //     App.unblockUI('.page-content');
                                // })
                                $uibModalInstance.close('')
                            })
                        } else {
                            $profile.error(data.message)
                        }
                    })
            })
        }

    }])
