angular.module('app').controller('RegionController',
    ['$rootScope', '$scope','$uibModal','$location','$profile',function($rootScope, $scope,$modal,$location,$profile) {
        $scope.$on('$viewContentLoaded', function() {
            $scope.tree = function(a){
                var tree = $(a).on('changed.jstree', function (e, data) {
                    var i, j, r = [];
                    for(i = 0, j = data.selected.length; i < j; i++) {
                        node = data.instance.get_node(data.selected[i]);
                    }
                })
                    .jstree({
                        "core" : {
                            "themes" : {
                                "responsive": false
                            },
                            // so that create works
                            "check_callback" : true,
                            'data' : {
                                'url' : function (node) {
                                    return '/sysparameters/region/node';
                                },
                                'data' : function (node) {
                                    return { 'parent' : node.id };
                                }
                            }
                        },
                        "state" : { "key" : "demo2" },
                        "plugins" : [ "contextmenu", "dnd", "state", "types" ],
                        "contextmenu": {
                            "items": {
                                "create": null,
                                "remove": null,
                                "ccp": null,
                                "add": {
                                    "label": "添加",
                                    "action": function (data) {
                                        var inst = $.jstree.reference(data.reference),
                                            obj = inst.get_node(data.reference);
                                        inst.create_node(obj, {type: "file"}, "last", function (new_node) {
                                            setTimeout(function () {
                                                inst.edit(new_node);
                                            }, 0);
                                        });
                                    }
                                },
                                "rename": {
                                    "label": "修改",
                                    "action": function (data) {
                                        var inst = $.jstree.reference(data.reference),
                                            obj = inst.get_node(data.reference);
                                        inst.edit(obj);
                                    }
                                },
                                "delete": {
                                    "label": "删除",
                                    "action": function (data) {
                                        var inst = jQuery.jstree.reference(data.reference),
                                            obj = inst.get_node(data.reference);
                                        if(confirm("确定删除吗？")){
                                            $("#tree").jstree("refresh");
                                            $.post("/sysparameters/region/node/remove/"+obj.id , {},function(d){
                                                if(d['success']){
                                                    //alert('删除成功。')
                                                    tree.jstree(true).refresh();
                                                }
                                            },'json')
                                        }
                                    }
                                }
                            }
                        }

                    }).bind('rename_node.jstree', function (e, data) {
                        if(!isNaN(data.node.id)){
                            $.post("/sysparameters/region/node/edit", {
                                'id': data.node.id,
                                'name': data.node.text
                            }, function (d) {
                                if (d['success']) {
                                    //alert('修改成功。')
                                    tree.jstree(true).refresh();
                                } else {
                                    //alert("修改失败。")
                                }
                            }, 'json')
                        }else {
                            $.post("/sysparameters/region/node/save", {
                                'id': data.node.parent,
                                'name': data.node.text
                            }, function (d) {
                                if (d['success']) {
                                    //alert('添加成功。')
                                    tree.jstree(true).refresh();
                                } else {
                                    //alert("添加失败。")
                                }
                            }, 'json')
                        }
                    })
            }
        });

    }]);
