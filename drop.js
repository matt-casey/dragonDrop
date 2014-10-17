/**
@toc

@param {Object} scope (attrs that must be defined on the scope (i.e. in the controller) - they can't just be defined in the partial html). REMEMBER: use snake-case when setting these on the partial!
TODO

@param {Object} attrs REMEMBER: use snake-case when setting these on the partial! i.e. my-attr='1' NOT myAttr='1'
TODO

@dependencies
TODO

@usage
partial / html:
TODO

controller / js:
TODO

//end: usage
*/

'use strict';

/********************************************
 * SETUP
 ********************************************/

var isAndroid = /Android/i.test(navigator.userAgent);
var hasTouchEvents = /webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) || isAndroid; //SHOULD BE BASED ON WHETHER TOUCHEVENTS EXIST

/********************************************
 * ANIMATIONS
 ********************************************/

var requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
	})();

var translateElement = function (element, position) {
	element.css("-webkit-transform", "translate3d(" + position.x + "px, " + position.y + "px, 0px)");
}

var removeTranslation = function (element) {
	element.css("-webkit-transform", "translate3d( 0, 0, 0)");
}

/********************************************
 * EVENTS
 ********************************************/

var emptyCoordinates = {x:0, y:0};

var getEvents = function () {
  return {
  	start: (hasTouchEvents ? "touchstart" : "mousedown"),
    move:  (hasTouchEvents ? "touchmove"  : "mousemove"),
    stop:  (hasTouchEvents ? "touchend"   : "mouseup"  )
  }
};

var getEventCoordinates = function (event) {
	return {
		x: (isAndroid ? event.changedTouches[0].pageX : event.pageX),
		y: (isAndroid ? event.changedTouches[0].pageY : event.pageY)
	}
}

var diffPositions = function (a, b) {
	return {
		x: (a.x - b.x),
		y: (a.y - b.y)
	}
}

var addEventListener = function (event, onEvent) {
	document.addEventListener( event, onEvent, false);
}

var removeEventListener = function (event, onEvent) {
	document.removeEventListener( event, onEvent, false);
}

/********************************************
 * DIRECTIVES
 ********************************************/

angular.module('matt-casey.dragon-drop', [])
.directive('mcDraggable', [ function () {
	return {
		restrict: 'A',
		scope: {
		},
		link: function(scope, element, attrs) {
			var initialEventPosition = emptyCoordinates;
			var elementPosition      = emptyCoordinates;
			var isCurrentlyMoving;
			var events;

			var setupDirective = function () {
				events = getEvents();
				addEventListener(events.start, startEventHandler);
			}

			var startEventHandler = function (event) {
				isCurrentlyMoving = true;
				initialEventPosition = getEventCoordinates(event);

				addEventListener(events.move, moveEventHandler);
				addEventListener(events.stop, stopEventHandler);

				startAnimation();
			}

			var moveEventHandler = function (event) {
				var eventPosition = getEventCoordinates(event);
				elementPosition = diffPositions(eventPosition, initialEventPosition);
			}

			var stopEventHandler = function (event) {
				isCurrentlyMoving    = false;
			  initialEventPosition = emptyCoordinates;
			  elementPosition      = emptyCoordinates;

				removeEventListener(events.move, moveEventHandler);
				removeEventListener(events.stop, stopEventHandler);
			}

			var startAnimation = function () {
				requestAnimationFrame(animationLoop);
			}

			var animationLoop = function () {
				console.log(elementPosition);
				translateElement(element, elementPosition);

				isCurrentlyMoving ? requestAnimationFrame(animationLoop) : endAnimation();
			}

			var endAnimation = function () {

			}

			setupDirective();
		}
	};
}]);