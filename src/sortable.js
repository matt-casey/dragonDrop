angular.module('mc-drag-and-drop.mcSortable', ['mc-drag-and-drop.mcDraggable'])
.directive('mcSortable', [
  '$compile', 'mcAnimation', 'mcCss', 'mcCollisions', 'mcEvents', 'DropTargets',
  function ($compile, mcAnimation, mcCss, mcCollisions, mcEvents, DropTargets) {
    return {
      restrict: 'A',
      priority: 1,
      // require: '^mcSortableContainer',
      compile: function(element, attrs, controller, transclude) {
        element.attr('mc-draggable', 'test');
        element.attr('targets', 'tester');
        var repeats = element.attr('mc-sortable');
        element.attr('ng-repeat', repeats);
        element.removeAttr('mc-sortable');
        return {
          pre: function preLink(scope, iElement, iAttrs, controller) {  },
          post: function postLink(scope, iElement, iAttrs, controller) {
            scope.tester = ['one', 'two'];
            $compile(iElement)(scope);
          }
        };
      }
    };
  }])
.directive('mcSortableContainer', [
  '$compile', 'mcAnimation', 'mcCss', 'mcCollisions', 'mcEvents', 'DropTargets',
  function ($compile, mcAnimation, mcCss, mcCollisions, mcEvents, DropTargets) {
    return {
      restrict: 'E',
      compile: function () {

      },
      link: function () {

      }
    };
  }]);