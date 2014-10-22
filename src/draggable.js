angular.module('mc-drag-and-drop.mcDraggable', [
  'mc-drag-and-drop.mcCss',
  'mc-drag-and-drop.mcCollisions',
  'mc-drag-and-drop.mcAnimation',
  'mc-drag-and-drop.mcEvents'
])

.factory('DropTargets', ['$rootScope', 'mcCss', 'mcCollisions', 'mcEvents', function ($rootScope, mcCss, mcCollisions, mcEvents) {
  var DropTargets = function () {

    var targetList   = [];
    var targetConfig = [];
    var currentTarget;
    var previousTarget;


    var setTargetConfig = function (newTargetConfig) {
      targetConfig = newTargetConfig || [];
      updateTargetList();
    };

    var updateTargetList = function () {
      targetList = [];

      for (var i = 0; i < targetConfig.length; i++) {
        var attributeName = '[mc-droppable=' + targetConfig[i].type + ']';
        var elementList = mcCss.findAllByAttribute(attributeName);

        for (var j = 0; j < elementList.length; j++) {
          var tempTarget = constructTarget(elementList[j], targetConfig[i])
          targetList.push(tempTarget);
        }
      }
    };
    mcEvents.addEventListener(window, "resize", updateTargetList);

    var constructTarget = function (element, targetInfo) {
      var tempTarget = mcCollisions.getElementDimensions(element);

      mcCss.addClass(tempTarget.element, 'droppable');

      tempTarget.onDrop  = targetInfo.onDrop;
      tempTarget.onHover = targetInfo.onHover;


      return tempTarget;
    };

    var setCurrentTarget = function (positionDetails, collisionType) {
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

    var callDropEvent = function (callArguments, eventDetails) {
      currentTarget.onDrop && currentTarget.onDrop(callArguments, eventDetails);
      $rootScope.$apply();
      currentTarget = false;
    };

    var callHoverEvent = function (callArguments, eventDetails) {
      currentTarget.onHover && currentTarget.onHover(callArguments, eventDetails);
      $rootScope.$apply();
    };

    return {
      setTargetConfig:    setTargetConfig,

      setCurrentTarget:  setCurrentTarget,
      getCurrentTarget:  getCurrentTarget,

      setPreviousTarget: setPreviousTarget,
      getPreviousTarget: getPreviousTarget,

      callDropEvent:     callDropEvent,
      callHoverEvent:    callHoverEvent
    }

  }
  return DropTargets;
}])

.directive('mcDraggable', ['mcAnimation', 'mcCss', 'mcCollisions', 'mcEvents', 'DropTargets', function (mcAnimation, mcCss, mcCollisions, mcEvents, DropTargets) {
  return {
    restrict: 'A',
    scope: {
      targets:            '=',
      returnedInfo:       '=',
      collisionDetection: '=',
      confineTo:          '='
    },
    link: function(scope, element, attrs) {
      var classesWhileAnimating    = ['being-dragged'];
      var classesWhileNotAnimating = ['return-animation'];
      var defaultCollision = 'cursor';
      var defaultBounds    = 'html';

      var emptyCoordinates     = { x:0, y:0 };
      var initialEventPosition = emptyCoordinates;
      var cursorPosition       = emptyCoordinates;
      var elementPosition      = emptyCoordinates;

      var body;
      var rootElement;
      var grabbableElement;
      var elementDimensions;
      var collisionDetection;
      var elementConfinedTo;
      var translationBounds;
      var isCurrentlyMoving;
      var dragEvents;
      var targets;

      var setupDirective = function () {
        body = mcCss.findByAttribute('body');
        if (scope.targets === undefined) { scope.targets = [] };

        rootElement = element[0];
        grabbableElement = mcCss.findByAttribute('[grabbable]', rootElement) || rootElement;

        mcCss.addClasses(rootElement, classesWhileNotAnimating);
        mcCss.addClass(rootElement,      'draggable');
        mcCss.addClass(grabbableElement, 'grabbable');

        elementConfinedTo  = scope.confineTo          || defaultBounds;
        collisionDetection = scope.collisionDetection || defaultCollision;

        elementDimensions = mcCollisions.getElementDimensions(rootElement);
        translationBounds = mcCollisions.getElementDimensions(elementConfinedTo);

        targets = new DropTargets();
        scope.$watch(scope.targets.length, updateTargets);

        dragEvents = mcEvents.getDragEvents();
        mcEvents.addEventListener(grabbableElement, dragEvents.start, startEventHandler);
      };

      var updateTargets = function () {
        targets.setTargetConfig(scope.targets);
      }

      var getPositionDetails = function () {
        var positionDetails;
        if (collisionDetection !== 'cursor') {
          positionDetails = mcCollisions.getTranslatedDimensions(elementDimensions, elementPosition);
        }
        else {
          positionDetails = cursorPosition;
        }
        positionDetails.type = collisionDetection;
        return positionDetails;
      }

      // EVENT HANDLERS

      var startEventHandler = function (event) {
        event.preventDefault();
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

        var positionDetails = getPositionDetails();
        targets.setCurrentTarget(positionDetails, collisionDetection);

        targets.callHoverEvent(scope.returnedInfo, positionDetails);
      };

      var stopEventHandler = function (event) {
        var positionDetails = getPositionDetails();
        targets.callDropEvent(scope.returnedInfo, positionDetails);

        isCurrentlyMoving    = false;

        initialEventPosition = emptyCoordinates;
        elementPosition      = emptyCoordinates;
        cursorPosition       = emptyCoordinates;

        mcEvents.removeListener(document, dragEvents.move, moveEventHandler);
        mcEvents.removeListener(document, dragEvents.stop, stopEventHandler);
      };

      // ANIMATIONS

      var startAnimation = function () {
        mcCss.removeClasses(rootElement, classesWhileNotAnimating);
        mcCss.addClasses(rootElement, classesWhileAnimating);
        mcCss.addClass(body, 'no-select');
      };

      var moveAnimation = function () {
        mcCss.translateElement(rootElement, elementPosition);

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
        mcCss.removeClasses(rootElement, classesWhileAnimating);
        mcCss.addClasses(rootElement, classesWhileNotAnimating);
        mcCss.removeTranslation(rootElement);
      };

      var continueAnimation = function () {
        return isCurrentlyMoving;
      }

      setupDirective();
    }
  };
}]);