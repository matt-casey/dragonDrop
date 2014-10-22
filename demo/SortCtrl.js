/**
*/

'use strict';

angular.module('myApp').controller('SortCtrl', ['$scope', function($scope) {

  $scope.sortBy = 'priority';

  $scope.sortTemplate = 'demo/hover.html';
  $scope.sampleItem   = 'demo/sampleItem.html';

  $scope.things = [
    {
      priority: 1,
      name: 'thing A'
    },
    {
      priority: 3,
      name: 'thing B'
    },
    {
      priority: 5,
      name: 'thing C'
    }
  ]

}]);