angular.module('mc-drag-and-drop.mcCollisions', [
  'mc-drag-and-drop.mcCss'
])
.factory('mcCollisions', ['mcCss', function (mcCss) {

  var _public = {};

  _public.getElementDimensions = function (element) {
    var jqElement = $(element);
    var offset    = jqElement.offset();
    var width     = jqElement.width();
    var height    = jqElement.height();
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

  _public.getTranslatedDimensions = function (dimensions, translation) {
    var newDimensions = {};

    newDimensions.width  = dimensions.width;
    newDimensions.height = dimensions.height;

    newDimensions.left   = dimensions.left   + translation.x;
    newDimensions.right  = dimensions.right  + translation.x;
    newDimensions.top    = dimensions.top    + translation.y;
    newDimensions.bottom = dimensions.bottom + translation.y;

    return newDimensions;
  }

  _public.getBoundedPosition = function (unboundedPosition, elementDimensions, translationBounds) {
    var newPosition = {};

    var attemptedDimensions = _public.getTranslatedDimensions(elementDimensions, unboundedPosition);

    if (attemptedDimensions.left <= translationBounds.left) {
      newPosition.x = translationBounds.left - elementDimensions.left;
    }
    else if (attemptedDimensions.right >= translationBounds.right) {
      newPosition.x = translationBounds.right - elementDimensions.right;
    }
    else{
      newPosition.x = unboundedPosition.x;
    };

    if (attemptedDimensions.top <= translationBounds.top) {
      newPosition.y = translationBounds.top - elementDimensions.top;
    }
    else if (attemptedDimensions.bottom >= translationBounds.bottom) {
      newPosition.y = translationBounds.bottom - elementDimensions.bottom;
    }
    else{
      newPosition.y = unboundedPosition.y;
    };


    return newPosition;
  }

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

    partial: function (elementEdges, target) {
      var topLeft     = { x: elementEdges.left,  y: elementEdges.top    };
      var topRight    = { x: elementEdges.right, y: elementEdges.top    };
      var bottomLeft  = { x: elementEdges.left,  y: elementEdges.bottom };
      var bottomRight = { x: elementEdges.right, y: elementEdges.bottom };
      return isPointWithinBox(topLeft,     target) ||
             isPointWithinBox(topRight,    target) ||
             isPointWithinBox(bottomLeft,  target) ||
             isPointWithinBox(bottomRight, target);
    },

    center: function (elementEdges, target) {
      var centerPosition = {};
      centerPosition.x = elementEdges.left + (elementEdges.width  / 2);
      centerPosition.y = elementEdges.top  + (elementEdges.height / 2);
      return isPointWithinBox(centerPosition, target);
    },

    complete: function (elementEdges, target) {
      var topLeft     = { x: elementEdges.left,  y: elementEdges.top    };
      var bottomRight = { x: elementEdges.right, y: elementEdges.bottom };
      return isPointWithinBox(topLeft,     target) &&
             isPointWithinBox(bottomRight, target);
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