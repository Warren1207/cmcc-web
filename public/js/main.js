angular.module("uib/template/modal/window-qp.html", []).run(["$templateCache", function($templateCache) {
    $templateCache.put("uib/template/modal/window-qp.html",
        "<div modal-render=\"{{$isRendered}}\" tabindex=\"-1\" role=\"dialog\" class=\"modal\"\n" +
        "    uib-modal-animation-class=\"fade\"\n" +
        "    modal-in-class=\"in\"\n" +
        "    ng-style=\"{'z-index': 1050 + index*10, display: 'block'}\">\n" +
        "    <div style=\"width: 80%;height: 100%\"  class=\"modal-dialog {{size ? 'modal-' + size : ''}}\"><div class=\"modal-content\" uib-modal-transclude></div></div>\n" +
        "</div>\n" +
        "");
}]);

var app = angular.module("app", [
    "ui.bootstrap", 
    "oc.lazyLoad",  
    "ngSanitize",
    'ui.load',
    'ui.select',
    'uix.select',
    'ui.utils',
    'jcs-autoValidate',
    'angularFileUpload',
    'lockingGrid',
    'ct.ui.router.extras.sticky',
    'uib/template/modal/window-qp.html'
]); 

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
app.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

//AngularJS v1.3.x workaround for old style controller declarition in HTML
app.config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

(function(a){
    app.constant('JQ_CONFIG', {
        easyPieChart: ['libs/jquery/jquery.easy-pie-chart/dist/jquery.easypiechart.fill.js'],
        dataTable: [
            'assets/global/plugins/datatables/css/dataTables.bootstrap.css',
            'assets/global/plugins/datatables/js/jquery.dataTables.js',
            'assets/global/plugins/datatables/js/dataTables.bootstrap.min.js',
            'assets/global/plugins/datatables/dataTables.plugins.js'
        ],
        fullcalendar:[
            'assets/global/plugins/moment.min.js',
            'assets/global/plugins/fullcalendar/fullcalendar.min.css',
            'assets/global/plugins/fullcalendar/fullcalendar.min.js',
        ],
        tree:[
            'assets/global/plugins/jstree/dist/themes/default/style.min.css',
            'assets/global/plugins/jstree/dist/jstree.min.js'
        ],
        superTables:[
            'css/repayment.plan.total.css',
            'js/scripts/superTables.js'
        ],
        mmgird : [
            'assets/global/plugins/mmGrid-master/src/mmGrid.css',
            'assets/global/plugins/mmGrid-master/src/mmPaginator.css',
            'assets/global/plugins/mmGrid-master/src/theme/bootstrap/mmGrid-bootstrap.css',
            'assets/global/plugins/mmGrid-master/src/theme/bootstrap/mmPaginator-bootstrap.css',
            'assets/global/plugins/mmGrid-master/src/mmGrid.js',
            'assets/global/plugins/mmGrid-master/src/mmPaginator.js'
        ],
        jqGrid : [
            'assets/global/plugins/jqgrid/css/ui.jqgrid.css',
            'assets/global/plugins/jqgrid/css/redmond/jquery-ui-1.8.16.custom.css',
            'assets/global/plugins/jqgrid/js/jquery.jqGrid.src.js',
            'assets/global/plugins/jqgrid/js/i18n/grid.locale-cn.js'
        ]
    })
})(jQuery)
/* Setup global settings */
app.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: '../assets',
        globalPath: '../assets/global',
        layoutPath: '../assets/layouts/layout',
    };
    $rootScope.settings = settings;
    return settings;
}]);

