angular.module('app').controller('ReportController',
    ['$rootScope', '$scope','$uibModal','$location','$profile',function($rootScope, $scope,$modal,$location,$profile) {
        $scope.$on('$viewContentLoaded', function() {

            $scope.initTable = function(a){
                var fixed2 = function(val){
                    if(typeof val != 'number'){
                        return '';
                    }
                    return val.toFixed(2);
                }

                var sFn = function(et,val) {
                    if(et){  //如果上一个存在
                        return '<button type="button" class="btn red btn-block table-env-btn" >'+val+'</button>'
                    }else if(et==void 0 && val != void 0){
                        return '<button type="button" class="btn blue btn-block" disabled>'+val+'</button>'
                    }else if(et===!1){
                        return '<button type="button" class="btn default btn-block" disabled>'+val+'</button>'
                    }
                }

                $(a).delegate('.table-env-btn','click',function() {
                    $profile.open('/customers/selected','SelectedOwnerCtrl').result.then(function(selectValue){
                        $scope.card.owner = selectValue.name;
                        $scope.card.customerId = selectValue.id;
                        $scope.card.returnRate = selectValue.returnRate;
                        $scope.card.maxSingleRepaymentRate = selectValue.maxSingleRepaymentRate+ "";
                    })
                })

                var mmg = $(a).mmGrid({
                    height: 800,
                    cols:  [
                        { title:'姓名', name:'owner' ,width:150, align:'center',  sortable: true,lockDisplay:true,lockWidth:true},
                        { title:'银行', name:'bankName' ,width:150, align:'center',  sortable: true},
                        { title:'卡号', name:'card_no' ,width:150, align:'center',  sortable: true},
                        { title:'还款金额', name:'amount' ,width:80, align:'center', sortable: true, type: 'number', renderer: fixed2},
                        {title:'存款明细',align: 'center', cols:[
                            { title:'1', name:'T1' ,width:100, sortable: true, align:'center',renderer:function(val,data){
                                    var et = data['ET1'];
                                    return sFn(et,val);
                                }
                            },
                            { title:'2', name:'T2' ,width:100, sortable: true, align:'center' ,renderer:function(val,data){
                                var et = data['ET2'];
                                return sFn(et,val);
                            }
                            },
                            { title:'3', name:'T3' ,width:100, sortable: true, align:'center' ,renderer:function(val,data){
                                var et = data['ET3'];
                                return sFn(et,val);
                            } },
                            { title:'4', name:'T4' ,width:100, sortable: true, align:'center',renderer:function(val,data){
                                var et = data['ET4'];
                                return sFn(et,val);
                            } },
                            { title:'5', name:'T5' ,width:100, sortable: true, align:'center' ,renderer:function(val,data){
                                var et = data['ET5'];
                                return sFn(et,val);
                            }}
                        ]},
                        { title:'存款总和', name:'T0' ,width:80, align:'center', sortable: true, type: 'number', renderer: fixed2},
                        {title:'消费明细',align: 'center', cols:[
                            { title:'1', name:'S1' ,width:100, sortable: true, align:'center'  ,renderer:function(val,data){
                                var et = data['ES1'];
                                return sFn(et,val);
                            }},
                            { title:'2', name:'S2' ,width:100, sortable: true, align:'center',renderer:function(val,data){
                                var et = data['ES2'];
                                return sFn(et,val);
                            } },
                            { title:'3', name:'S3' ,width:100, sortable: true, align:'center' ,renderer:function(val,data){
                                var et = data['ES3'];
                                return sFn(et,val);
                            } },
                            { title:'4', name:'S4' ,width:100, sortable: true, align:'center' ,renderer:function(val,data){
                                var et = data['ES4'];
                                return sFn(et,val);
                            }  },
                            { title:'5', name:'S5' ,width:100, sortable: true, align:'center',renderer:function(val,data){
                                var et = data['ES5'];
                                return sFn(et,val);
                            }   }
                        ]},
                        { title:'消费总和', name:'S0' ,width:80, align:'center', sortable: true, type: 'number', renderer: fixed2},
                        { title:'差额', name:'' ,width:80, align:'center', sortable: true},
                        { title:'备注', name:'' ,width:80, align:'center', sortable: true}
                    ]
                    , url: '/operation/list/sh'
                    , method: 'post'
                });
            }
        });

    }]);


app.controller("SelectedOwnerCtrl",['$scope','$http','$uibModalInstance',
    function($scope,$http,$uibModalInstance ) {
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.roles = [];
        $scope.tableConfig ={
            ajax:{
                url : '/customers/list'
            },
            formPanel: [
                {name: "name", text: "姓名", type: 'text', size: 4},
                {name: "mobile", text: "手机", type: 'text', size: 4},
                {name: "wxNo", text: "微信", type: 'text', size: 4}
            ],
            aoColumns: [
                { mData:null,mRender : function(a,b,c){
                    return c['name']||''
                } },
                { mData:null,mRender : function(a,b,c){
                    return c['alias']||''
                } },
                { mData:null,mRender : function(a,b,c){
                    return c['idCardNo']||''
                } },
                { mData:null,mRender : function(a,b,c){
                    return c['wxNo']||''
                } },
                { mData:null,mRender : function(a,b,c){
                    return c['mobile']||''
                } }
            ],
            scope : $scope,
            dblclick : function(tr,data,tbl,scope) {
                $uibModalInstance.close(data);
            }

        }
    }])
