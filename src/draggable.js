angular.module('mc-drag-and-drop.mcDraggable', [
  'mc-drag-and-drop.mcCss',
  'mc-drag-and-drop.mcAnimation',
  'mc-drag-and-drop.mcEvents'
])

.factory('DropTargets', ['$rootScope', 'mcCss', 'mcEvents', function ($rootScope, mcCss, mcEvents) {
  var DropTargets = function () {

    var targetList = [];
    var rawList = [];
    var currentTarget;
    var previousTarget;

    var updateDropTargets = function (newRawList) {
      if (newRawList) {
        rawList = newRawList;
      };

      targetList = [];

      for (var i = 0; i < rawList.length; i++) {
        var attributeName = '[mc-droppable=' + rawList[i].type + ']';
        var elementList = mcCss.findByAttribute(attributeName);

        for (var j = 0; j < elementList.length; j++) {
          var tempTarget = constructTarget(elementList[j], rawList[i])
          targetList.push(tempTarget);
        }
      }
    };

    var constructTarget = function (element, targetInfo) {
      var tempTarget = mcCss.getElementDimensions(element);

      mcCss.addClass(tempTarget.jqElement, 'droppable');

      tempTarget.onDrop  = targetInfo.onDrop;
      tempTarget.onHover = targetInfo.onHover;

      return tempTarget;
    };

    var getTargets = function () {
      return targetList;
    };

    var setCurrentTarget = function (currentPosition) {
      currentTarget = mcCss.findOverlap(currentPosition, targetList, 'cursor');
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
      getTargets:         getTargets,
      setCurrentTarget:   setCurrentTarget,
      getCurrentTarget:   getCurrentTarget,
      setPreviousTarget:  setPreviousTarget,
      getPreviousTarget:  getPreviousTarget,
      updateDropTargets:  updateDropTargets,
      callDropEvent:      callDropEvent,
      callHoverEvent:     callHoverEvent
    }

  }
  return DropTargets;
}])

.directive('mcDraggable', ['mcAnimation', 'mcCss', 'mcEvents', 'DropTargets', function (mcAnimation, mcCss, mcEvents, DropTargets) {

  var classesWhileAnimating    = ['being-dragged'];
  var classesWhileNotAnimating = ['return-animation'];

  var emptyCoordinates = { x:0, y:0 };
  var initialEventPosition = emptyCoordinates;
  var cursorPosition       = emptyCoordinates;
  var elementPosition      = emptyCoordinates;

  var body;
  var elementBounds;

  var isCurrentlyMoving;
  var dragEvents;

  return {
    restrict: 'A',
    scope: {
      itemInfo: '=',
      targets: '=',
      returnedInfo: '='
    },
    link: function(scope, element, attrs) {
      var targets;

      var setupDirective = function () {
        mcCss.addClass(element, 'draggable');
        body = $('body');

        targets = new DropTargets();
        targets.updateDropTargets(scope.targets);
        mcEvents.addWindowResizeListener(targets.updateDropTargets);

        dragEvents = mcEvents.getDragEvents();
        mcEvents.addEventListener(element[0], dragEvents.start, startEventHandler);
      };

      // EVENT HANDLERS

      var startEventHandler = function (event) {
        isCurrentlyMoving = true;

        initialEventPosition = mcEvents.getEventCoordinates(event);
        cursorPosition       = mcEvents.getEventCoordinates(event);

        mcEvents.addEventListener(document, dragEvents.move, moveEventHandler);
        mcEvents.addEventListener(document, dragEvents.stop, stopEventHandler);

        startAnimation();
      };

      var moveEventHandler = function (event) {
        cursorPosition = mcEvents.getEventCoordinates(event);
        elementPosition = mcEvents.diffPositions(cursorPosition, initialEventPosition);

        targets.setCurrentTarget(cursorPosition);
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
        mcCss.removeClasses(element, classesWhileNotAnimating);
        mcCss.addClasses(element, classesWhileAnimating);
        mcCss.addClass(body, 'no-select');
        mcAnimation.requestFrame(animationLoop);
      };

      var animationLoop = function () {
        mcCss.translateElement(element, elementPosition);

        if (targets.getPreviousTarget()) {
          mcCss.removeClass(targets.getPreviousTarget().jqElement, 'hover');
        }
        if (targets.getCurrentTarget()) {
          mcCss.addClass(targets.getCurrentTarget().jqElement, 'hover');
          targets.setPreviousTarget(targets.getCurrentTarget());
        }

        isCurrentlyMoving ? mcAnimation.requestFrame(animationLoop) : endAnimation();
      };

      var endAnimation = function () {
        mcCss.removeClass(body, 'no-select');
        mcCss.removeClasses(element, classesWhileAnimating);
        mcCss.addClasses(element, classesWhileNotAnimating);
        mcCss.removeTranslation(element);
      };

      setupDirective();
    }
  };
}]);