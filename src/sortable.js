angular.module('mc-drag-and-drop.mcSortable', ['mc-drag-and-drop.mcDraggable'])
.directive('mcSortableContainer', [
  '$compile', 'mcAnimation', 'mcCss', 'mcCollisions', 'mcEvents', 'DropTargets',
  function ($compile, mcAnimation, mcCss, mcCollisions, mcEvents, DropTargets) {
    return {
      restrict: 'A',
      scope: {
        sortBy: '=',
        hoverTemplate: '='
      },
      compile: function(element, attrs, controller, transclude) {
        var targetType = element.attr('mc-sortable-container');
        element.attr('mc-droppable', targetType);

        var childrenNodes = element.children();

        for (var i = 0; i < childrenNodes.length; i++) {
          var child = $(childrenNodes[i]);

          var repeats = child.attr('mc-sortable-item');
          var individualRepeatName = repeats.split(' in ')[0];

          child.attr('targets', individualRepeatName + '.targets');
          child.attr('returned-info', individualRepeatName);
          child.attr('confine-to', "'body'");
          child.attr('collision-detection', "'center'");
          child.attr('mc-draggable', '');
          child.attr('ng-repeat', repeats);
        };

        element.removeAttr('mc-sortable-container');
        return {
          pre:  function preLink(scope, iElement, iAttrs, controller) {},
          post: function postLink(scope, iElement, iAttrs, controller) {
            function translate () {
              for (var i = 0; i < iElement.children().length; i++) {
                // mcCss.translateElement(iElement.children()[i], {x:40, y:100})
              };
            }
            scope.$watch(iElement.children().length, translate)
          }
        };
      }
    };
  }]);
