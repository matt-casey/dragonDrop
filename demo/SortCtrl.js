/**
*/

'use strict';

angular.module('myApp').controller('SortCtrl', ['$scope', function($scope) {

  $scope.sortBy = 'priority';

  $scope.sortTemplate = 'demo/hover.html';
  $scope.sampleItem   = 'demo/sampleItem.html';

  var sortEl = function (id) {
    console.log('asdf', id);
  };

  var deleteEl = function (item) {
    for (var i = 0; i < $scope.things.length; i++) {
      if ($scope.things[i].id === item.id) {
        $scope.things.splice(i, 1);
      }
    };
  }

  $scope.removeItem = function () {
    $scope.things.pop();
  };

  $scope.addJoe = function () {
    $scope.things.push({
      id: '0123',
      priority: '1',
      collisionType: 'cursor',
      name: 'joey',
      targets: [
        {
          type: 'trash',
          onDrop: deleteEl,
          onHover: sortEl
        }
      ]
    })
  };

  $scope.thingsTwo = [];

  $scope.things = [
    {
      id: '0123',
      priority: 0,
      collisionType: 'cursor',
      name: 'item-A',
      targets: [
        {
          type: 'trash',
          onDrop: deleteEl,
          onHover: sortEl
        }
      ]
    },
    {
      id: '321',
      priority: 2,
      collisionType: 'partial',
      name: 'item-B',
      targets: [
        {
          type: 'trash',
          onDrop: deleteEl,
          onHover: undefined
        }
      ]
    },
    {
      id: '3321',
      priority: 3,
      collisionType: 'complete',
      name: 'item-C',
      targets: [
        {
          type: 'trash',
          onDrop: deleteEl,
          onHover: undefined
        }
      ]
    }
  ]

}]);