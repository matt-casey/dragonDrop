/**
*/

'use strict';

angular.module('myApp').controller('MainCtrl', ['$scope', function($scope) {
	$scope.list1 = [];
  $scope.list2 = [];
  $scope.list3 = [];

  // $scope.things = [
  //   {
  //     targets: {
  //       'type-1':someFunction
  //     }
  //   }
  // ]

  $scope.deleteEl = function () {

  }
  $scope.doubleEl = function (el, scope) {
    $scope.list2.push(scope.$parent.thing.name);
    console.log(el, scope);
  }
  $scope.alertEl = function (el, scope) {
    alert(el);
    console.log(el, scope);
  }
}]);