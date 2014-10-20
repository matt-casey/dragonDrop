/**
*/

'use strict';

angular.module('myApp').controller('MainCtrl', ['$scope', function($scope) {
	$scope.list1 = [];
  $scope.list2 = [];
  $scope.list3 = [];

  var deleteEl = function (el, scope) {
    console.log('delete', el, scope);
    for (var i = $scope.items.length - 1; i >= 0; i--) {
      if ($scope.items[i].name === scope.identity) {
        $scope.items.splice(i,1);
      }
    };
  };

  var doubleEl = function (el, scope) {
    console.log(el, scope);
    $scope.list2.push(scope.identity);
  };

  var alertEl = function (el, scope) {
    alert(el);
    console.log(el, scope);
  };

  var consoleLogIt = function (el, scope) {
    console.log('YES', el);
  };

  $scope.singleElementTargets = [
    {
      type: 'type-2',
      onDrop:  doubleEl,
      onHover: undefined,
      onError: consoleLogIt
    }
  ]

  $scope.items = [
    {
      name: 'item-1',
      targets: [
        {
          type: 'type-1',
          onDrop: deleteEl,
          onHover: undefined,
          onError: consoleLogIt
        },
        {
          type: 'type-2',
          onDrop: doubleEl,
          onHover: undefined,
          onError: consoleLogIt
        }
      ]
    }
  ]

}]);