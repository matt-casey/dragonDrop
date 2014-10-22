angular.module('mc-drag-and-drop.mcSortable', ['mc-drag-and-drop.mcDraggable'])
.directive('mcSortableContainer', [
  '$compile', 'mcAnimation', 'mcCss', 'mcCollisions', 'mcEvents', 'DropTargets',
  function ($compile, mcAnimation, mcCss, mcCollisions, mcEvents, DropTargets) {
    var repeatName;
    return {
      restrict: 'A',
      scope: {
        sortBy: '=',
        feedTo: '='
      },
      compile: function(element, attrs, controller, transclude) {
        var targetType = element.attr('mc-sortable-container');
        element.attr('mc-droppable', targetType);

        var childrenNodes = element.children();

        for (var i = 0; i < childrenNodes.length; i++) {
          var child = $(childrenNodes[i]);
          if (child.attr('mc-sortable-item') !== undefined) {
            var repeats = child.attr('mc-sortable-item');
            repeatName = repeats.split(' in ')[0];

            child.attr('targets', repeatName + '.targets');
            child.attr('returned-info', repeatName);
            child.attr('confine-to', "'body'");
            child.attr('collision-detection', "'center'");
            child.attr('priority', "'body'");
            child.attr('mc-draggable', '');
            child.attr('ng-repeat', repeats + "| orderBy:" + "'priority'");
          }
          else if (child.attr('mc-sortable-place-holder') !== undefined) {
            mcCss.setStyle(child[0], 'display', 'none');
          };

        };

        element.removeAttr('mc-sortable-container');
        return {
          pre:  function preLink(scope, iElement, iAttrs, controller) {},
          post: function postLink(scope, iElement, iAttrs, controller) {
            var rootElement = iElement[0];
            var containerType = iElement.attr('mc-droppable');
            var children = [];
            var rankings = [];

            var getChildrenLength = function () {
              return rootElement.children.length;
            };

            var updateChildren = function (newCount, oldCount) {
              children = getChildren();
              sizeChildren();
              setChildScopes();
              rankChildren();
              addAllowedColumns();
            };

            var getChildren = function () {
              var tempChildren = [];
              var newDomNodes = rootElement.children;

              for (var i = 0; i < newDomNodes.length; i++) {
                var child = newDomNodes[i];

                if (mcCss.hasAttribute(child, 'mc-sortable-item')) {
                  tempChildren.push(child);
                }
                else{
                };
              };

              return tempChildren;
            };

            var sizeChildren = function () {
              for (var i = 0; i < children.length; i++) {
                children[i].dimensions = mcCollisions.getElementDimensions(children[i]);
              };
            };

            var setChildScopes = function () {
              for (var i = 0; i < children.length; i++) {
                children[i].scope = angular.element(children[i]).scope();
              };
            };

            var rankChildren = function () {
              rankings = [];
              for (var i = 0; i < children.length; i++) {
                var rank = {index: i, priority: getChildProperty(children[i], scope.sortBy)};
                rankings.push(rank);
              };
              rankings.sort(function(a, b) {
                return parseInt(a.priority) - parseInt(b.priority)
              });
              for (var i = 0; i < rankings.length; i++) {
                setChildProperty(children[rankings[i].index], 'ranking', i);
              };
            };

            var addAllowedColumns = function () {
              for (var i = 0; i < children.length; i++) {
                var currentTargets = getChildProperty(children[i], 'targets');
                currentTargets.push(makeSortableTarget(containerType));
                currentTargets.push(makeSortableTarget(scope.feedTo));
                setChildProperty(children[i], 'targets', currentTargets);
              };
            };

            var isAnimating = false;
            var movingElement;
            var movingEvent;
            var cutoff;

            var startAnimation = function() {
              cutoff = currentlyOver(movingEvent);
              moveChildren();
            };
            var moveAnimation = function () {
              cutoff = currentlyOver(movingEvent);
              moveChildren(cutoff);
            };
            var endAnimation = function () {
              for (var i = 0; i < children.length; i++) {
                mcCss.removeTranslation(children[i]);
              };
            };
            var continueAnimation = function () {
              return isAnimating;
            };

            var hoverEventHandler = function (item, eventDetails) {
              movingEvent = eventDetails;
              if (!isAnimating) {
                isAnimating = true;
                movingElement = item;
                mcAnimation.startAnimation(startAnimation, moveAnimation, endAnimation, continueAnimation);
              };
            }

            var moveChildren = function (cutoff) {
              for (var i = 0; i < children.length; i++) {
                var current =getChildProperty(children[i], 'priority');
                if (current !== movingElement.priority) {
                  if (current >= cutoff) {
                    mcCss.translateElement(children[i], {x: 0, y: movingEvent.height});
                  }
                  else if ((current < cutoff) && (current > movingElement.priority)) {
                    mcCss.translateElement(children[i], {x: 0, y: (movingEvent.height)});
                  }
                  else{
                    mcCss.removeTranslation(children[i]);
                  }
                }
                else {
                }
              };
            }

            var currentPriority = function () {

            }

            var currentlyOver = function (eventDetails) {
              for (var i = 0; i < children.length; i++) {
                var childDimensions = children[i].dimensions;
                if (mcCollisions.checkOverlap.center(eventDetails, childDimensions)) {
                  return getChildProperty(children[i], 'priority');
                }
              };
              return 100000;
            }

            var changePriorities = function (item, eventDetails) {
              isAnimating = false;
              if (cutoff !== movingElement.priority) {
                for (var i = 0; i < children.length; i++) {
                  var current = getChildProperty(children[i], 'priority');
                  if (current === movingElement.priority) {
                    setChildProperty(children[i], 'priority', cutoff)
                  }
                  else if (current >= cutoff) {
                    setChildProperty(children[i], 'priority', (parseInt(current) + 1))
                  }
                  else if ((current < cutoff) && (current > movingElement.priority)) {
                    setChildProperty(children[i], 'priority', (parseInt(current) - 1))
                  }
                };
              };
            }

            var makeSortableTarget = function (name) {
              return {
                type: name,
                onDrop:  function (item, eventDetails) { changePriorities(item, eventDetails) },
                onHover: function (item, eventDetails) { hoverEventHandler(item, eventDetails) }
              }
            };

            var getChildProperty = function (child, property) {
              return child.scope[repeatName][property];
            };

            var setChildProperty = function (child, property, value) {
              child.scope[repeatName][property] = value;
            };

            scope.$watch(getChildrenLength, updateChildren);
          }
        };
      }
    };
  }]);
