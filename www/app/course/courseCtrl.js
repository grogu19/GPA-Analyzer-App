(function() {
  'use strict';

  angular
    .module('gpaApp.controllers')
    .controller('courseCtrl', courseCtrl);

  courseCtrl.$inject = ['$stateParams','Course','$scope','$state','$ionicHistory'];

  function courseCtrl($stateParams, Course, $scope, $state, $ionicHistory) {
    var vm = this;
    $scope.course = [];
    $scope.course = null;
    $scope.semName =$stateParams.semName;
    $scope.studid = $stateParams.id;
    console.log("$stateParams",$stateParams);
    var id = $stateParams.id;
    var semName = $stateParams.semName;
    
    $scope.goToCourse = function(){
      $ionicHistory.clearCache();
      $state.go("course.courseList",{
          id:id,
          semName:semName
        });
    }

    $scope.addCo = function(){
        $state.go("course.addCourse",{
          id:id,
          semName:semName
        });
      }

    $scope.goBack = function(course){
      var studID = $stateParams.id;
      $state.go("student.semester",{
          id:$stateParams.id
        });
    }

    $scope.updateCourse = function(studid, semName) {
        Course.get(studid, semName).then(function(course){
          $scope.course = course;
          console.log(course);
        });
      }

      $scope.updateCourse(id, semName);
      
      $scope.addCourses = function(course) {
        course.stuid =id;
        course.semName = semName;
        Course.add(course).then(function(course,id,semName){
           $scope.course = course;
         });
        $scope.closeCourseModal(); 
           $scope.updateCourse(id, semName);      
      };
      //update view on form submit
      $scope.$on('updateCourseListEvent', function(event) {
       $scope.updateCourse(id,semName); 
       $state.go('course.courseList',$state.current.params, {reload: true});
      });


      


      
  }
})();
(function() {
  'use strict';

  angular
    .module('gpaApp')
    .controller('courseModalCtrl', courseModalCtrl);

  courseModalCtrl.$inject = ['$scope','$ionicModal'];

  function courseModalCtrl($scope,$ionicModal) {
    $ionicModal.fromTemplateUrl('app/course/addCourse.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(courseModal) {
        $scope.courseModal = courseModal;
      });


      $scope.openCourseModal = function(actionDel) {
        $scope.actionDel = actionDel;
        $scope.courseModal.show();
      };
      
      $scope.closeCourseModal = function() {
        $scope.$emit('updateCourseListEvent'); 
        $scope.courseModal.hide();
      };
      //Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.courseModal.remove();
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