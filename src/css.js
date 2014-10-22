angular.module('mc-drag-and-drop.mcCss', [])
.factory('mcCss', [ function () {

  var _public = {};

  _public.translateElement = function (element, position) {
    element.style.transform = "translate3d(" + position.x + "px, " + position.y + "px, 0px)";
  };

  _public.removeTranslation = function (element) {
    element.style.transform = "translate3d( 0, 0, 0)";
  };

  _public.setStyle = function (element, style, value) {
    element.style[style] = value;
  }

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
      _public.addClass(element, classNames[i]);
    };
  };

  _public.removeClasses = function (element, classNames) {
    for (var i = classNames.length - 1; i >= 0; i--) {
      _public.removeClass(element, classNames[i]);
    };
  };

  _public.setAttribute = function (element, attribute, value) {
    element.setAttribute(attribute, value);
  }

  _public.hasAttribute = function (element, attribute) {
    return element.hasAttribute(attribute);
  }

  _public.findByAttribute = function (attribute, elementToSearch) {
    var element = elementToSearch || document;
    return element.querySelector(attribute);
  };

  _public.findAllByAttribute = function (attribute, elementToSearch) {
    var element = elementToSearch || document;
    return element.querySelectorAll(attribute);
  };

  return _public;
}]);