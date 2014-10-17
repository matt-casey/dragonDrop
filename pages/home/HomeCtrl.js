/**
*/

'use strict';

angular.module('myApp').controller('HomeCtrl', ['$scope', function($scope) {
	$scope.list1 = [];
  $scope.list2 = [];
  $scope.list3 = [];

  $scope.things = [
    {
      name: 'thing 1',
      targets: ['type-1', 'type-2'],
      dropFunctions:  [$scope.deleteEl, $scope.doubleEl]
    },
    {
      name: 'thing 2',
      targets: ['type-2'],
      dropFunctions:  [$scope.doubleEl]
    },
    {
      name: 'thing 3',
      targets: ['type-1', 'type-3'],
      dropFunctions:  [$scope.deleteEl, $scope.alertEl]
    }
  ]

  $scope.deleteEl = function () {

  }
  $scope.doubleEl = function (el, scope) {

  }
  $scope.alertEl = function (el, scope) {
    alert(el);
    console.log(el, scope);
  }
}]);