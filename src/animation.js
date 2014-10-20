angular.module('mc-drag-and-drop.mcAnimation', [])
.factory('mcAnimation', [function () {
  _public = {};

  _public.requestFrame = function (callbackFunc) {
    requestAnimationFrame(callbackFunc);
  }

  var requestAnimationFrame = (function () {
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
  })();

  return _public;
}]);