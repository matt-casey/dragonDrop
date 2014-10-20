'use strict';

/* Directives */


angular.module('myApp.directives', [])
  .directive('mcTap', function() {
          return function(scope, element, attrs) {
            element.css( 'cursor', 'pointer' );
            var touched = false;
            var X = 0;
            var Y = 0;
            var offsetX = 0;
            var offsetY = 0;
            var Android = /Android/i.test(navigator.userAgent);
            var events = {};
            (function initEvents(){
                if (/webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) || Android){
                    events['start'] = "touchstart";
                    events['move']  = "touchmove";
                    events['end'] = "touchend";
                }
                else{
                    events['start'] = "mousedown";
                    events['move']  = "mousemove";
                    events['end']   = "mouseup";
                }
                element[0].addEventListener(events['start'], start, false);
            })()
            function start(e){
                //e.preventDefault();
                touched = true;
                if(!Android){
                    offsetX = e.pageX - X;
                    offsetY = e.pageY - Y;
                }
                else{
                    offsetX = e.changedTouches[0].pageX - X;
                    offsetY = e.changedTouches[0].pageY - Y;
                }
                element.addClass('touched');
                document.addEventListener( events['move'], move, false);
                document.addEventListener( events['end'], stopOffElement, false);
                element[0].addEventListener( events['end'], stop, false);
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
                X = pageX - offsetX;
                Y = pageY - offsetY;
            }

            function stop(e){
                if((X*X + Y*Y) < 144){
                    scope.$apply(attrs['mcTap']);
                }
                reset();
            }

            function stopOffElement(e){
                reset();
            }

            function reset(){
                touched = false;
                X = 0;
                Y = 0;
                offsetX = 0;
                offsetY = 0;
                document.removeEventListener( events['move'], move, false);
                element[0].removeEventListener( events['end'], stop, false);
                document.removeEventListener( events['end'], stopOffElement, false);
                element.removeClass('touched');
            }
        };
}).directive('mcDraggable',function(){
    return{
        restrict: 'A',
        scope: {
            sockets: '=',
            ad:  '@',
            ads: '='
        },
        controller: function($scope){
            console.log('ad',$scope.ad,$scope.ads)
        },
        link: function(scope, element, attrs){
            var touched = false;
            var X = 0;
            var Y = 0;
            var offsetX = 0;
            var offsetY = 0;
            var dropSpots = [];
            var dropSpotsSet = false;
            var trash;
            var nonAd;

            function setDropSpots(){
                 trash = $('#trashbin');
                 nonAd = $('#nonAd');
                var nodes = $('.droppable');
                for (var i = 0; i < nodes.length; i++) {
                    dropSpots[i] = {};
                    dropSpots[i].node   = nodes[i];
                    var jqel            = $(dropSpots[i].node);
                    var offset          = jqel.offset();
                    dropSpots[i].left   = offset.left;
                    dropSpots[i].right  = dropSpots[i].left + jqel.width();
                    dropSpots[i].top    = offset.top;
                    dropSpots[i].bottom = dropSpots[i].top + jqel.height();
                    if (dropSpots[i].node.getAttribute('id') === 'trashbin' || dropSpots[i].node.getAttribute('id') === 'nonAd') {
                        dropSpots[i].top = 0;
                        dropSpots[i].bottom = dropSpots[i].bottom + 60;
                    }
                };
                console.log(dropSpots)
                dropSpotsSet = true;
            }

            function checkDropSpots(X,Y){
                for (var i = 0; i < dropSpots.length; i++) {
                    if ( X > dropSpots[i].left  && X < dropSpots[i].right && Y > dropSpots[i].top   && Y < dropSpots[i].bottom) {
                        return dropSpots[i];
                    };
                };
                return false;
            }


            var events = {};
            var Android = /Android/i.test(navigator.userAgent);
            (function initTouch(){
                if (/webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) || Android){
                    events['start'] = "touchstart";
                    events['move']  = "touchmove";
                    events['end']   = "touchend";
                }
                else{
                    events['start'] = "mousedown";
                    events['move']  = "mousemove";
                    events['end']   = "mouseup";
                }
                element[0].addEventListener(events['start'], start, false);
            })()

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

            function start(e){
                //e.preventDefault();
                dropSpotsSet ? '' : setDropSpots();
                console.log('mouse down');
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
                //e.preventDefault();
                if(!Android){
                   var pageX = e.pageX;
                   var pageY = e.pageY;
                }
                else{
                   var pageX = e.changedTouches[0].pageX;
                   var pageY = e.changedTouches[0].pageY;
                }
                X = pageX - offsetX;
                Y = pageY - offsetY;
            }

            function stop(e){
                //e.preventDefault();
                touched = false;
                document.removeEventListener( events['move'], move, false);
                document.removeEventListener( events['end'], stop, false);
                console.log('mouse up');
            }

            function initAnim(){
                //set vars
                element.removeClass('animate').css("z-index", "10000").addClass('beingDragged');
                trash.removeClass('hidetrash');
                nonAd.removeClass('hidetrash');
                touchedCounter = 0;
                dropinfos = []
                scope.$emit('dragStart');
                scope.$broadcast('dragStart');
                //call anim loop
                animLoop();
            }
            var touchedCounter = 0;
            var hoverClass = false;
            var currentNode = 0;
            var dropinfos = []
            function animLoop(){
                element.css("-webkit-transform", "translate3d(" + X + "px, "+ Y +"px,0px)");
                if (touched) {
                    if (touchedCounter % 6 === 0) {
                        var dropSpot = checkDropSpots((X + offsetX), (Y + offsetY));
                        if (hoverClass) {
                            for (var i = 0; i < dropSpots.length; i++) {
                                $(dropSpots[i].node).removeClass('hover');
                            };
                            hoverClass = false;
                        };
                        if (dropSpot) {
                            currentNode = dropSpot;
                            $(dropSpot.node).addClass("hover");
                            hoverClass = true;
                        };
                    };
                    touchedCounter ++;
                    requestAnimFrame(animLoop);
                }
                else{
                     trash.addClass('hidetrash');
                     nonAd.addClass('hidetrash');
                    scope.$emit('dragEnd');
                    scope.$broadcast('dragEnd');
                    if (hoverClass) {
                        dropinfos = currentNode.node.getAttribute('dropinfo').split(',');
                        if (dropinfos && dropinfos[0] === 'fill') {
                            var row = scope.sockets[parseInt(dropinfos[1])];
                            var socket = row[parseInt(dropinfos[2])];
                            socket.filled = true;
                            socket.filledWith = scope.ads[scope.ad]['Line'];
                            socket.filledId = scope.ad;
                            scope.ads[scope.ad].usedUp = true;
                            // scope.ads[scope.ad].hide = true;
                            console.log(scope.ads)
                            scope.$apply();
                        }
                        else if (dropinfos && dropinfos[0] === 'remove'){
                            scope.ads[scope.ad].hide = true;
                            scope.$apply();
                        }
                        for (var i = 0; i < dropSpots.length; i++) {
                            $(dropSpots[i].node).removeClass('hover');
                        };
                        hoverClass = false;
                    };
                    element.addClass('animate').css("z-index", "1").removeClass('beingDragged');
                    X = 0;
                    Y = 0;
                    element.css("-webkit-transform", "translate3d(" + X + "px, "+ Y +"px,0px)");
                }
            }
        }
    }
});