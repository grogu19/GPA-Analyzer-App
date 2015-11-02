(function() {
  'use strict';

  angular
    .module('gpaApp.controllers')
    .controller('deliverCtrl', deliverCtrl);

  deliverCtrl.$inject = ['$stateParams','Course', '$scope','$q','$state','$ionicModal','$ionicHistory','$timeout'];

  function deliverCtrl($stateParams, Course, $scope, $q, $state, $ionicModal,$ionicHistory,$timeout) {
    var vm = this;
     $scope.course = [];
    $scope.course = null;

    $scope.deliverable = [];
    $scope.deliverable = null;
    $scope.deliv = {};
    
    $scope.rubrics = [];
    $scope.rubrics = null;

    
    $scope.weightageTotal = 100;
    $scope.grade = null;

    $scope.rubricsDash = [];
    $scope.rubricsDash = null;

    $scope.semName =$stateParams.semName;
    $scope.studid = $stateParams.id;
    $scope.courseId = $stateParams.courseId;
    console.log("$stateParams",$stateParams);
    var courseId = $stateParams.courseId;;
    var deliverable = {};

    $scope.getCourseById = function() {
        Course.getCourseById($stateParams.courseId).then(function(course){
          $scope.course = course;
          console.log($scope.course);
        });
      }
       $scope.getCourseById();
    $scope.goBack = function(){
      /*$ionicHistory.clearCache();
      $ionicHistory.goBack();*/
      $state.go('course.courseList',{id:$scope.course.STUDENT_ID, semName:$scope.course.SEM_NAME}, {reload: true});
      
    }

    $scope.onReload = function() {
      console.warn('reload');
      var deferred = $q.defer();
      setTimeout(function() {
        deferred.resolve(true);
      }, 1000);
      return deferred.promise;
    }

    $scope.getCoursePercent = function(){
      var rubricPerTotal=0;
      var scorePerTotal =0;

      angular.forEach($scope.rubrics,function(rub){
           angular.forEach($scope.rubricsDash,function(dashRub){
            var rubricPercent = 0;
           if(dashRub.RUBRIC_NAME == rub.NAME)
           {
            rubricPercent = ((rub.PER_WEIGHT/100)*((dashRub.RUBRIC_SCORE/dashRub.RUBRIC_TOTAL)*100));
            rubricPerTotal += rub.PER_WEIGHT;
           }
          
          scorePerTotal += rubricPercent;
         });
           
       });
      return ((scorePerTotal/rubricPerTotal)*100);
    }

    $scope.getCourseGrade = function(){
      
      var currentCourse = $scope.course;
      var coursePercent = $scope.getCoursePercent();
      var grade =null;
      var points =null;
      var amin = currentCourse.A_MIN+0.001;
      var bmin = currentCourse.B_MIN+0.001;
      var bmax = currentCourse.B_MAX+0.99;
      var cmin = currentCourse.C_MIN+0.001;
      var cmax = currentCourse.C_MAX+0.99;
      var dmin = currentCourse.D_MIN+0.001;
      var dmax = currentCourse.D_MAX+0.99;
      var fmax = currentCourse.F_MAX+0.99;
      console.log(currentCourse.A_MIN);
          switch(true){
            case (coursePercent >= amin):
            
              grade = "A";
              points =4.00;
            
            break;
            case (coursePercent <= bmax && coursePercent >= bmin):
            
              grade = "B";
              points =3.00;
            
            break;
            case (coursePercent <= cmax && coursePercent >= cmin):
            
              grade = "C";
              points =2.00;
            
            break;
            case (coursePercent <= dmax && coursePercent >= dmin):
            
              grade = "D";
              points =1.00;
            
            break;
            case (coursePercent <= fmax):
            
              grade = "F";
              points =0.00;
            
            break;
            default:
          
              grade = "NA";
              points =-1;
            
            break;
          }
        if((grade!= currentCourse.GRADE && grade!=null) || (points!= currentCourse.GRADE_POINT && points!=null)){
          Course.updateCourseGradeById($scope.course.COURSE_ID,grade,points).then(function(course){
                      $scope.course = course;
                      console.log("updated grade",course.GRADE);
                    });
        }

        $scope.grade = grade;
    }
    
    $scope.toRubricList = function($event) {
      
      $event.preventDefault();
      $state.go('deliverable.rubricsType', {
        courseId: $stateParams.courseId
      });
       
      $scope.$emit('updateRubicListEvent');
      
    }
    $scope.toDelivList = function($event) {
      $scope.doRefresh();
      $event.preventDefault();
      $state.go('deliverable.deliverableList', {
        courseId: $stateParams.courseId
      });
      
        
    }

    $scope.doRefresh = function() {
    
       $scope.updateDeliverables(courseId);
       $scope.$emit('updateRubicListEvent');
     $timeout(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     },1250);
    }
    $scope.getPer = function(){
      var max = 0;
      angular.forEach($scope.rubrics,function(rub){
         max+= rub.PER_WEIGHT;
     });
      
      $scope.weightageTotal = 100-max;
      return 100-max;
    }

    $scope.getRubricsTotal = function(){
      Course.getDashRubrics($stateParams.courseId).then(function(rubricsDash){
          $scope.rubricsDash = rubricsDash;
          console.log("RUBRICS-Dash",rubricsDash);
        });
    }

    $scope.toRubricDash = function($event) {
      
      $event.preventDefault();
      $state.go('deliverable.courseDash', {
        courseId: $stateParams.courseId
      });
      //$scope.getCourseGrade();

      $scope.$emit('updateRubicDashEvent');
      
    }
   
    $scope.getRubricsTotal();
    $scope.updateDeliverableRubrics = function(courseId) {
        Course.getDeliverableTypeByCourseId(courseId).then(function(rubrics){
          $scope.rubrics = rubrics;
          console.log("Rubrics",rubrics);
        });

      }

      $scope.checkRubrics = function(){
        $scope.updateDeliverableRubrics(courseId);
        return $scope.rubrics.length();
      }
      $scope.deleteRubrics = function(rubric) {
         Course.removeDeliverableType(rubric).then(function(rubrics){
           $scope.rubrics = rubrics;
         });
          
           $scope.updateDeliverableRubrics(courseId);  
      };
      $scope.addRubric = function(rubrics) {
         Course.addDeliverableType(rubrics,courseId).then(function(rubrics){
           $scope.rubrics = rubrics;
         });
         
          $scope.closeRubricsModal();
          $scope.updateDeliverableRubrics(courseId);
          $scope.updateDeliverables(courseId);
         // $scope.getCourseGrade();

           
      };

      $scope.editRubric = function(rubrics) {
         Course.editDeliverableType(rubrics,courseId).then(function(rubrics){
           $scope.rubrics = rubrics;
         });
         
          $scope.closeRubricsModal();
          $scope.updateDeliverableRubrics(courseId);
          $scope.updateDeliverables(courseId);
         // $scope.getCourseGrade();

           
      };
      //update view on form submit
      $scope.$on('updateRubicListEvent', function(event) {
       $scope.updateDeliverableRubrics(courseId); 
       /*$state.go('deliverable.addDeliverableType',$stateParams.courseId, {reload: true});*/
      });

    $scope.updateDeliverables = function(courseId) {
        Course.getDeliverables(courseId).then(function(deliverable){
          $scope.deliverable = deliverable;
          console.log(deliverable);
        });
        $scope.getRubricsTotal(); 
      }
      $scope.updateDeliverableRubrics(courseId);
      $scope.updateDeliverables(courseId);

      $scope.addDeliverable = function(deliv) {
        deliverable.DELI_NAME = deliv.delivName;
        deliverable.DELI_TYPE_ID = deliv.delivType;
        deliverable.TOTAL = deliv.delivTotal;
        deliverable.SCORE = deliv.delivScore;
        Course.addDeliverable(deliverable,courseId).then(function(deliverable){
           $scope.deliverable = deliverable;
         });

          $scope.closeDeliverableModal();
          $scope.updateDeliverableRubrics(courseId);
          $scope.updateDeliverables(courseId);
        //  $scope.getCourseGrade();
        };
      //update view on form submit
      $scope.$on('updateDeliverableListEvent', function(event) {
       $scope.updateDeliverables(courseId); 
       
      });
      $scope.editDeliverable = function(deliv) {
        deliverable.DELI_NAME = deliv.delivName;
        deliverable.DELI_TYPE_ID = deliv.delivType;
        deliverable.TOTAL = deliv.delivTotal;
        deliverable.SCORE = deliv.delivScore;
        deliverable.DELI_ID = deliv.delivId;
        Course.editDeliverable(deliverable,courseId).then(function(deliverable){
           $scope.deliverable = deliverable;
         });

          $scope.closeDeliverableModal();
          $scope.updateDeliverableRubrics(courseId);
          $scope.updateDeliverables(courseId);
        //  $scope.getCourseGrade();
        };
      //update view on form submit
      $scope.$on('updateDeliverableListEvent', function(event) {
       $scope.updateDeliverables(courseId); 
       
      });

      $scope.$on('updateRubicDashEvent', function(event) {
       $scope.getRubricsTotal(); 
       $scope.getCourseById();
       $scope.getCourseGrade();
       });

      $scope.deleteDeliverable = function(del) {
         Course.removeDeliverable(del).then(function(deliverable){
           $scope.deliverable = deliverable;
         });
            $scope.updateDeliverableRubrics(courseId);
            $scope.updateDeliverables(courseId);
      //      $scope.getCourseGrade();
            $scope.$emit('updateDeliverableListEvent'); 
      }

      /*//check if the course has a deliverables rubics
      $scope.getDeliverableList = function(courseId){
        //check if the Course ID exists in the deliverable Type table
        var checkDT = Course.getDeliverableTypeByCourseId(courseId);
        if (checkDT.status!=undefined)
        {
          alert("Deliverables present with Id: "+courseId);
          return Course.getDeliverables(courseId);
        }
        else
        {
          alert("deliverable types missing for Id: "+courseId);
          return $state.go('course.addDeliverableType',{courseId:courseId}, {reload: true});

        }
      }*/
      //Code for Rubrics modal
      $ionicModal.fromTemplateUrl('app/deliverable/add-change-deliverableType.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });


      $scope.openAddRubricsModal = function(actionDel) {
        $scope.actionDel = actionDel;
        $scope.modal.show();
      };

      $scope.openEditRubricsModal = function(actionDel,rubrics) {
        $scope.actionDel = actionDel;
        $scope.rubrics.rubricName = rubrics.NAME;
        $scope.rubrics.rubricId = rubrics.DELI_TYPE_ID;
        $scope.rubrics.rubricWeightage = rubrics.PER_WEIGHT;
        $scope.modal.show();
      };
      
      $scope.closeRubricsModal = function() {
       $scope.$emit('updateRubicListEvent');
           $scope.$emit('updateDeliverableListEvent');
           $scope.$emit('updateRubicDashEvent'); 
           $state.go('deliverable.rubricsType',$scope.courseId, {reload: true}); 
        $scope.modal.hide();
      };
      //Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });
      
    //Code for deliverable modal
    $ionicModal.fromTemplateUrl('app/deliverable/addDeliv.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(deliModal) {
        $scope.deliModal = deliModal;
      });


      $scope.openAddDeliverableModal = function(actionDel) {
        $scope.actionDel = actionDel;
        $scope.deliModal.show();
      };
      $scope.openDeliverableModal = function(actionDel,deliverable) {
        $scope.actionDel = actionDel;
        $scope.deliv.delivName = deliverable.DELI_NAME;
        $scope.deliv.delivType = deliverable.DELI_TYPE_ID;
        $scope.deliv.delivTotal = deliverable.TOTAL;
        $scope.deliv.delivScore = deliverable.SCORE;
        $scope.deliv.delivId = deliverable.DELI_ID;
        $scope.deliModal.show();
      };
      $scope.closeDeliverableModal = function() {
        /*$scope.$emit('updateDeliverableListEvent');*/ 
        $scope.$emit('updateDeliverableListEvent');
        $state.go('deliverable.deliverableList',$scope.courseId, {reload: true});
        $scope.$emit('updateRubicDashEvent'); 
        $scope.deliModal.hide();
      };
      //Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.deliModal.remove();
      });
  }
})();