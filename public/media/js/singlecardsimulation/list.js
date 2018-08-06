var TableEditable = function () {

    return {
        //main function to initiate the module
        init: function () {
            function restoreRow(oTable, nRow) {
                var aData = oTable.fnGetData(nRow);
                var jqTds = $('>td', nRow);

                for (var i = 0, iLen = jqTds.length; i < iLen; i++) {
                    oTable.fnUpdate(aData[i], nRow, i, false);
                }

                oTable.fnDraw();
            }

            function editRow(oTable, nRow) {

                //var aData = oTable.fnGetData(nRow);
                //var jqTds = $('>td', nRow);
                //jqTds[0].innerHTML = '<input type="text" class="m-wrap small" value="' + aData[0] + '">';
                //jqTds[1].innerHTML = '<input type="text" class="m-wrap small" value="' + aData[1] + '">';
                //jqTds[2].innerHTML = '<input type="text" class="m-wrap small" value="' + aData[2] + '">';
                //jqTds[3].innerHTML = '<input type="text" class="m-wrap small" value="' + aData[3] + '">';
                //jqTds[4].innerHTML = '<a class="edit" href="">Save</a>';
                //jqTds[5].innerHTML = '<a class="cancel" href="">Cancel</a>';

            }

            function saveRow(oTable, nRow) {
                var jqInputs = $('input', nRow);
                oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
                oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
                oTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
                oTable.fnUpdate(jqInputs[3].value, nRow, 3, false);
                oTable.fnUpdate('<a class="edit" href="">Edit</a>', nRow, 4, false);
                oTable.fnUpdate('<a class="delete" href="">Delete</a>', nRow, 5, false);
                oTable.fnDraw();
            }

            function cancelEditRow(oTable, nRow) {
                var jqInputs = $('input', nRow);
                oTable.fnUpdate(jqInputs[0].value, nRow, 0, false);
                oTable.fnUpdate(jqInputs[1].value, nRow, 1, false);
                oTable.fnUpdate(jqInputs[2].value, nRow, 2, false);
                oTable.fnUpdate(jqInputs[3].value, nRow, 3, false);
                oTable.fnUpdate('<a class="edit" href="">Edit</a>', nRow, 4, false);
                oTable.fnDraw();
            }

           var  oTable = $('#sample_editable_1').dataTable({
                "aaSorting": [[ 0, "desc" ]],
                "aLengthMenu": [
                    [5,10, 15, 20],
                    [5, 10,15, 20] // change per page values here
                ],
                // set the initial value
                "iDisplayLength": 5,
                "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
                "sPaginationType": "bootstrap",
                "bProcessing": false,
                "bFilter": true,
                scrollX:true,

                //"sScrollX" : "100%",
                //"sScrollY":"400px",
                //"sScrollX": "10%",
                //"sScrollXInner": "110%",
                 //"sScrollYInner": "110%",
                //"bScrollCollapse": true,

                //"bJQueryUI" :true,
                //"bAutoWidth" :false,

                //fixedColumns:true,
                fixedColumns:   {
                			leftColumns: 1,
                			leftColumns: 2,
                			leftColumns: 3,
                			leftColumns: 4,
                			leftColumns: 5,
                			leftColumns: 6
                			//rightColumns: 1
                		},
                		footerCallback: function ( row, data, start, end, display ) {
                                   var api = this.api(), data;

                                               // Remove the formatting to get integer data for summation
                                               var intVal = function ( i ) {

                                                   return typeof i === 'string' ?
                                                       i.replace(/[\$,]/g, '')*1 :
                                                       typeof i === 'number' ?
                                                           i : 0;
                                               };

                                                for(var i=6;i<22;i++){
                                                        // Total over all pages
                                                                                                   total = api
                                                                                                       .column( i )
                                                                                                       .data()
                                                                                                       .reduce( function (a, b) {
                                                                                                           return intVal(a) + intVal(b);
                                                                                                       }, 0.00 );

                                                                                                   // Total over this page
                                                                                                   pageTotal = api
                                                                                                       .column( i, { page: 'current'} )
                                                                                                       .data()
                                                                                                       .reduce( function (a, b) {
                                                                                                           return intVal(a) + intVal(b);
                                                                                                       }, 0.00 );

                                                                                                   // Update footer
                                                                                                   $( api.column( i ).footer() ).html(
                                                                                                       //'$'+pageTotal +' ( $'+ total +' total)'
                                                                                                       pageTotal+'/'+total
                                                                                                   );
                                                }

                        },
                /*
                fixedColumns:   {
                            leftColumns: [0,1,2]
                            //rightColumns:
                        },*/
                //"search": "查询:",
               // "sAjaxSource": "/customers/display",
                "oLanguage": {
                    "sSearch": "查询:",
                    "sLengthMenu": "每页显示  _MENU_ 条记录",
                    "sInfo": "显示 _START_ 到 _END_ 条数据/共 _TOTAL_ 条数据",
                    "oPaginate": {
                        "sFirst": "首页",
                        "sPrevious": "前一页",
                        "sNext": "后一页",
                        "sLast": "尾页"
                    },
                    "sZeroRecords": "没有检索到数据",
                    "sInfoEmpty": "没有数据",
                    "sInfoFiltered": "(从 _MAX_ 条数据中检索)"
                },
                "aoColumnDefs": [{
                        'bSortable': true,
                        //'asSorting':'desc',
                        'aTargets': [0]
                    }
                ]
            });


           /* $('#sample_editable_1 tbody')
                   .on( 'mouseover', 'td', function () {

                       var colIdx = oTable.cell(this).index().column;
                       if ( colIdx !== lastIdx ) {
                           $( oTable.cells().nodes() ).removeClass( 'highlight' );
                           $( oTable.column( colIdx ).nodes() ).addClass( 'highlight' );
                       }

                       $("#mark-info").show();
                   } )
                   .on( 'mouseleave', function () {
                   $("#mark-info").hide();
                       $( oTable.cells().nodes() ).removeClass( 'highlight' );
            } );*/


            jQuery('#sample_editable_1_wrapper .dataTables_filter input').addClass("m-wrap medium"); // modify table search input
            jQuery('#sample_editable_1_wrapper .dataTables_length select').addClass("m-wrap small"); // modify table per page dropdown
            jQuery('#sample_editable_1_wrapper .dataTables_length select').select2({
                showSearchInput : false //hide search box with special css class
            }); // initialzie select2 dropdown

            var nEditing = null;
            $('#sample_editable_1_new').click(function (e) {
                e.preventDefault();
                var aiNew = oTable.fnAddData(['', '', '', '',
                        '<a class="edit" href="">Edit</a>', '<a class="cancel" data-mode="new" href="">Cancel</a>'
                ]);
                var nRow = oTable.fnGetNodes(aiNew[0]);
                editRow(oTable, nRow);
                nEditing = nRow;
            });

            $('#sample_editable_1 a.delete').live('click', function (e) {
                e.preventDefault();

                if (confirm("Are you sure to delete this row ?") == false) {
                    return;
                }

                var nRow = $(this).parents('tr')[0];
                oTable.fnDeleteRow(nRow);
                alert("Deleted! Do not forget to do some ajax to sync with backend :)");
            });

            $('#sample_editable_1 a.cancel').live('click', function (e) {
                e.preventDefault();
                if ($(this).attr("data-mode") == "new") {
                    var nRow = $(this).parents('tr')[0];
                    oTable.fnDeleteRow(nRow);
                } else {
                    restoreRow(oTable, nEditing);
                    nEditing = null;
                }
            });

            $('#sample_editable_1 a.edit').live('click', function (e) {
                e.preventDefault();

                /* Get the row as a parent of the link that was clicked on */
                var nRow = $(this).parents('tr')[0];

                if (nEditing !== null && nEditing != nRow) {
                    /* Currently editing - but not this row - restore the old before continuing to edit mode */
                    restoreRow(oTable, nEditing);
                    editRow(oTable, nRow);
                    nEditing = nRow;
                } else if (nEditing == nRow && this.innerHTML == "Save") {
                    /* Editing this row and want to save it */
                    saveRow(oTable, nEditing);
                    nEditing = null;
                    alert("Updated! Do not forget to do some ajax to sync with backend :)");
                } else {
                    /* No edit in progress - let's start one */
                    editRow(oTable, nRow);
                    nEditing = nRow;
                }
            });

            return oTable;
        }

    };

}();