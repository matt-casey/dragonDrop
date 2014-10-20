angular.module('mc-drag-and-drop.mcDraggable', [
  'mc-drag-and-drop.mcCss',
  'mc-drag-and-drop.mcAnimation',
  'mc-drag-and-drop.mcEvents'
])
.directive('mcDraggable', ['mcAnimation', 'mcCss', 'mcEvents', function (mcAnimation, mcCss, mcEvents) {

  var classesWhileAnimating    = ['being-dragged'];
  var classesWhileNotAnimating = ['return-animation'];

  var emptyCoordinates = { x:0, y:0 };
  var initialEventPosition = emptyCoordinates;
  var cursorPosition       = emptyCoordinates;
  var elementPosition      = emptyCoordinates;

  var body;
  var dropTargets;
  var currentTarget;
  var previousTarget;
  var elementBounds;

  var isCurrentlyMoving;
  var dragEvents;

  var getDropTargets = function (targetList) {
    var tempTargets = [];

    for (var i = 0; i < targetList.length; i++) {
      var attributeName = '[mc-droppable=' + targetList[i].type + ']';
      var elementList = mcCss.findByAttribute(attributeName);

      for (var j = 0; j < elementList.length; j++) {
        var tempTarget = constructTarget(elementList[j], targetList[i])
        tempTargets.push(tempTarget);
      }
    }
    return tempTargets;
  };

  var constructTarget = function (element, targetInfo) {
    var tempTarget = mcCss.getElementDimensions(element);

    mcCss.addClass(tempTarget.jqElement, 'droppable');

    tempTarget.onDrop  = targetInfo.onDrop;
    tempTarget.onHover = targetInfo.onHover;

    return tempTarget;
  };

  return {
    restrict: 'A',
    scope: {
      itemInfo: '=',
      targets: '='
    },
    link: function(scope, element, attrs) {

      var setupDirective = function () {
        mcCss.addClass(element, 'draggable');
        body = $('body');

        setDropTargets();
        mcEvents.addWindowResizeListener(setDropTargets);

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

        currentTarget = mcCss.findOverlap(cursorPosition, dropTargets, 'cursor');

        callHoverEvent();
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

        mcEvents.removeListener(document, dragEvents.move, moveEventHandler);
        mcEvents.removeListener(document, dragEvents.stop, stopEventHandler);
      };

      // DROP TARGETS

      var setDropTargets = function () {
        dropTargets = getDropTargets(scope.targets);
      }

      var callDropEvent = function () {
        currentTarget.onDrop && currentTarget.onDrop(element, scope);
        scope.$apply();
      };

      var callHoverEvent = function () {
        currentTarget.onHover && currentTarget.onHover(element, scope);
        scope.$apply();
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

        if (previousTarget) {
          mcCss.removeClass(previousTarget.jqElement, 'hover');
        }
        if (currentTarget) {
          mcCss.addClass(currentTarget.jqElement, 'hover');
          previousTarget = currentTarget;
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