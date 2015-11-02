angular.module('gpaApp.controllers', ['gpaApp.services'])

.controller('StudCtrl', function($scope, Student) {
  $scope.stud = [];
  $scope.stud = null;

  $scope.updateStudent = function() {
    Student.all().then(function(stud){
      $scope.stud = stud;
    });
  }

  $scope.updateStudent();

  $scope.addStudent = function(stud) {
    Student.add(stud);
    $scope.updateStudent();
  };

})