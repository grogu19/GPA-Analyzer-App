(function() {
	'use strict';

	angular
	  .module('gpaApp.controllers')
	  .controller('studDetailCtrl', studDetailCtrl);

	studDetailCtrl.$inject = ['$stateParams','$ionicHistory','Semester', '$scope','$state','$ionicModal','$ionicNavBarDelegate','Student'];

	function studDetailCtrl($stateParams, $ionicHistory, Semester, $scope, $state, $ionicModal, $ionicNavBarDelegate,Student) {
		var vm = this;
		$scope.student = [];
		$scope.student = null;

		$scope.sem = [];
		$scope.sem = null;

		$scope.gpaList = [];
		$scope.cgpaList = [];
		

		$scope.studname =$stateParams.name;
		$scope.studid = $stateParams.id;
		console.log("$stateParams",$stateParams);
		var id = $stateParams.id;

		$scope.goBack = function(){
			$ionicHistory.clearCache();
			$ionicHistory.goBack();
			$state.go('home.studentList',{}, {reload: true});
		}
		$scope.toProfile = function($event) {
			//"#/profile/more/"
			$event.preventDefault();
			$state.go('student.profile', {
			id: $stateParams.id
			});
			$scope.getStudentById($stateParams.id);
		}

		$scope.toSem = function($event) {
			//"#/profile/more/"
			$event.preventDefault();
			$state.go('student.semester', {
			id: $stateParams.id
			});
			$scope.getStudentById($stateParams.id);
		}

		$scope.toDash = function($event) {
			//"#/profile/more/"
			$event.preventDefault();
			$state.go('student.dash', {
										id: $stateParams.id
										});
			$scope.getStudentById($stateParams.id);

		}

		$scope.getStudentById = function(studId) {
			if(studId!=null){
		        Student.getStudentById(studId).then(function(student){
		          $scope.student = student;
		          	$scope.getCgpa();
					$scope.getGpaBySemester();
		        });
		        
			}

      	}
       $scope.getStudentById($stateParams.id);
		
		$scope.updateSemester = function(studid) {
		    Semester.get(studid).then(function(sem){
		      $scope.sem = sem;
		    });
		}

		  $scope.updateSemester(id);

		  $scope.addSem = function(sem) {
		  	var year = new Date(sem.year);
		  	var session=sem.session+" "+year.getFullYear();
		    Semester.add(session,id);
		    
		    $scope.$emit('updateSemListEvent');
		    $scope.closeModal();
		  }

		  $scope.$on('updateSemListEvent', function(event) {
			   $scope.updateSemester(id); 
			   $state.go($state.current,$state.current.params, {reload: true});
			});
		  
		$scope.deleteSem = function(sem) {
	         Semester.remove(sem).then(function(sem){
	           $scope.sem = sem;
	         });
          
          $scope.updateSemester(id);  
      	}

      	$scope.getGpaBySemester = function() {
	         Semester.getSemCoursesGrade($scope.student.STUDENT_ID).then(function(gpaList){
	           $scope.gpaList = gpaList;
	         });
            console.log("sem grades",$scope.gpaList);
      	}
      	
      	$scope.getCgpa = function(){
      		Semester.getAllCoursesGrade($scope.student.STUDENT_ID).then(function(cgpaList){
	           $scope.cgpaList = cgpaList;
	         });
	      	console.log("cgpa",$scope.cgpaList);	
      	}
	}	
})();
(function() {
	'use strict';

	angular
	  .module('gpaApp')
	  .controller('modalCtrl', modalCtrl);

	modalCtrl.$inject = ['$scope','$ionicModal'];

	function modalCtrl($scope,$ionicModal) {
		$ionicModal.fromTemplateUrl('app/student/addSemester.html', {
		    scope: $scope,
		    animation: 'slide-in-up'
		  }).then(function(modal) {
		    $scope.modal = modal;
		  });


		  $scope.openModal = function() {
		    $scope.modal.show();
		  };
		  $scope.closeModal = function() {
		  	$scope.$emit('updateSemListEvent');
		    $scope.modal.hide();
		  };
		  //Cleanup the modal when we're done with it!
		  $scope.$on('$destroy', function() {
		    $scope.modal.remove();
		  });
		  /*// Execute action on hide modal
		  $scope.$on('modal.hidden', function() {
		    // Execute action
		  });
		  // Execute action on remove modal
		  $scope.$on('modal.removed', function() {
		    // Execute action
		  });*/
	}
})();