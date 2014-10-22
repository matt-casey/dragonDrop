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

  $scope.addJoe = function () {
    $scope.things.push({
      id: '0123',
      priority: '0123',
      collisionType: 'cursor',
      name: 'joey',
      targets: [
        {
          type: 'column-1',
          onDrop: sortEl,
          onHover: sortEl
        },
        {
          type: 'column-2',
          onDrop: sortEl,
          onHover: sortEl
        }
      ]
    })
  }

  $scope.thingsTwo = [];

  $scope.things = [
    {
      id: '0123',
      priority: '0123',
      collisionType: 'cursor',
      name: 'item-1',
      targets: [
        {
          type: 'column-1',
          onDrop: sortEl,
          onHover: sortEl
        },
        {
          type: 'column-2',
          onDrop: sortEl,
          onHover: sortEl
        }
      ]
    },
    {
      id: '321',
      priority: '321',
      collisionType: 'partial',
      name: 'item-2',
      targets: [
        {
          type: 'column-1',
          onDrop: sortEl,
          onHover: undefined
        },
        {
          type: 'column-2',
          onDrop: sortEl,
          onHover: sortEl
        }
      ]
    },
    {
      id: '3321',
      priority: '3321',
      collisionType: 'complete',
      name: 'item-2',
      targets: [
        {
          type: 'column-1',
          onDrop: sortEl,
          onHover: undefined
        },
        {
          type: 'column-2',
          onDrop: sortEl,
          onHover: sortEl
        }
      ]
    }
  ]

}]);