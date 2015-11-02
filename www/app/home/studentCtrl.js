(function() {
	'use strict';

	angular
	  .module('gpaApp.controllers', ['gpaApp.services'])
	  .controller('studentCtrl', function($scope, Student, $ionicHistory, $state, $stateParams) {
		  $scope.stud = [];
		  $scope.stud = null;
		  
		  $scope.inst={};
		  $scope.instructorList = [];
		  $scope.instructorList = null;
		  $scope.courseList = [];
		  $scope.courseList = null;
		  $scope.gradeList = [];
		  $scope.gradeList = null;
		  $scope.stuList = [];
		  $scope.stuList = null;
		  $scope.inName = $stateParams.name;
		  $scope.updateStudent = function() {
		    Student.all().then(function(stud){
		      $scope.stud = stud;
		    });
		  }

		  $scope.updateStudent();

		  $scope.addStudent = function(stud) {
		    Student.add(stud);
		    $scope.$emit('updateListEvent');
		  }

		  $scope.$on('updateListEvent', function(event) {
		   $scope.updateStudent();
		    $state.go('home.studentList',{}, {reload: true});
			});

		  $scope.removeStudent = function(stud) {
		    Team.remove(member);
		    $scope.updateStudent();
		  }
		  
		  $scope.editStudent = function(origstud, editstud) {
		    Team.update(origstud, editstud);
		    $scope.updateStudent();
		  }

		  $scope.searchInst = function() {
		    Student.searchInst($scope.instName).then(function(instructorList){
		      $scope.instructorList = instructorList;
		    });
		    
		  }

		  $scope.searchCourse = function() {
		    Student.searchCourse($scope.inName).then(function(courseList){
		      $scope.courseList = courseList;
		    });
		  }

		  $scope.searchGrade = function(cname) {
		  	if(cname!=null || cname!="")
		    Student.searchGrade($scope.inName,cname).then(function(gradeList){
		      $scope.gradeList = gradeList;
		    });
		   
		    
		  }

		  $scope.searchStu = function(inst) {
		    Student.searchStu($scope.inName,inst.course,inst.grade).then(function(stuList){
		      $scope.stuList = stuList;
		      console.log(stuList);
		    });
		   }
		});
})();
