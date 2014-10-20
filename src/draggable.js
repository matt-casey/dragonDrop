angular.module('mc-drag-and-drop.mcDraggable', [
  'mc-drag-and-drop.mcCss',
  'mc-drag-and-drop.mcAnimation',
  'mc-drag-and-drop.mcEvents'
])
.directive('mcDraggable', ['mcAnimation', 'mcCss', 'mcEvents', function (mcAnimation, mcCss, mcEvents) {
  var emptyCoordinates = {x:0, y:0};
  return {
    restrict: 'A',
    scope: {
      itemInfo: '=',
      targets: '='
    },
    link: function(scope, element, attrs) {
      var initialEventPosition = emptyCoordinates;
      var cursorPosition       = emptyCoordinates;
      var elementPosition      = emptyCoordinates;

      var dropTargets;
      var currentTarget;
      var elementBounds;

      var isCurrentlyMoving;
      var events;

      var setupDirective = function () {
        setupElementStyling();
        // elementBounds = mcCss.getElementDimensions(element);

        dropTargets = getDropTargets();

        events = mcEvents.getEvents();
        mcEvents.addEventListener(element[0], events.start, startEventHandler);
      };

      var setupElementStyling = function () {
        mcCss.addClass(element, 'draggable');
      };

      // DROP TARGETS

      var getDropTargets = function () {
        var tempTargets = [];
        for (var i = 0; i < scope.targets.length; i++) {
          var elementList = document.querySelectorAll('[mc-droppable=' + scope.targets[i].type + ']');
          for (var j = 0; j < elementList.length; j++) {
            var target = mcCss.getElementDimensions(elementList[j]);
            mcCss.addClass(target.jqElement, 'droppable');

            target.onDrop  = scope.targets[i].onDrop;
            target.onHover = scope.targets[i].onHover;
            target.onError = scope.targets[i].onError;

            tempTargets.push(target);
          }
        }
        return tempTargets;
      };

      var getCurrentTarget = function () {
        for (var i = 0; i < dropTargets.length; i++) {
          if (mcCss.checkOverlap.cursor(cursorPosition, dropTargets[i])) {
            return dropTargets[i];
          }
        }
        return false;
      };

      var removeHoverFromAll = function () {
        for (var i = 0; i < dropTargets.length; i++) {
          mcCss.removeClass(dropTargets[i].jqElement, 'hover');
        }
      };

      var callDropEvent = function () {
        try {
          currentTarget.onDrop(element, scope);
        }
        catch (err) {
          if (currentTarget.onError) {
            currentTarget.onError(err);
          };
        }
        scope.$apply();
      };

      // EVENTS

      var startEventHandler = function (event) {
        isCurrentlyMoving = true;
        initialEventPosition = mcEvents.getEventCoordinates(event);
        cursorPosition       = mcEvents.getEventCoordinates(event);

        mcEvents.addEventListener(document, events.move, moveEventHandler);
        mcEvents.addEventListener(document, events.stop, stopEventHandler);

        startAnimation();
      };

      var moveEventHandler = function (event) {
        cursorPosition = mcEvents.getEventCoordinates(event);
        currentTarget = getCurrentTarget();
        elementPosition = mcEvents.diffPositions(cursorPosition, initialEventPosition);
      };

      var stopEventHandler = function (event) {
        if (currentTarget) {
          callDropEvent();
          currentTarget = false;
        }

        isCurrentlyMoving    = false;

        initialEventPosition = emptyCoordinates;
        elementPosition      = emptyCoordinates;
        cursorPosition       = emptyCoordinates;

        mcEvents.removeListener(document, events.move, moveEventHandler);
        mcEvents.removeListener(document, events.stop, stopEventHandler);
      };

      // ANIMATIONS

      var startAnimation = function () {
        mcCss.removeClass(element, 'return-animation');
        mcCss.addClass(element, 'being-dragged');
        // mcCss.addClass(document.body, 'no-select'); //NEEDS TO BE JQUERY ELEMENT
        mcAnimation.requestFrame(animationLoop);
      };

      var animationLoop = function () {
        mcCss.translateElement(element, elementPosition);

        removeHoverFromAll();
        if (currentTarget) {
          mcCss.addClass(currentTarget.jqElement, 'hover');
        }

        isCurrentlyMoving ? mcAnimation.requestFrame(animationLoop) : endAnimation();
      };

      var endAnimation = function () {
        // mcCss.removeClass(document.body, 'no-select'); //NEEDS TO BE JQUERY ELEMENT
        removeHoverFromAll();
        mcCss.removeClass(element, 'being-dragged');
        mcCss.addClass(element, 'return-animation');
        mcCss.removeTranslation(element);
      };

      setupDirective();
    }
  };
}]);