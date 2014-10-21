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
    var width     = jqElement.width();
    var height     = jqElement.height();
    return {
      element:   element,
      jqElement: jqElement,

      width:     width,
      height:    height,

      left:      offset.left,
      right:     offset.left + width,
      top:       offset.top,
      bottom:    offset.top  + height
    };
  };

  _public.findByAttribute = function (attribute) {
    return document.querySelectorAll(attribute);
  };

  var isPointWithinBox = function (point, box) {
    if ( point.x < box.right &&
         point.x > box.left  &&
         point.y > box.top   &&
         point.y < box.bottom ) {
      return true;
    }
    else {
      return false;
    }
  }

  _public.checkOverlap = {
    cursor: function (cursorPosition, target) {
      return isPointWithinBox(cursorPosition, target);
    },
    partial: function () {

    },
    centerOfMass: function (offsetPosition, dimensions, target) {
      var centerPosition = {};
      centerPosition.x = offsetPosition.x + (dimensions.width / 2);
      centerPosition.y = offsetPosition.y + (dimensions.height / 2);
      return isPointWithinBox(centerPosition, target);
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