angular.module('mc-drag-and-drop.mcEvents', [])
.factory('mcEvents', ['hasTouchEvents', 'isAndroid', function (hasTouchEvents, isAndroid) {
  var _public = {};

  _public.getDragEvents = function () {
    return {
      start: (hasTouchEvents ? "touchstart" : "mousedown"),
      move:  (hasTouchEvents ? "touchmove"  : "mousemove"),
      stop:  (hasTouchEvents ? "touchend"   : "mouseup"  )
    };
  };

  _public.getEventCoordinates = function (event) {
    return {
      x: (isAndroid ? event.changedTouches[0].pageX : event.pageX),
      y: (isAndroid ? event.changedTouches[0].pageY : event.pageY)
    };
  };

  _public.diffPositions = function (a, b) {
    return {
      x: (a.x - b.x),
      y: (a.y - b.y)
    };
  };

  _public.addEventListener = function (watchedElement, event, onEvent) {
    watchedElement.addEventListener(event, onEvent, false);
  };

  _public.removeListener = function (watchedElement, event, onEvent) {
    watchedElement.removeEventListener(event, onEvent, false);
  };

  _public.addWindowResizeListener = function (callback) {
    window.onresize = function (event) {
      callback(event);
    };
  }

  return _public;
}]);