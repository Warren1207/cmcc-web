angular.module('app').controller('HomepageController', function($rootScope, $scope,$location,$compile, $http, $timeout,$profile) {
    $scope.isDesktop = true;
    $scope.desktops = {};
    var url = $location.path();
    if( url == '/desktop/homepage'){
        $scope.isDesktop = true;
        $profile.getRequest("/desktop/params").then(function(data){
            $scope.desktops.owner=data.data.owner;
            $scope.desktops.card=data.data.card;
            $scope.desktops.repay=data.data.repay+"";
            $scope.desktops.pospay=data.data.pospay+"";
        })
    }else{
        $scope.isDesktop = false;
        var hideHeader =  function(){
            if($('.paget-desktop-content').length>0){
                $('.paget-desktop-content').hide();
                $('.paget-desktop-title').hide();
            }else{
                setTimeout(hideHeader,100);
            }
        };
        hideHeader();
        var tabView = url.replace('/desktop/','');
        var contentView = angular.element('.desktop-pagelist-ccms');
        if(contentView.length>0){
            var childView = contentView.find('div[ui-view="'+tabView+'"]');
            if(childView.length == 0){
                var $el = $('<div ui-view="'+tabView+'" class="fade-in-up"></div>').appendTo('.desktop-pagelist-ccms');
                $compile($el)($scope);
            }
        }
    }

    $rootScope.$watch('currentUrl',function(newValue,oldValue){
        if( newValue && newValue!='desktop'){
            $scope.isDesktop = false;
            $('.desktop-pagelist-ccms').find('div[ui-view]').hide();
            $('.desktop-pagelist-ccms').find('div[ui-view="'+newValue+'"]').show();
        }else{
            $scope.isDesktop = true;
        }
    });


});