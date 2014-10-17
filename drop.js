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
 * ANIMATIONS and DIMENSIONS
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

var translateElement = function (jqElement, position) {
	jqElement.css("-webkit-transform", "translate3d(" + position.x + "px, " + position.y + "px, 0px)");
};

var removeTranslation = function (jqElement) {
	jqElement.css("-webkit-transform", "translate3d( 0, 0, 0)");
};

var hasClass = function (jqElement, className) {
	jqElement[0].classList.contains(className);
};

var addClass = function (jqElement, className) {
	jqElement[0].classList.add(className);
};

var removeClass = function (jqElement, className) {
	jqElement[0].classList.remove(className);
};

var getElementDimensions = function (element) {
	var jqElement = $(element);
	var offset    = jqElement.offset();
	return {
		element: element,
		left:    offset.left,
    right:   offset.left + jqElement.width(),
    top:     offset.top,
    bottom:  offset.top  + jqElement.height()
	}
};

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
};

var diffPositions = function (a, b) {
	return {
		x: (a.x - b.x),
		y: (a.y - b.y)
	}
};

var addEventListener = function (watchedElement, event, onEvent) {
	watchedElement.addEventListener(event, onEvent, false);
};

var removeEventListener = function (watchedElement, event, onEvent) {
	watchedElement.removeEventListener(event, onEvent, false);
};

/********************************************
 * DIRECTIVES
 ********************************************/

angular.module('matt-casey.dragon-drop', [])
.directive('mcDraggable', [ function () {
	return {
		restrict: 'A',
		scope: {
			targets: '='
		},
		link: function(scope, element, attrs) {
			var initialEventPosition = emptyCoordinates;
			var elementPosition      = emptyCoordinates;
			var isCurrentlyMoving;
			var events;
			var dropTargets;

			var setupDirective = function () {
				setupElementStyling();
				events = getEvents();
				dropTargets = getDropTargets();
				addEventListener(element[0], events.start, startEventHandler);
			}

			var setupElementStyling = function () {
				addClass(element, 'draggable');
			}

			var getDropTargets = function () {
				var tempTargets = [];
				for (var i = 0; i < scope.targets.length; i++) {
					var elementList = document.querySelectorAll('[mc-droppable=' + scope.targets[i] + ']');
					for (var i = 0; i < elementList.length; i++) {
						var target = getElementDimensions(elementList[i]);
						tempTargets.push(target)
					};
				};
				console.log(tempTargets);
				return tempTargets;
			};

			// EVENTS

			var startEventHandler = function (event) {
				isCurrentlyMoving = true;
				initialEventPosition = getEventCoordinates(event);

				addEventListener(document, events.move, moveEventHandler);
				addEventListener(document, events.stop, stopEventHandler);

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

				removeEventListener(document, events.move, moveEventHandler);
				removeEventListener(document, events.stop, stopEventHandler);
			}

			// ANIMATIONS

			var startAnimation = function () {
				removeClass(element, 'return-animation');
				addClass(element, 'being-dragged');
				requestAnimationFrame(animationLoop);
			}

			var animationLoop = function () {
				translateElement(element, elementPosition);
				isCurrentlyMoving ? requestAnimationFrame(animationLoop) : endAnimation();
			}

			var endAnimation = function () {
				removeClass(element, 'being-dragged');
				addClass(element, 'return-animation');
				removeTranslation(element);
			}

			setupDirective();
		}
	};
}]);