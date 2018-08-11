(function( factory ){
    if ( typeof define === 'function' && define.amd ) {
        // AMD
        define( ['jquery', 'datatables.net'], function ( $ ) {
            return factory( $, window, document );
        } );
    }
    else if ( typeof exports === 'object' ) {
        // CommonJS
        module.exports = function (root, $) {
            if ( ! root ) {
                root = window;
            }
            if ( ! $ || ! $.fn.dataTable ) {
                $ = require('datatables.net')(root, $).$;
            }
            return factory( $, root, root.document );
        };
    }
    else {
        // Browser
        factory( jQuery, window, document );
    }
}(function( $, window, document, undefined ) {
    'use strict';
    var DataTable = $.fn.dataTable;
    $.extend( true, DataTable.defaults, {
        dom:
        "<'row'F>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-3'i><'col-sm-3'l><'col-sm-6'p>>",
        'ordering': false,
        "order": [
            [1, "asc"]
        ],
        "orderCellsTop": true,
        "columnDefs": [{ // define columns sorting options(by default all columns are sortable extept the first checkbox column)
            'orderable': false,
            'targets': [0]
        }],
        'serverSide': true,
        'bAutoWidth': false,
        'deferRender':    true,
        'scroller':       true,
        'scrollX':        true,
        'scrollCollapse': true,
        "fnCreatedRow": function (nRow, aData, iDataIndex) {
            $(nRow).click(function () {
                if ($(this).hasClass('st-selected')) {
                    $(this).removeClass('st-selected');
                } else {
                    $(this).parent().find('.st-selected').removeClass('st-selected');
                    $(this).addClass('st-selected');
                }
            });
        },
        "ajax": { // define ajax settings
            "url": '', // ajax URL
            "type": "POST", // request type
            "timeout": 20000,
            "data": function(data) { // add request parameters before submit
                // $.each(ajaxParams, function(key, value) {
                //     data[key] = value;
                // });
                var offset = 0,limit = 10;
                data['page'] = data['start'] /data['length'];
                data['size'] = data['length'];
                delete data['columns'];
                delete data['start'];
                delete data['length'];
                if($('.page-header-container:visible').length>0){
                    for(var att in data){
                        if( att == 'search' || att == 'page'  || att == 'size'  || att == 'draw'  || att == 'order'){
                            continue;
                        }else{
                            data[att] = $('.page-header-container:visible [name='+att+']').val();
                        }
                    }
                }
                App.blockUI({
                    message: '数据加载中...',
                    target: 'body',
                    overlayColor: 'none',
                    cenrerY: true,
                    boxed: true
                });
            },
            "dataSrc": function(res) { // Manipulate the data returned from the server
                if (res.customActionMessage) {
                    App.alert({
                        type: (res.customActionStatus == 'OK' ? 'success' : 'danger'),
                        icon: (res.customActionStatus == 'OK' ? 'check' : 'warning'),
                        message: res.customActionMessage,
                        container: tableWrapper,
                        place: 'prepend'
                    });
                }
                if (res.customActionStatus) {
                    if (tableOptions.resetGroupActionInputOnSuccess) {
                        $('.table-group-action-input', tableWrapper).val("");
                    }
                }
                App.unblockUI('body');
                return res.rows;
            },
            "error": function() {
                swal("系统提示","链接错误.请重试.","error");
                App.unblockUI('body');
            }
        },
        'oLanguage':{
            "sLengthMenu": "每页显示 _MENU_条",
            'sInfo': '当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录。',
            'sEmptyTable':'当前没有数据',
            'sInfoEmpty':'',
            'oPaginate': {
                'sFirst': '首页',
                'sPrevious': ' 上一页 ',
                'sNext': ' 下一页 ',
                'sLast': ' 尾页 '
            }
        }
    } );

    var DataTablesEx = function(settings,dt,config){
        var $this = this;
        if(!!settings['oInit'] ['scope'] ){
            settings.oInit.scope.table = dt;
        }
        this.dt = dt;
        this.table_params = [];
        this.pushParams = function(n,v){
            this.table_params.push(n)
        }
        this.init(dt,config);
        settings['aoServerParams']= [{
                "fn": function(d){
                    $.each($this.table_params,function(){
                        d[this] = $this.container().find('.form-control[name='+this+']').val()
                    })
                },
                "sName": 'user'
            }]
    }

    /**
     *
     */
    $.extend( DataTablesEx.prototype, {
        init : function(dt, config ){
            if ( config === true ) {
                config = {};
            }
            this.api = dt;
            this.c = $.extend( true, {}, {}, config );//<div class="form-inline">
/*            var $el = $('<div class="col-sm-12"> <div class="portlet light bordered">\
                <div class="portlet-title">\
                    <div class="caption font-green-sharp"><span class="caption-subject bold uppercase">查询</span></div>\
                        <div class="tools">\
                            <a  class="collapse"> </a>\
                        </div>\
                    </div>\
                 <div class="portlet-body"><div class="row"><div class="form-inline"></div></div></div>\
                </div></div>');*/
            var $el = $('<div class="row"><div class="form-inline"></div></div>');
            this.dom = {
                container: $el
            };
            this._constructor();
            return this;
        },
        container: function (){
            return this.dom.container;
        },
        _template : function(t,o){
            return t.replace(/\\?\{([^{}]+)\}/g, function (match, name) {
                return (o[name] === undefined) ? '' : o[name];
            });
        },
        _formType : function (d){
            if(d['type']==='text'){
                var i = '<input type="text" class="form-control" placeholder="{text}" name="{name}" value="{value}" style="width: 100%;">'
                var h = '<div class="input-group">' + i +  '' +
                    '<span class="input-group-btn">\
                        <button class="btn btn-default btn-table-search" type="button">立即查询</button>\
                        </span>\
                    </div>'
                return this._template(this.formItemCnt == 1 ? h : i,d);
            }else  if(d['type']==='date'){
                return this._template('<input type="text" data-date-format="yyyy-mm-dd" data-date-zIndexOffset="100" data-date-pickerPosition="bottom-left" data-provide="datepicker" class="form-control" placeholder="{text}" name="{name}" style="width: 100%;">',d);
            }else if(d['type']==='select'){
                var _html = [];
                _html.push('<select class="form-control" name="{name}" style="width: 100%;">')
                _html.push("<option value=''>{text}</option>")
                if($.isArray(d['data'])){
                    $.each(d['data'],function(){
                        _html.push('<option value="'+this.key+'">')
                        _html.push(this.value)
                        _html.push('</option>')
                    })
                }
                _html.push('</select>')
                return this._template(_html.join(''),d)
            } else  if(d['type']==='auto'){
                return $(d['target']);
            }
        },
        _constructor : function(){
            var $this = this;
            var dt = $this.dt;
            $this._showSearchBtn();
            $this.api.getSelected = function() {
                var _data = $this.api.rows('.st-selected').data() ;
                return _data;
            }
            if($this.formItemCnt>0){
                this.$form = this.container().find('.form-inline');
                var tmp='<div class="{col}" style="margin-bottom:10px;">\
                <div class="col-sm-12">{context}</div>\
                </div>';
                $.each(this.c,function(i){
                    if(this.type=='hide'){
                        var h = '<input type="hidden" class="form-control" value="'+this.value+'" placeholder="" name="'+this.name+'" style="width: 100%;">'
                        $this.$form.append(h)
                    }else {
                        var data = {
                            text: this.text,
                            context: $this._formType(this),
                            size: ['col-sm-', this.size || 4].join('')
                        }
                        //$this._template(tmp,data())

                        if(this.type==='auto'){
                            $this.$form.append($(this.target))
                        }else{
                            $this.$form.append($this._formItemHtml(data))
                        }
                    }
                    $this.pushParams(this.name)
                })
                $this.api.form = $this.$form;

                if($this.showSearchButton) {
                    var $btn_htm = $('<div class="col-sm-3" style="margin-bottom:10px;text-align: center;"> <button class="btn btn-default btn-table-search">立即查询</button> </div>');
                    $this.$form.append($btn_htm)
                }
                this._searchTableEvent();
            }

            var table = $( dt.table().node() );

            $('.group-checkable', table).change(function() {
                var set = table.find('tbody > tr > td:nth-child(1) input[type="checkbox"]');
                var checked = $(this).prop("checked");
                var cfg = $this.api.init();
                var data = $this.api.data();
                var values = [];
                $(set).each(function() {
                    var index = $(this).parent().parent().index();
                    values.push(data[index]);
                    $(this).prop("checked", checked);
                });

                cfg.selected && cfg.selected.apply(this,[this,$this.api,cfg.scope,values])
            });

            $( dt.table().body() ).on( 'click.actions', 'th,tr', function () {
                var cfg = $this.api.init();
                var index = $(this).index();
                var data= $this.api.data()[index];
                cfg.click && cfg.click.apply(this,[this,data,$this.api,cfg.scope])
            }).on( 'dblclick.actions', 'th,tr', function () {
                var cfg = $this.api.init();
                var index = $(this).index();
                var data= $this.api.data()[index];
                cfg.dblclick && cfg.dblclick.apply(this,[this,data,$this.api,cfg.scope])
            });

            $( dt.table().body() ).on( 'click.actions', 'th, td [data-action]', function () {
                var d = $(this).data();
                var cfg = $this.api.init();
                var action = [d['action'],'_action'].join('');
                if(action in cfg)
                    cfg[action].apply(this,[d,dt])
            } );

            dt.on( 'destroy.actions', function () {
                dt.off( '.actions' );
                $( dt.table().body() ).off( 'click.actions', 'th, td [data-action]' );
                $( document.body ).off( 'click.[data-action]' );
            } );
        },
        _searchTableEvent :function() {
            var $this = this;
            /** modify by Warren Lee 2018-08-08 **/
            var queryDom = $('.page-header-wl');
            if(queryDom.length>0){
                $(document).on('click','.page-header-wl button.btn-table-search',function(){
                    $this._searchTableAction(); // 刷新表格数据，分页信息不会重置
                });
            }
            /** modify by Warren Lee 2018-08-08 **/
            this.$form.find('button.btn-table-search').click(function () {
                $this._searchTableAction(); // 刷新表格数据，分页信息不会重置
            });
            $this.$form.keydown(function(e){
                if(e.keyCode==13){
                    $this._searchTableAction();
                }
            });
        },
        _searchTableAction : function(){
            this.api.draw();
        },
        _formItemHtml: function(d) {
            var htm = '<div class="{size}" style="margin-bottom:10px;"><label class="col-lg-3 control-label" style="line-height: 34px;">{text}</label>\
                <div class="col-lg-9">{context}</div>\
                </div>';
            return this._template(htm,d)
        },
        _showSearchBtn : function() {
            var cfg = this.dt.init();
            this.formItemCnt = 0;
            if(!!cfg.formPanel){
                var cnt = 0;
                $.each(cfg.formPanel,function(i){
                    if(this.type!='hide'){
                        cnt++;
                    }
                })
                this.formItemCnt = cnt
            }
            this.showSearchButton = this.formItemCnt==1 ? false : this.formItemCnt>1 || cfg['showSearchButton'];  // 显示按钮
        }
    });

    $.fn.dataTable.dtEx = DataTablesEx;
    $.fn.DataTable.dtEx = DataTablesEx;

    DataTable.ext.feature.push( {
        fnInit: function( settings ) {
            //var fp = new FormPanel( settings )
            var api = new DataTable.Api( settings );
            var opts = api.init().formPanel  || DataTable.defaults.formPanel ;
            return new DataTablesEx(settings,api, opts).container();
        },
        cFeature: "F"
    } );

    return DataTablesEx;
}));