/* Setup App Main Controller */
app.controller('AppCtrl', ['$scope', '$window',
    function(              $scope,     $window ) {

        $scope.$on('$viewContentLoaded', function() {
            var isIE = !!navigator.userAgent.match(/MSIE/i);
            if(isIE){ angular.element($window.document.body).addClass('ie');}
            if(isSmartDevice( $window ) ){ angular.element($window.document.body).addClass('smart')};

            $scope.app = {
                name: 'Angulr',
                version: '2.2.0',
                // for chart colors
                color: {
                    primary: '#7266ba',
                    info:    '#23b7e5',
                    success: '#27c24c',
                    warning: '#fad733',
                    danger:  '#f05050',
                    light:   '#e8eff0',
                    dark:    '#3a3f51',
                    black:   '#1c2b36'
                },
                settings: {
                    themeID: 1,
                    navbarHeaderColor: 'bg-black',
                    navbarCollapseColor: 'bg-white-only',
                    asideColor: 'bg-black',
                    headerFixed: true,
                    asideFixed: false,
                    asideFolded: false,
                    asideDock: false,
                    container: false
                }
            };

            $scope.$watch('app.settings', function(){
                if( $scope.app.settings.asideDock  &&  $scope.app.settings.asideFixed ){
                    $scope.app.settings.headerFixed = true;
                }
                $scope.app.settings.container ? angular.element('html').addClass('bg') : angular.element('html').removeClass('bg');
            }, true);

            $scope.navLeftFn = function(){
                var left = $('.page-nav-ul-wl').scrollLeft();
                $('.page-nav-ul-wl').scrollLeft(left+100);
            };
            $scope.navRightFn = function(){
                var left = $('.page-nav-ul-wl').scrollLeft();
                if(left>0){
                    $('.page-nav-ul-wl').scrollLeft(left-100);
                }
            };

            function isSmartDevice( $window )
            {
                // Adapted from http://www.detectmobilebrowsers.com
                var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
                // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
                return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
            }
        });
    }
]);



/* Setup Layout Part - Header */
app.controller('HeaderController', ['$scope','$rootScope','$state','$compile', function($scope,$rootScope,$state,$compile) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });

    $scope.headerArray = $rootScope.headerArray;

    $rootScope.$watch('currentUrl',function(newValue,oldValue){
        $scope.currentUrl =newValue;
    });
    $rootScope.$watch('headerArray',function(newValue,oldValue){
        if(oldValue === undefined && newValue === undefined){
            $scope.headerArray = newValue?newValue:[];
        }else{
            $scope.headerArray = newValue;
            $scope.currentUrl = $rootScope.currentUrl;
            if( $scope.headerArray.length == 0 ){
                $state.go('desktop');
            }else{
                if($scope.currentUrl == 'columnList.detail' ||
                    $scope.currentUrl == 'columnList' ||
                    $scope.currentUrl == 'desktop'){
                    $state.go($scope.currentUrl);
                }else{
                    $state.go('desktop.'+$scope.currentUrl);
                }
            }
        }
    },true);

    $scope.selectTab = function(header){
        $rootScope.currentUrl = header.url;
        if(header.url == 'columnList.detail' ||
            header.url == 'columnList' ||
            header.url == 'desktop'){
            $state.go($scope.currentUrl);
        }else{
            $state.go('desktop.'+$scope.currentUrl);
        }
    };
    $scope.closeTab = function($event,header){
        $event.stopEventPropagation;
        for(var tab in $rootScope.headerArray){
            var headerTab = $rootScope.headerArray[tab];
            if(headerTab.id == header.id){
                var contentView = angular.element('.desktop-pagelist-ccms');
                if(contentView.length>0){
                    var childView = contentView.find('div[ui-view="'+headerTab.url+'"]');
                    childView.remove();
                }
                $rootScope.headerArray.splice(tab,1);
                if(tab-1 >=0) {
                    $rootScope.currentUrl = $rootScope.headerArray[tab - 1].url;
                    $rootScope.currentId = $rootScope.headerArray[tab-1].id;
                }else{
                    if($rootScope.headerArray.length > 0){
                        $rootScope.currentUrl = $rootScope.headerArray[0].url;
                        $rootScope.currentId = $rootScope.headerArray[0].id;
                    }
                }
                break;
            }
        }
        // $scope.headerArray = $rootScope.headerArray;
        // $state.go($rootScope.currentUrl);
    }
    var ul = angular.element('.page-nav-ul-wl');
    $compile(ul)($scope);
    var li = angular.element('<li class="page-nav-title-wl" ng-class="{true : \'active\',false : \'\'}[header.url == currentUrl]" ng-repeat="header in headerArray">\n' +
        '                        <span ng-click="selectTab(header)">{{header.text}} <i ng-click="closeTab($event,header)" class="fa fa-close cursor-wl"></i></span>\n' +
        '                    </li>');
    ul.append(li);
    $compile(li)($scope);
}]);

