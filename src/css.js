angular.module('mc-drag-and-drop.mcCss', [])
.factory('mcCss', [ function () {

  var _public = {};

  _public.translateElement = function (jqElement, position) {
    jqElement.css("-webkit-transform", "translate3d(" + position.x + "px, " + position.y + "px, 0px)");
  };

  _public.removeTranslation = function (jqElement) {
    jqElement.css("-webkit-transform", "translate3d( 0, 0, 0)");
  };

  _public.hasClass = function (jqElement, className) {
    jqElement[0].classList.contains(className);
  };

  _public.addClass = function (jqElement, className) {
    jqElement[0].classList.add(className);
  };

  _public.removeClass = function (jqElement, className) {
    jqElement[0].classList.remove(className);
  };

  _public.toggleClass = function (jqElement, className) {
    jqElement[0].classList.toggle(className);
  };

  _public.addClasses = function (jqElement, classNames) {
    for (var i = classNames.length - 1; i >= 0; i--) {
      _public.addClass(jqElement, classNames[i])
    };
  };

  _public.removeClasses = function (jqElement, classNames) {
    for (var i = classNames.length - 1; i >= 0; i--) {
      _public.removeClass(jqElement, classNames[i])
    };
  };

  _public.getElementDimensions = function (element) {
    var jqElement = $(element);
    var offset    = jqElement.offset();
    return {
      element:   element,
      jqElement: jqElement,

      left:      offset.left,
      right:     offset.left + jqElement.width(),
      top:       offset.top,
      bottom:    offset.top  + jqElement.height()
    };
  };

  _public.findByAttribute = function (attribute) {
    return document.querySelectorAll(attribute);
  };

  _public.checkOverlap = {
    cursor: function (position, dropped) {
      if ( position.x < dropped.right &&
           position.x > dropped.left  &&
           position.y > dropped.top   &&
           position.y < dropped.bottom ) {
        return true;
      }
      else {
        return false;
      }
    },
    partial: function () {

    },
    centerOfMass: function () {

    },
    complete: function () {

    }
  };

  _public.findOverlap = function (position, targets, type) {
    var overlapType = type || 'cursor';
    for (var i = 0; i < targets.length; i++) {
      if (_public.checkOverlap[overlapType](position, targets[i])) {
        return targets[i];
      }
    }
    return false;
  };

  return _public;
}]);