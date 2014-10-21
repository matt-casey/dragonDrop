angular.module('mc-drag-and-drop.mcDraggable', [
  'mc-drag-and-drop.mcCss',
  'mc-drag-and-drop.mcCollisions',
  'mc-drag-and-drop.mcAnimation',
  'mc-drag-and-drop.mcEvents'
])

.factory('DropTargets', ['$rootScope', 'mcCss', 'mcCollisions', 'mcEvents', function ($rootScope, mcCss, mcCollisions, mcEvents) {
  var DropTargets = function () {

    var targetList = [];
    var rawList = [];
    var currentTarget;
    var previousTarget;


    var setDropTargets = function (newRawList) {
      rawList = newRawList;
      updateTargetList();
    };

    var updateTargetList = function () {
      targetList = [];

      for (var i = 0; i < rawList.length; i++) {
        var attributeName = '[mc-droppable=' + rawList[i].type + ']';
        var elementList = mcCss.findAllByAttribute(attributeName);

        for (var j = 0; j < elementList.length; j++) {
          var tempTarget = constructTarget(elementList[j], rawList[i])
          targetList.push(tempTarget);
        }
      }
    }
    mcEvents.addEventListener(window, "resize", updateTargetList);

    var constructTarget = function (element, targetInfo) {
      var tempTarget = mcCollisions.getElementDimensions(element);

      mcCss.addClass(tempTarget.element, 'droppable');

      tempTarget.onDrop  = targetInfo.onDrop;
      tempTarget.onHover = targetInfo.onHover;

      return tempTarget;
    };

    var setCurrentTarget = function (cursorPosition, elementPosition, elementDimensions, collisionType) {
      var positionDetails;
      if (collisionType !== 'cursor') {
        positionDetails = mcCollisions.getTranslatedDimensions(elementDimensions, elementPosition);
      }
      else {
        positionDetails = cursorPosition;
      }
      currentTarget = mcCollisions.findOverlap(positionDetails, targetList, collisionType);
    };

    var getCurrentTarget = function () {
      return currentTarget;
    };

    var setPreviousTarget = function (setTo) {
      previousTarget = setTo;
    };

    var getPreviousTarget = function () {
      return previousTarget;
    };

    var callDropEvent = function (callArguments) {
      currentTarget.onDrop && currentTarget.onDrop(callArguments);
      $rootScope.$apply();
      currentTarget = false;
    };

    var callHoverEvent = function (callArguments) {
      currentTarget.onHover && currentTarget.onHover(callArguments);
      $rootScope.$apply();
    };

    return {
      setDropTargets:  setDropTargets,

      setCurrentTarget:   setCurrentTarget,
      getCurrentTarget:   getCurrentTarget,

      setPreviousTarget:  setPreviousTarget,
      getPreviousTarget:  getPreviousTarget,

      callDropEvent:      callDropEvent,
      callHoverEvent:     callHoverEvent
    }

  }
  return DropTargets;
}])

.directive('mcDraggable', ['mcAnimation', 'mcCss', 'mcCollisions', 'mcEvents', 'DropTargets', function (mcAnimation, mcCss, mcCollisions, mcEvents, DropTargets) {
  return {
    restrict: 'A',
    scope: {
      itemInfo: '=',
      targets: '=',
      returnedInfo: '=',
      collisionDetection: '=',
      confineTo: '='
    },
    link: function(scope, element, attrs) {
      var classesWhileAnimating    = ['being-dragged'];
      var classesWhileNotAnimating = ['return-animation'];
      var defaultCollision = 'cursor';
      var defaultBounds    = 'html';

      var emptyCoordinates = { x:0, y:0 };

      var initialEventPosition = emptyCoordinates;
      var cursorPosition       = emptyCoordinates;
      var elementPosition      = emptyCoordinates;

      var body;
      var vanillaElement;
      var elementDimensions;
      var collisionDetection;
      var elementConfinedTo;
      var translationBounds;

      var isCurrentlyMoving;
      var dragEvents;
      var targets;

      var setupDirective = function () {
        vanillaElement = element[0];
        mcCss.addClass(vanillaElement, 'draggable');
        body = mcCss.findByAttribute('body');

        elementDimensions = mcCollisions.getElementDimensions(vanillaElement);
        elementConfinedTo = scope.confineTo || defaultBounds;
        translationBounds = mcCollisions.getElementDimensions(elementConfinedTo);

        collisionDetection = scope.collisionDetection || defaultCollision;

        targets = new DropTargets();
        targets.setDropTargets(scope.targets);

        dragEvents = mcEvents.getDragEvents();
        mcEvents.addEventListener(vanillaElement, dragEvents.start, startEventHandler);
      };

      // EVENT HANDLERS

      var startEventHandler = function (event) {
        isCurrentlyMoving = true;

        elementDimensions = mcCollisions.getElementDimensions(element);
        translationBounds = mcCollisions.getElementDimensions(elementConfinedTo);

        initialEventPosition = mcEvents.getEventCoordinates(event);
        cursorPosition       = mcEvents.getEventCoordinates(event);

        mcEvents.addEventListener(document, dragEvents.move, moveEventHandler);
        mcEvents.addEventListener(document, dragEvents.stop, stopEventHandler);

        mcAnimation.startAnimation(startAnimation, moveAnimation, endAnimation, continueAnimation);
      };

      var moveEventHandler = function (event) {
        cursorPosition = mcEvents.getEventCoordinates(event);
        var unboundedPosition = mcEvents.diffPositions(cursorPosition, initialEventPosition);
        elementPosition = mcCollisions.getBoundedPosition(unboundedPosition, elementDimensions, translationBounds);

        targets.setCurrentTarget(cursorPosition, elementPosition, elementDimensions, collisionDetection);
        var positionDetails;

        targets.callHoverEvent(scope.returnedInfo);
      };

      var stopEventHandler = function (event) {
        targets.callDropEvent(scope.returnedInfo);

        isCurrentlyMoving    = false;

        initialEventPosition = emptyCoordinates;
        elementPosition      = emptyCoordinates;
        cursorPosition       = emptyCoordinates;

        mcEvents.removeListener(document, dragEvents.move, moveEventHandler);
        mcEvents.removeListener(document, dragEvents.stop, stopEventHandler);
      };

      // ANIMATIONS

      var startAnimation = function () {
        mcCss.removeClasses(vanillaElement, classesWhileNotAnimating);
        mcCss.addClasses(vanillaElement, classesWhileAnimating);
        mcCss.addClass(body, 'no-select');
      };

      var moveAnimation = function () {
        mcCss.translateElement(vanillaElement, elementPosition);

        if (targets.getPreviousTarget()) {
          mcCss.removeClass(targets.getPreviousTarget().element, 'hover');
        }
        if (targets.getCurrentTarget()) {
          mcCss.addClass(targets.getCurrentTarget().element, 'hover');
          targets.setPreviousTarget(targets.getCurrentTarget());
        }
      };

      var endAnimation = function () {
        mcCss.removeClass(body, 'no-select');
        mcCss.removeClasses(vanillaElement, classesWhileAnimating);
        mcCss.addClasses(vanillaElement, classesWhileNotAnimating);
        mcCss.removeTranslation(vanillaElement);
      };

      var continueAnimation = function () {
        return isCurrentlyMoving;
      }

      setupDirective();
    }
  };
}]);