/* Setup Layout Part - Sidebar */
app.controller('SidebarController', ['$state', '$scope','$profile','$rootScope','$compile', function($state, $scope,$profile,$rootScope,$compile) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar($state); // init sidebar
    });
    $scope.hrefUrl = function(child){
        var contentView = angular.element('.desktop-pagelist-ccms');
        if(contentView.length>0){
            var childView = contentView.find('div[ui-view="'+child.url+'"]');
            if(childView.length == 0){
                var $el = $('<div ui-view="'+child.url+'" class="fade-in-up"></div>').appendTo('.desktop-pagelist-ccms');
                $compile($el)($scope);
            }
        }
        var hasin = false;
        $rootScope.headerArray = $rootScope.headerArray?$rootScope.headerArray:[];
        for(var tab in $rootScope.headerArray){
            if($rootScope.headerArray[tab].id == child.id){
                hasin = true;
                break;
            }
        }
        if(hasin){
            $rootScope.currentUrl = child.url;
            $rootScope.currentId = child.id;
            if(child.url == 'columnList.detail' ||
                child.url == 'columnList' ||
                child.url == 'desktop'){
                $state.go($rootScope.currentUrl);
            }else{
                $state.go('desktop.'+$rootScope.currentUrl);
            }
        }else {
            $rootScope.headerArray.push({
                text: child.text,
                url: child.url,
                id: child.id,
                pid: child.pid
            });
            $rootScope.currentId = child.id;
            $rootScope.currentUrl = child.url;
        }

    };
}]);

/* Setup Layout Part - Quick Sidebar */
app.controller('QuickSidebarController', ['$scope', function($scope) {    
    $scope.$on('$includeContentLoaded', function() {
       setTimeout(function(){
            QuickSidebar.init(); // init quick sidebar        
        }, 2000)
    });
}]);

