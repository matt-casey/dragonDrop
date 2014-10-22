/**
*/

'use strict';

angular.module('myApp').controller('MainCtrl', ['$scope', function($scope) {
	$scope.list1 = [];
  $scope.list2 = [];
  $scope.list3 = [];

  var deleteEl = function (itemInfo) {
    console.log('delete', itemInfo);
    for (var i = $scope.items.length - 1; i >= 0; i--) {
      if ($scope.items[i].id === itemInfo) {
        $scope.items.splice(i,1);
      }
    };
  };

  var doubleEl = function (itemInfo) {
    $scope.list2.push(itemInfo);
  };

  var alertEl = function (itemInfo) {
    alert(itemInfo);
    console.log(itemInfo);
  };

  var consoleLogIt = function (itemInfo) {
    console.log('YES', itemInfo);
  };

  $scope.singleElement = {
    id: '342',
    collisionType: 'center',
    targets: [
      {
        type: 'type-2',
        onDrop:  doubleEl,
        onHover: undefined
      },
      {
        type: 'type-3',
        onDrop:  alertEl,
        onHover: consoleLogIt
      }
    ]
  };

  $scope.items = [
    {
      id: '0123',
      collisionType: 'cursor',
      name: 'item-1',
      targets: [
        {
          type: 'type-1',
          onDrop: deleteEl,
          onHover: undefined
        },
        {
          type: 'type-2',
          onDrop: doubleEl,
          onHover: undefined
        }
      ]
    },
    {
      id: '321',
      collisionType: 'partial',
      name: 'item-2',
      targets: [
        {
          type: 'type-2',
          onDrop: doubleEl,
          onHover: consoleLogIt
        },
        {
          type: 'type-1',
          onDrop: deleteEl,
          onHover: undefined
        }
      ]
    },
    {
      id: '3321',
      collisionType: 'complete',
      name: 'item-2',
      targets: [
        {
          type: 'type-2',
          onDrop: doubleEl,
          onHover: consoleLogIt
        }
      ]
    }
  ]

}]);