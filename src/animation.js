angular.module('mc-drag-and-drop.mcAnimation', [])
.factory('mcAnimation', [function () {
  var _public = {};

  _public.requestFrame = function (callbackFunc) {
    requestAnimationFrame(callbackFunc);
  };

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

  _public.startAnimation = function (startAnimation, animationLoop, endAnimation, continueAnimation) {
    var loop = function () {
      animationLoop();
      continueAnimation() ? requestAnimationFrame(loop) : endAnimation();
    }
    startAnimation();
    requestAnimationFrame(loop);
  }

  return _public;
}]);