angular.module('app').controller('WorkcalendarController',
    ['$rootScope', '$scope','$uibModal','$profile',function($rootScope, $scope,$modal,$profile) {
        $scope.$on('$viewContentLoaded', function() {
            $scope.fullcalendar = function(a){
                if (!jQuery().fullCalendar) {
                    return;
                }
                var date = new Date();
                var d = date.getDate();
                var m = date.getMonth();
                var y = date.getFullYear(); 
                var h = {};
                var $el = $(a)

                $el.removeClass("mobile");
                h = {
                    left: 'title',
                    center: 'asdf',
                    right: 'prev,next'
                };

                $el.fullCalendar('destroy'); // destroy the calendar
                $el.fullCalendar({ //re-initialize the calendar
                    disableDragging: false,
                    header: h,
                    editable: false,
                    firstDay:1,
                    monthNames: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
                    monthNamesShort: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
                    dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
                    events: function (start,end,timezone,callback) {
                        var y=start.year();
                        var m=start.month();
                        var d=start.date()
                        var url = ['/workcalendar/data?y=',y,'&m=',m,'&d=',d].join('')
                        $.ajax({
                            url: url,
                            dataType: 'json',
                            data: {},
                            success:function(data) {
                                callback(data);
                            }
                        });
                    },
                    select :function( startDate, endDate, allDay, jsEvent, view ){
                        var clickDate = view.calendar.formatDate(date,'yyyy-MM-dd');
                        console.info(clickDate);

                    },
                    year:y,
                    month:m,
                    dayClick: function(date, jsEvent, view) {
                        var y=date.year();
                        var m=date.month()+1;
                        var d=date.date()
                        $.post("/workcalendar/save",{year:y,month:m,day:d},function(result){
                            $el.fullCalendar('refetchEvents');
                        });

                    }
                });
            }
        });

    }]);