/* Setup Layout Part - Theme Panel */
app.controller('ThemePanelController', ['$scope', function($scope) {    
    $scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
app.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);

app.service('$cs',['$http','$profile',function($http,$profile){
    this.install = function($rootScope){
        angular.profile = {}
        var components={
            url : function() {
                var url = [angular.profile.path];
                for(var s in arguments) url.push(arguments[s])
                return url.join('')
            }
        }
        angular.url = components.url
        for(var c in components) $rootScope[c] = components[c];
        $profile.post(angular.url('/basic/profile'),{}).then(function(data){
            $rootScope.profile = data.user || {};
            $rootScope.profile.currentDate = data.currentDate;
        })
        $profile.post(angular.url('/basic/menu'),{}).then(function(data){
            $rootScope.menus = data;
        })


    }
    this.getRouter = function() {
        alert('router')
    }
}]).factory('$profile',['$http','$uibModal','$q',function($http,$modal,$q){
    return {
        open: function(_url,ctrl,size,_action,_wt){
            size = size || 'lg'
            $(event.target).parent().prop('disabled',true);
            var config = {
                templateUrl: _url,
                controller: ctrl,
                backdrop:"static",
                size : size,
                keyboard:"false"
            };
            if(!!_wt) {
                config['windowTemplateUrl'] = 'uib/template/modal/window-qp.html';
            }
            if(!!_action){
                config.resolve = {
                    action : function() {
                        return _action
                    }
                }
            }
            $(event.target).parent().prop('disabled',false);
            return $modal.open(config);
        } ,
        alter:function(data,fun){
            swal({
                title : "系统提示",
                type:"success",
                text:data,
                timer:2000,
                showConfirmButton : false
            },function(){
                swal.close();
                fun && fun.apply();
            })
        },
        confirm : function(t,text,call) {
            swal({
                title: t,
                text: text,
                type: "warning",
                showCancelButton: true,
                confirmButtonText: "确定",
                confirmButtonClass: "btn-danger",
                cancelButtonText:"取消",
                cancelButtonClass:"btn-info",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
                },call);
        },
        error:function(data){
            swal("系统提示",data,"error");
        },
        convSelect2 : function(data,key) {
            var rs = {};
            angular.forEach(data, function(src) {
                var id = src[key];
                rs[id+""] = src;
            })
            return rs;
        },
        getRequest : function(url){
            var deferred = $q.defer();
            $http({method:'post',url:url})
                .success(function(data){deferred.resolve(data)})
                .error(function(data){deferred.reject(data)});
            return deferred.promise;
        },
        areaAddress : function(data,key1,key2) {
            var code=[];
            var name=[];
            $.each(data,function() {code.push(this[key1]);})
            $.each(data,function() {name.push(this[key2]);})
            return {code:code,name:name};
        },
        post:function(url,data){
            var deferred = $q.defer();
            $http({method:'post',url:url,data:data})
                .success(function(data){deferred.resolve(data)})
                .error(function(data){deferred.reject(data)});
            return deferred.promise;
        },
        postForm : function(url,data){
            var deferred = $q.defer();
            $http({
                method : 'POST',
                url  :url,
                data : $.param(data),
                headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function(data){deferred.resolve(data)})
                .error(function(data){deferred.reject(data)});
            return deferred.promise;
        },
        getProfile : function() {
            var deferred = $q.defer();
            $http({method:'post',url:'/basic/router'})
                .success(function(data){deferred.resolve(data)})
                .error(function(data){deferred.reject(data)});
            return deferred.promise;
        },
        exportExcel : function(url,data) {
            var aForExcel = $("<iframe></iframe>").attr("src",url);
            aForExcel.appendTo($('body'))
            aForExcel.remove();
        }
    }
}])

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
     $.ajax({
        type : "post",
        async : false,
        url : 'basic/router',
        data : { },
        contentType : "application/json; charset=utf-8",
        dataType : "json",
        cache : false,
        success : function (data) {
            var otherwise = data.otherwise ;
            $urlRouterProvider.otherwise(otherwise);
            $.each(data.router,function(){
                if(this.name == 'desktop' ||
                    this.name == 'columnList' ||
                    this.name == 'columnList.detail'){
                    var cfg = {
                        url :this.url,
                        stikcy:true,
                        dsr: true,
                        templateUrl : this.templateUrl
                    };
                    if(!!this.controller) {
                        cfg['controller'] = this.controller
                    }
                    if(!!this['resolve']){
                        cfg['resolve'] = load(this['resolve'])
                    }
                    $stateProvider.state(this.name,cfg)
                }else{
                    var cfg = {
                        url:this.url,
                        sticky: true,
                        views:{

                        }
                    };
                    cfg.views[this.name+"@desktop"] = {};
                    if(!!this.controller) {
                        cfg.views[this.name+"@desktop"]['controller'] = this.controller;
                        cfg.views[this.name+"@desktop"]['templateUrl'] = this.templateUrl;
                    }
                    if(!!this['resolve']){
                        cfg['resolve'] = load(this['resolve'])
                    }
                    $stateProvider.state('desktop.'+this.name,cfg)
                }
            })
        }
    });
    function load(srcs, callback) {
        return {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'uix.customer',
                    files: srcs
                });
            }]
        }
    }
}]).config(function($stickyStateProvider) {
    $stickyStateProvider.enableDebug(true);
});

app.run(["$rootScope", "settings", "$state",'$cs','defaultErrorMessageResolver', function($rootScope, settings, $state,$cs,defaultErrorMessageResolver) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
    $cs.install($rootScope);
    $rootScope.profile={
        active:0
    };
    $rootScope.profile.tabs = [
    ];
    $rootScope.hrefUrl=function(item){
        $state.go(item.url);
    };
    defaultErrorMessageResolver.setI18nFileRootPath('js/scripts');
    defaultErrorMessageResolver.setCulture('zh');
}]);
