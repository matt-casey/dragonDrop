angular.module('mc-drag-and-drop.mcCss', [])
.factory('mcCss', [ function () {

  var _public = {};

  _public.translateElement = function (element, position) {
    element.style.transform = "translate3d(" + position.x + "px, " + position.y + "px, 0px)";
  };

  _public.removeTranslation = function (element) {
    element.style.transform = "translate3d( 0, 0, 0)";
  };

  _public.hasClass = function (element, className) {
    element.classList.contains(className);
  };

  _public.addClass = function (element, className) {
    element.classList.add(className);
  };

  _public.removeClass = function (element, className) {
    element.classList.remove(className);
  };

  _public.toggleClass = function (element, className) {
    element.classList.toggle(className);
  };

  _public.addClasses = function (element, classNames) {
    for (var i = classNames.length - 1; i >= 0; i--) {
      _public.addClass(element, classNames[i])
    };
  };

  _public.removeClasses = function (element, classNames) {
    for (var i = classNames.length - 1; i >= 0; i--) {
      _public.removeClass(element, classNames[i])
    };
  };

  _public.findByAttribute = function (attribute) {
    return document.querySelector(attribute);
  };

  _public.findAllByAttribute = function (attribute) {
    return document.querySelectorAll(attribute);
  };

  return _public;
}]);