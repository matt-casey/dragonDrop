'use strict';

/* Directives */


angular.module('projectManager.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
}]).directive('mcShow', function () {
        return {
            link: function(scope, element, attrs) {
                var setUp  = false;
                var showAnimation;
                var hideAnimation;
                var delay;

                function removeCSS(remove) {
                    element.removeClass(remove);
                }

                function addCSS(add) {
                    element.addClass(add);
                }

                function show(){
                    addCSS(showAnimation);
                    element.show();
                    setTimeout(function() {
                        removeCSS(showAnimation);
                    }, 100);
                }

                function hide(){
                    addCSS(hideAnimation);
                    setTimeout(function() {
                        element.hide();
                        removeCSS(hideAnimation);
                    }, delay);
                }

                scope.$watch(attrs.mcShow, function(newVal, oldVal){
                    showAnimation = attrs.showAnimation;
                    hideAnimation = attrs.hideAnimation;
                    delay = attrs.delay;
                    if (!setUp){
                        if(newVal === false){
                            element.hide();
                        }
                    }
                    if (newVal === true && !setUp && attrs.startOn){
                        setUp = true;
                    }
                    else if (newVal === true){
                        setUp = true;
                        show();
                    }
                    else if (newVal === false){
                        setUp = true;
                        hide();
                    }
                });
            }
        };
}).directive('mcTap', function() {
          return function(scope, element, attrs) {
            var touchEnabled = false;
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
                //alert('ipad');
                element.bind('touchstart', function() {
                    touchEnabled = true;
                    scope.$apply(attrs['mcTap']);
                });

                element.bind('click', function() {
                    if (!touchEnabled){
                        scope.$apply(attrs['mcTap']);
                    }
                    else{
                        touchEnabled = false;
                    }
                });
            }
            else{
                element.bind('click', function() {
                    if (!touchEnabled){
                        scope.$apply(attrs['mcTap']);
                    }
                    else{
                        touchEnabled = false;
                    }
                });
            }
        };
}).directive('mcDraggable', function(){
      return {
        restrict: "A",
        link: function(scope, element, attrs) {
            var X = 0;
            var Y = 0;
            var touchX = 0;
            var touchX0 = 0;
            var touchY = 0;
            var touchY0 = 0;
            var offsetX = 0;
            var offsetY = 0;


            var dropZones = $(".target");
            var dropCoordinates = [];
            var currentTarget;

            function setDropCoordinates(){
                var counter = 0;
                dropZones.each(function(){
                    dropCoordinates[counter] = $(this).position();
                    dropCoordinates[counter].right = dropCoordinates[counter].left + $(this).width();
                    counter ++;
                });
                //console.log(dropCoordinates);
            }
            setDropCoordinates();


            //element.hover(
            //    function(){
            //        console.log('in');
            //        element.css("color", "blue");
            //    },
            //    function(){
            //        $(this).css("color", "black");
            //        console.log('out');
            //    }
            //);

            element.on('touchstart', function(e) {
                //element.css("color", "red");
                //element.css("-webkit-transform", "translate3d(20px, 0,0)");
                e.preventDefault();
                element.removeClass('transition');
                var touchEvent = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                touchX0 = touchX = touchEvent.pageX;
                touchY0 = touchY = touchEvent.pageY;
                //scope.position0 = scope.position;

                //console.log(scope.position);
                //console.log(scope.position0);
            });
              //drag button
            element.on('touchmove', function(e) {
                //element.css("color", "green");
                e.preventDefault();
                var touchEvent = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                touchX = touchEvent.pageX;
                touchY = touchEvent.pageY;
                X = offsetX + touchX - touchX0;
                Y = offsetY + touchY - touchY0;
               // scope.allowMovement = scope.setAllowMovement(scope.X);
                element.css("-webkit-transform", "translate3d(" + X + "px, " + Y + "px,0)");
                element.css("z-index", "1000");
                for (var i in dropCoordinates){
                    if (touchX > dropCoordinates[i].left && touchX < dropCoordinates[i].right){
                        currentTarget = dropZones.eq(i).attr('id');
                        dropZones.eq(i).addClass("testSelect");
                    }
                    else {
                        //console.log( touchX + " " + dropCoordinates[i].left);
                        dropZones.eq(i).removeClass("testSelect");
                    }
                }
                //move();
            });
              //release button
            element.on('touchend', function(e) {
                e.preventDefault();
                element.addClass('transition');
                element.css("z-index", "10");
                element.css("-webkit-transform", "translate3d( 0, 0, 0)");
                $(".target").removeClass("testSelect");
                if (Math.abs(X) < 8){
                    //console.log('tap');
                    scope.$apply(attrs['mcDraggable']);
                    //  element.appendTo('#testBucket2');
                    // tapTo(touchX0);
                }
                else{
                    scope.$apply(scope.d.moveProject(scope.project.id, currentTarget));
                    //scope.$apply(attrs['moveProject']);
                   // toNearest();
                }
                offsetX = 0;//X;
                offsetY = 0;//Y;
                X = touchX0 = touchX = 0;
                Y = touchY0 = touchY = 0;
            });
        }
      };
}).directive('mcChart', function ($compile) {
        return {
            restrict: 'E',
            replace : true,
            transclude: true,
            scope:{
                data: '=',
                overlayData: '=',
                type: '@'
            },
            template:
            '<div class="mcChartArea">' +

                '<script type=text/ng-template id=stacked.html>' +
                    '<div class="column" style="height: {{columnHeight(getValue(serie))}}%" >'+
                        //'<div class="spacer animate" style="height:{{100-columnHeight(getValue(serie))}}%"></div>' +
                        '<div class="columnSegment animate colorSegment" ng-repeat="value in serie.values" style="height:{{segmentHeight(value, $parent.serie)}}%"></div>'+
                    '</div>' +
                    '<div class="serieLabel">{{serie.id}}</div>'+
                '</script>' +

                    '<div class="yaxis" >'+
                        //'<div class="spacer animate" style="height:{{100-columnHeight(getValue(serie))}}%"></div>' +
                        '<div class="" ng-repeat="tick in setTicks()" style="height:{{columnHeight(tick)}}%">{{getExtremes()[1] - $index}} -</div>'+
                    '</div>' +
                '<div class="serie" style="width:{{100/data.series.length}}%; left:{{($index)*100/data.series.length}}%;" ng-repeat="serie in data.series" ng-include="type + &#39;.html&#39;"></div>'+
            '</div>',
            controller: function($scope, $attrs, $element){
                $scope.elementHeight = $element.height();
                $scope.elementWidth = $element.width();
                $scope.extremes = [0,0];
                //$scope.noAggExtremes = [0,0];

                $scope.getExtremes = function(){
                    $scope.extremes = [0,0];
                   // if ($scope.extremes[0] == 0 && $scope.extremes[1] == 0){
                        for (var i in $scope.data.series){
                            var temp = $scope.getValue($scope.data.series[i]);
                            if( temp < $scope.extremes[0]){
                                $scope.extremes[0] = temp;
                            }
                            if( temp > $scope.extremes[1]){
                                $scope.extremes[1] = temp;
                            }
                        }
                    return $scope.extremes;
                }



                $scope.getValue = function(series){
                    var total = 0;
                    for (var i in series.values){
                        total = total + parseFloat(series.values[i]);
                    }
                    return total;
                }

            //column functions

                $scope.segmentHeight = function(value, series){
                    var testVal = 100*value/$scope.getValue(series);
                    if (!testVal){
                        return "0; display: none; top: 0";
                    }
                    return testVal;
                }

                $scope.columnHeight = function(value){
                    var ext = $scope.getExtremes();
                    return 80*parseFloat(value)/(ext[1] - ext[0]);
                }

            //line graph functions
                $scope.getExtremesNoAgg = function(){
                    $scope.extremes = [0,0];
                   // if ($scope.extremes[0] == 0 && $scope.extremes[1] == 0){
                        for (var i in $scope.data.series){
                            for (var j in $scope.data.series[i].values){
                                var temp = $scope.data.series[i].values[j];
                                if( temp < $scope.extremes[0]){
                                    $scope.extremes[0] = temp;
                                }
                                if( temp > $scope.extremes[1]){
                                    $scope.extremes[1] = temp;
                                }
                            }
                        }
                  // }
                    return $scope.extremes;
                }

                $scope.notLast = function(ind){
                    alert(ind);
                    return true;
                }

                $scope.getDifferences = function(serieInd, valueInd, data, overlayData){
                    var y = 0;
                    var currentVal = data.series[serieInd].values[valueInd];
                    var nextVal = data.series[serieInd+1].values[valueInd];
                    if (overlayData){
                        y = 0.80*$scope.elementHeight * (nextVal-currentVal)/$scope.getExtremes()[1];
                    }
                    else{
                        y = 0.80*$scope.elementHeight * (nextVal-currentVal)/$scope.getExtremesNoAgg()[1]; 
                    }

                    var x = $scope.elementWidth / data.series.length;
                    //alert($element.offsetWidth);
                    return [y,x];
                }

                $scope.ticks = [];
                $scope.setTicks = function(){
                    for(var i = 0; i < $scope.getExtremes()[1]; i++){
                        $scope.ticks[i] = 1;
                    }
                    //console.log($scope.ticks.length);
                    return ($scope.ticks);
                }
                //$scope.setTicks();

            },
            link: function(scope, element, attrs) {
                
            }
        };
    }).directive('mcGantt', function () {
        return {
            restrict: 'E',
            replace : true,
            scope:{

            },
            templateUrl: 'partials/directives/mcGanttKinectic.html',
            controller: function($scope, $attrs, $element, data){
                $scope.d = data;

                //zoom is number of pixels per week
                $scope.zoom = 8;

                $scope.isSelected = function(dataItem){
                    return ($scope.d.isCatSelected(dataItem.category) && $scope.d.isSegSelected(dataItem.segment));
                }

                $scope.zoomInMaxed = false;
                $scope.zoomOutMaxed = false;
                $scope.zoomIn = function(){
                    if ($scope.zoom < 64){
                        $scope.zoom = $scope.zoom * 2;
                        $scope.zoomOutMaxed = false;
                    }
                    if ($scope.zoom == 64) {
                        $scope.zoomInMaxed = true;
                        //console.log($scope.zoom);
                    }
                }

                $scope.zoomOut = function(){
                    if ($scope.zoom > 2){
                        $scope.zoom = $scope.zoom / 2;
                        $scope.zoomInMaxed = false;
                    }
                    if ($scope.zoom == 2) {
                        $scope.zoomOutMaxed = true;
                        //console.log($scope.zoom);
                    }
                }

                $scope.barWidth = function(){
                    //if ((100 * $scope.zoom / 8) > 100){
                        return 100 * $scope.zoom / 8;
                    //}
                    //return 100;
                }

                $scope.latestCompletion;
                $scope.earliestStart;

                $scope.bufferedCompletion;
                $scope.bufferedStart;

                $scope.timeFrame;

                $scope.setTimeframe = function(){
                    var temp = [];
                    for (var i in $scope.d.projectList){
                        if (i > 0){
                            if (temp[0] > $scope.d.projectList[i].start){
                                temp[0] = $scope.d.projectList[i].start;
                            }
                            if (temp[1] < $scope.d.projectList[i].completions[$scope.d.projectList[1].completions.length - 1]){
                                temp[1] = $scope.d.projectList[i].completions[$scope.d.projectList[1].completions.length - 1];
                            }
                        }
                        else{
                            temp[0] = $scope.d.projectList[0].start;
                            temp[1] = $scope.d.projectList[0].completions[$scope.d.projectList[0].completions.length - 1];
                        }
                        $scope.earliestStart = temp[0];
                        $scope.latestCompletion = temp[1];

                        $scope.bufferedStart = temp[0] - (temp[0] % 604800) - (2 * 604800);
                        $scope.bufferedCompletion = temp[1] - (temp[1] % 604800) + (2 * 604800);

                        $scope.timeFrame = ($scope.bufferedCompletion - $scope.bufferedStart) / 604800;
                        //console.log($scope.timeFrame);
                    }
                }

                $scope.setTimeframe()

                $scope.position = function(start){
                    return $scope.zoom * (start - $scope.bufferedStart)/604800;
                }

                $scope.setupStageSegments = function(start, prev, end){
                    var width;
                    var left;
                    if(prev){
                        width = $scope.position(end) - $scope.position(prev);
                        left = Math.floor($scope.position(prev) - $scope.position(start));
                    }
                    else{
                        width = $scope.position(end) - $scope.position(start);
                        left = 0;
                    }
                    return 'left:' + left + 'px; width:' + width + 'px;';
                }

                $scope.labels = [];

                $scope.setLabels = function(){
                    for (var i = 0; i < $scope.timeFrame; i++){
                        //if (i % 2 == 0) {
                            $scope.labels[i] = $scope.bufferedStart + i * 604800;
                        //}
                    }
                }
                $scope.setLabels();

                $scope.showLabel = function(ind){
                    var showIf = 64 / $scope.zoom;
                    if (ind%showIf == 0){
                        return '';
                    }
                    else {
                        return 'hide';
                    }
                }

            },
            link: function(scope, element, attrs) {
                        var X = 0;
                        var Y = 0;
                        var touchX = 0;
                        var touchX0 = 0;
                        var touchY = 0;
                        var touchY0 = 0;
                        var offsetX = 0;
                        var offsetY = 0;


                        element.on('touchstart', function(e) {
                            //element.css("color", "red");
                            //element.css("-webkit-transform", "translate3d(20px, 0,0)");
                            e.preventDefault();
                            $('#mcGanttProjectBarSlider').removeClass('animate');
                            $('#mcGanttProjectNameSlider').removeClass('animate');
                            $('#mcGanttLabelSlider').removeClass('animate');
                            $('#mcGanttDateSlider').removeClass('animate');
                            var touchEvent = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                            touchX0 = touchX = touchEvent.pageX;
                            touchY0 = touchY = touchEvent.pageY;
                            //scope.position0 = scope.position;

                            //console.log(scope.position);
                            //console.log(scope.position0);
                        });
                          //drag button
                        element.on('touchmove', function(e) {
                            //element.css("color", "green");
                            e.preventDefault();
                            var touchEvent = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                            touchX = touchEvent.pageX;
                            touchY = touchEvent.pageY;
                            X = offsetX + touchX - touchX0;
                            Y = offsetY + touchY - touchY0;
                           // scope.allowMovement = scope.setAllowMovement(scope.X);mcGanttProjectName
                            $('#mcGanttProjectBarSlider').css("-webkit-transform", "translate3d(" + X + "px, " + Y + "px,0)");
                            $('#mcGanttProjectNameSlider').css("-webkit-transform", "translate3d(0, " + Y + "px,0)");
                            $('#mcGanttLabelSlider').css("-webkit-transform", "translate3d(" + X + "px, 0,0)");
                            $('#mcGanttDateSlider').css("-webkit-transform", "translate3d(" + X + "px, 0,0)");
                            //move();
                        });
                          //release button
                        element.on('touchend', function(e) {
                            e.preventDefault();
                            $('#mcGanttProjectBarSlider').addClass('animate');
                            $('#mcGanttProjectNameSlider').addClass('animate');
                            $('#mcGanttLabelSlider').addClass('animate');
                            $('#mcGanttDateSlider').addClass('animate');
                            if (X > 0){
                                X = 0;
                            }
                            if ( Y > 0){
                                Y = 0;
                            }
                            if(scope.barWidth()<100){
                                X = 0;
                            }
                            else if (X < -1*($('.mcGanttProjectBar').width() - $('.mcGanttProjectBarContainer').width())){
                                X = -1*($('.mcGanttProjectBar').width() - $('.mcGanttProjectBarContainer').width());
                            }
                            var tempHeight = $('.mcGanttProjectName').length*$('.mcGanttProjectName').outerHeight();
                            if ( Y < -1*(tempHeight - $('#mcGanttProjectNameSlider').outerHeight())){
                                if (tempHeight < $('#mcGanttProjectNameSlider').outerHeight()){
                                    Y = 0;
                                }
                                else{
                                    Y = -1*(tempHeight - $('#mcGanttProjectNameSlider').outerHeight()) - 1;
                                }
                            }
                            $('#mcGanttProjectBarSlider').css("-webkit-transform", "translate3d(" + X + "px, " + Y + "px,0)");
                            $('#mcGanttProjectNameSlider').css("-webkit-transform", "translate3d(0, " + Y + "px,0)");
                            $('#mcGanttLabelSlider').css("-webkit-transform", "translate3d(" + X + "px, 0,0)");
                            $('#mcGanttDateSlider').css("-webkit-transform", "translate3d(" + X + "px, 0,0)");
                            //element.css("-webkit-transform", "translate3d( 0, 0, 0)");
                            offsetX = X;
                            offsetY = Y;
                            X = touchX0 = touchX = 0;
                            Y = touchY0 = touchY = 0;
                        });
                    }
        };
    }).directive('mcScroll', function(){
      return {
        restrict: "A",
        controller: function($scope, $attrs, $element, data, $rootScope){
                $scope.d = data;

                //zoom is number of pixels per week
                $scope.zoom = 8;

                $scope.isSelected = function(dataItem){
                    return ($scope.d.isCatSelected(dataItem.category) && $scope.d.isSegSelected(dataItem.segment));
                }

                $scope.zoomInMaxed = false;
                $scope.zoomOutMaxed = false;
                $scope.zoomIn = function(){
                    if ($scope.zoom < 64){
                        $scope.zoom = $scope.zoom * 2;
                        $scope.zoomOutMaxed = false;
                    }
                    if ($scope.zoom == 64) {
                        $scope.zoomInMaxed = true;
                        //console.log($scope.zoom);
                    }
                    $rootScope.$broadcast('zoomChange');
                }

                $scope.zoomOut = function(){
                    if ($scope.zoom > 2){
                        $scope.zoom = $scope.zoom / 2;
                        $scope.zoomInMaxed = false;
                    }
                    if ($scope.zoom == 2) {
                        $scope.zoomOutMaxed = true;
                        //console.log($scope.zoom);
                    }
                    $rootScope.$broadcast('zoomChange');
                }

                $scope.barWidth = function(){
                    //if ((100 * $scope.zoom / 8) > 100){
                        return 100 * $scope.zoom / 8;
                    //}
                    //return 100;
                }

                $scope.widthInPx = function(){
                    return 200 + 782* $scope.zoom / 8;
                }

                $scope.latestCompletion;
                $scope.earliestStart;

                $scope.bufferedCompletion;
                $scope.bufferedStart;

                $scope.timeFrame;

                $scope.setTimeframe = function(){
                    var temp = [];
                    for (var i in $scope.d.projectList){
                        if (i > 0){
                            if (temp[0] > $scope.d.projectList[i].start){
                                temp[0] = $scope.d.projectList[i].start;
                            }
                            if (temp[1] < $scope.d.projectList[i].completions[$scope.d.projectList[1].completions.length - 1]){
                                temp[1] = $scope.d.projectList[i].completions[$scope.d.projectList[1].completions.length - 1];
                            }
                        }
                        else{
                            temp[0] = $scope.d.projectList[0].start;
                            temp[1] = $scope.d.projectList[0].completions[$scope.d.projectList[0].completions.length - 1];
                        }
                        $scope.earliestStart = temp[0];
                        $scope.latestCompletion = temp[1];

                        $scope.bufferedStart = temp[0] - (temp[0] % 604800) - (2 * 604800);
                        $scope.bufferedCompletion = temp[1] - (temp[1] % 604800) + (2 * 604800);

                        $scope.timeFrame = ($scope.bufferedCompletion - $scope.bufferedStart) / 604800;
                        //console.log($scope.timeFrame);
                    }
                }

                $scope.setTimeframe()

                $scope.position = function(start){
                    return $scope.zoom * (start - $scope.bufferedStart)/604800;
                }

                $scope.setupStageSegments = function(start, prev, end){
                    var width;
                    var left;
                    if(prev){
                        width = Math.ceil($scope.position(end) - $scope.position(prev));
                        left = Math.floor($scope.position(prev) - $scope.position(start));
                    }
                    else{
                        width = Math.ceil($scope.position(end) - $scope.position(start));
                        left = 0;
                    }
                    return 'left:' + left + 'px; width:' + width + 'px;';
                }

                $scope.labels = [];

                $scope.setLabels = function(){
                    for (var i = 0; i < $scope.timeFrame; i++){
                        //if (i % 2 == 0) {
                            $scope.labels[i] = $scope.bufferedStart + i * 604800;
                        //}
                    }
                }
                $scope.setLabels();

                $scope.showLabel = function(ind){
                    var showIf = 64 / $scope.zoom;
                    if (ind%showIf == 0){
                        return '';
                    }
                    else {
                        return 'hide';
                    }
                }

            },
        link: function(scope, element, attrs) {
            document.ontouchmove = function(e) { 
                
                    e.preventDefault();
                
            };
            // shim layer with setTimeout fallback, helps time animation
            window.requestAnimFrame = (function(){
              return  window.requestAnimationFrame       || 
                      window.webkitRequestAnimationFrame || 
                      window.mozRequestAnimationFrame    || 
                      window.oRequestAnimationFrame      || 
                      window.msRequestAnimationFrame     || 
                      function( callback ){
                        window.setTimeout(callback, 1000 / 60);
                      };
            })();

            //animation variables
            var elementWidth;
            var elementHeight;
            var parentWidth;
            var parentHeight;
            var rightScrollbar = $('<div class="scrollbar right hidden"></div>').appendTo(element.parent());
            var bottomScrollbar = $('<div class="scrollbar bottom hidden"></div>').appendTo(element.parent());
            var lockX;
            var lockY;
            var maxYtranslation; 
            var maxXtranslation;
            var history = {'X':[],'Y':[]};
            var count = 0;
            var releaseCounter = 0;
            var velocityX = 0;
            var velocityY = 0;
            var continueAnim = true;
            var velocitiesSet = false;
            var barWidth;
            var barHeight;
            var pnCont;
            var Xstopped = false;
            var Ystopped = false;
            var preCalcs = [];
            for(var i = 0; i<200; i++){
                preCalcs.push(Math.pow(.95,i));
            }
            var  pnCont = element.find('#projectNameContainer');
            var pbCont = element.find('#projectBarContainer');
            var dCont = element.find('#dateContainer');
            //end animation variables

            //animation inits
            function initAnim(){
                //element.removeClass('animate');
                pnCont.removeClass('animate');
                pbCont.removeClass('animate');
                dCont.removeClass('animate');
                //elementWidth = element.width();
                //elementHeight = element.height();
                var temp = 0;
                if(pbCont.width() > 782* scope.zoom / 8){
                    temp = pbCont.width() ;
                }
                else{
                    temp = 782* scope.zoom / 8;
                }
                elementWidth = temp + pnCont.width()-3;
                elementHeight = pnCont.height();
                parentWidth = element.parent().width();
                parentHeight = element.parent().height();
                lockX = parentWidth >= elementWidth;
                lockY = parentHeight >= elementHeight;
                maxYtranslation = -1*(elementHeight - parentHeight + 15);
                maxXtranslation = -1*(elementWidth - parentWidth);
                //console.log(pbCont.width());
                count = 0;
                releaseCounter = 0;
                history = {'X':[],'Y':[]};
                continueAnim = true;
                velocitiesSet = false;
                scrollbarinit();
                animloopTouched();
            }
            function scrollbarinit(){
                if (!lockX){
                    barWidth = parentWidth*parentWidth/elementWidth;
                    bottomScrollbar.removeClass('hidden');
                    bottomScrollbar.css("width", barWidth);
                    bottomScrollbar.removeClass('animate hideScrollbar');
                }
                if (!lockY){
                    barHeight = parentHeight*parentHeight/elementHeight;
                    rightScrollbar.removeClass('hidden');
                    rightScrollbar.css("height", barHeight);            
                    rightScrollbar.removeClass('animate hideScrollbar');
                }
            };
            //end animation inits

            //animations
            function animloopTouched(){
                if(touched){
                    //scrollAnim();
                    makeHistory();
                    ganttAnim();
                    scrollbarAnim();
                    count ++;
                    requestAnimFrame(animloopTouched);
                }
                else{
                    animloopUntouched();
                }
            };

            function animloopUntouched(){
                if(!touched){
                    setXY()
                    //scrollAnim();
                    makeHistory();
                    ganttAnim();
                    scrollbarAnim();
                    if(continueAnim){
                        requestAnimFrame(animloopUntouched);
                    }
                }
            }

            function makeHistory(){
                history['X'][count] = X;
                history['Y'][count] = Y;
            }

            function ganttAnim(){
                pnCont.css("-webkit-transform", "translate3d(0, " + Y + "px,0)");
                pbCont.css("-webkit-transform", "translate3d(" + X + "px, " + Y + "px,0)");
                dCont.css("-webkit-transform", "translate3d(" + X + "px, 0,0)");
            }
            function scrollbarAnim(){
                rightScrollbar.css("-webkit-transform", "translate3d(0," + (parentHeight-barHeight)*Y/maxYtranslation + "px,0)");
                bottomScrollbar.css("-webkit-transform", "translate3d(" + (parentWidth- barWidth)*X/maxXtranslation + "px, 0,0)");
                if(!continueAnim){
                    rightScrollbar.addClass('animate hideScrollbar');
                    bottomScrollbar.addClass('animate hideScrollbar');
                }
            }
            //end animations


            //animation helper functions
            function setXY(){
                if(!velocitiesSet){
                    velocityX = 0.75*((history['X'][history['X'].length-1] - history['X'][history['X'].length-2])*.7 + (history['X'][history['X'].length-2] - history['X'][history['X'].length-3])*.25 + (history['X'][history['X'].length-3] - history['X'][history['X'].length-4])*.05);
                    velocityY = 0.75*((history['Y'][history['Y'].length-1] - history['Y'][history['Y'].length-2])*.7 + (history['Y'][history['Y'].length-2] - history['Y'][history['Y'].length-3])*.25 + (history['Y'][history['Y'].length-3] - history['Y'][history['Y'].length-4])*.05);
                    velocitiesSet = true;
                }
                Xstopped = !(preCalcs[releaseCounter]*velocityX > .2 || preCalcs[releaseCounter]*velocityX < -.2);
                Ystopped = !(preCalcs[releaseCounter]*velocityY > .2 || preCalcs[releaseCounter]*velocityY < -.2);
                if(!Xstopped){
                    if(X > 0 || X < maxXtranslation){
                        velocityX = 0.6*velocityX;
                    }
                    X = X + preCalcs[releaseCounter]*velocityX;
                }
                if(!Ystopped){
                    if(Y > 0 || Y < maxYtranslation){
                        velocityY = 0.6*velocityY;
                    }
                    Y = Y +preCalcs[releaseCounter]*velocityY; 
                }
                if ((Xstopped && Ystopped) || releaseCounter >= 90){
                    //element.addClass('animate');
                    pnCont.addClass('animate');
                    pbCont.addClass('animate');
                    dCont.addClass('animate');
                    if(Y > 0 || lockY){
                        Y = 0;
                    }
                    else if(Y < maxYtranslation){
                        Y = maxYtranslation;
                    }
                    if(X > 0){
                        X = 0;
                    }
                    else if(X < maxXtranslation){
                        X = maxXtranslation;
                    }
                    continueAnim = false;
                }
                releaseCounter ++;
                //console.log(releaseCounter);

            }
            //end animation helper functions


            //touch and mouse event variables
            var touched = false;
            var X = 0;
            var Y = 0;
            var offsetX = 0;
            var offsetY = 0;
            var Android = /Android/i.test(navigator.userAgent);
            var events = {};
            if (/webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) || Android){
                events['start'] = "touchstart";
                events['move']  = "touchmove";
                events['end'] = "touchend";
            }
            else{
                events['start'] = "mousedown";
                events['move']  = "mousemove";
                events['end'] = "mouseup";
            }
            element[0].addEventListener(events['start'], start, false);
            //end touch and mouse event variables

            //event functions
            function start(e){
                e.preventDefault();
                touched = true;
                if(!Android){
                    offsetX = e.pageX - X;
                    offsetY = e.pageY - Y;
                }
                else{
                    offsetX = e.changedTouches[0].pageX - X;
                    offsetY = e.changedTouches[0].pageY - Y;
                }
                document.addEventListener( events['move'], move, false);
                document.addEventListener( events['end'], stop, false);
                initAnim();
            }

            function move(e){
                if(!Android){
                   var pageX = e.pageX;
                   var pageY = e.pageY;
                }
                else{
                   var pageX = e.changedTouches[0].pageX;
                   var pageY = e.changedTouches[0].pageY;
                }
                if (lockX) {
                    X = 0;
                }
                else{
                    X = pageX - offsetX;
                }
                if (lockY){
                    console.log('locked Y');
                    Y = 0;
                }
                else{
                    Y = pageY - offsetY;      
                }
            }

            function stop(e){
                touched = false;
                document.removeEventListener( events['move'], move, false);
                document.removeEventListener( events['end'], stop, false);
            }

            scope.$on('zoomChange', function(){
                //console.log('CHANGE IN MAIN');
                initAnim();
            });
            //end event functions

        }
      };
})
.directive('adSvgclick', function() {
    return {
        restrict: 'A',
        link: function(scope, el, attr) {
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
                el.on('touchstart', function(event) {
                    event.preventDefault();
                    console.log('touched');
                    var node = event.target;
                    while(node.id === "") {
                        node = node.parentNode;
                    }
                    scope.touchId = node.id;
                    scope.$apply(attr['adSvgclick']);
                });
            } else {
                el.on('click', function(event) {
                    var node = event.target;
                    while(node.id === "") {
                        node = node.parentNode;
                    }
                    scope.touchId = node.id;
                    scope.$apply(attr['adSvgclick']);
                });
            }
        }
    }
});