angular.module('gpaApp.services', ['gpaApp.controllers'])

.factory('DBA', function($cordovaSQLite, $q, $ionicPlatform) {
  var self = this;

  // Handle query's and potential errors
  self.query = function (query, parameters) {
    parameters = parameters || [];
    var q = $q.defer();

    $ionicPlatform.ready(function () {
      $cordovaSQLite.execute(db, query, parameters)
        .then(function (result) {
            q.resolve(result);
        }, function (error) {
          console.warn('I found an error');
          console.warn(error.message);
          q.reject(error);
        });
    });
    return q.promise;
  }

  // Proces a result set
  self.getAll = function(result) {
    var output=[];

    for (var i = 0; i < result.rows.length; i++) {
      output.push(result.rows.item(i));

    }
    return output;
  }

  // Proces a single result
  self.getById = function(result) {
    var output = null;
    output = angular.copy(result.rows.item(0));
    return output;
  }

  return self;
})

.factory('Student', function($cordovaSQLite, DBA) {
  var self = this;

  self.all = function() {
    return DBA.query("SELECT * FROM Student")
      .then(function(result){
        return DBA.getAll(result);
      });
  }

  self.getStudentById = function(studId) {
    var parameters = [studId];
    return DBA.query("SELECT * FROM Student WHERE STUDENT_ID = (?)", parameters)
      .then(function(result) {
        return DBA.getById(result);
      });
  }

  self.add = function(student) {
    
       if(student.firstName!==null && student.email!==null && student.schoolName!==null && student.type!==null && student.major!==null && student.strMonth!==null)
       {
        var parameters = [student.firstName, student.lastName, student.email, student.schoolName, student.type, student.major, student.minor, student.strMonth, student.endMonth];
        return DBA.query("INSERT INTO Student(F_NAME, L_NAME, EMAIL, SCHOOL_NAME, STU_TYPE, MAJOR, MINOR, START_DATE, END_DATE) VALUES (?,?,?,?,?,?,?,?,?)", parameters);
        }
        else {
          alert("Required fields cannot be empty!!")
          return null;
        }
      }

  self.searchInst = function(qry) {
    return DBA.query("SELECT DISTINCT INSTRUCTOR_NAME FROM COURSE WHERE INSTRUCTOR_NAME LIKE '%"+ qry +"%' COLLATE NOCASE")
      .then(function(result){
        return DBA.getAll(result);
      });
    }

    self.searchCourse = function(inst) {
      var parameters = [inst];
    return DBA.query("SELECT DISTINCT COURSE_NAME FROM COURSE WHERE INSTRUCTOR_NAME = (?)",parameters)
      .then(function(result){
        return DBA.getAll(result);
      });
    }

    self.searchGrade = function(inst,cname) {
      var parameters = [inst, cname];
    return DBA.query("SELECT DISTINCT GRADE FROM COURSE WHERE INSTRUCTOR_NAME = (?) AND COURSE_NAME = (?)",parameters)
      .then(function(result){
        return DBA.getAll(result);
      });
    }

   self.searchStu = function(inst, course, grade) {
     var parameters = [inst, course, grade];
    return DBA.query("SELECT c.COURSE_NAME, c.GRADE, c.INSTRUCTOR_NAME, s.F_NAME, s.L_NAME FROM Student s join COURSE c ON c.STUDENT_ID = s.STUDENT_ID WHERE c.INSTRUCTOR_NAME = (?) AND c.COURSE_NAME = (?) AND c.GRADE = (?)", parameters)
      .then(function(result){
        return DBA.getAll(result);
      });
    }

  /*self.remove = function(member) {
    var parameters = [member.id];
    return DBA.query("DELETE FROM team WHERE id = (?)", parameters);
  }

  self.update = function(origMember, editMember) {
    var parameters = [editMember.id, editMember.name, origMember.id];
    return DBA.query("UPDATE team SET id = (?), name = (?) WHERE id = (?)", parameters);
  }
*/
  return self;
})

.factory('Semester', function($cordovaSQLite, DBA) {
  var self = this;

  self.all = function(studentid) {
    return DBA.query("SELECT * FROM Semester WHERE STUDENT_ID = (?)", studentid)
      .then(function(result){
        return DBA.getAll(result);
      });
  }

  self.get = function(studid) {
    var parameters = [studid];
    return DBA.query("SELECT SEM_NAME FROM Semester WHERE STUDENT_ID = (?)", parameters)
      .then(function(result) {
        return DBA.getAll(result);
      });
  }

  
    self.getSemCoursesGrade = function(studid) {
    var parameters = [studid];
    return DBA.query("SELECT SUM(GRADE_POINT*CREDIT_HOURS) AS QUALITY_POINTS, SUM(CREDIT_HOURS) AS TOT_CREDIT_HOURS, STUDENT_ID, SEM_NAME FROM COURSE WHERE STUDENT_ID = (?) GROUP BY SEM_NAME, STUDENT_ID", parameters)
      .then(function(result) {
        return DBA.getAll(result);
      });
  }

  self.getAllCoursesGrade = function(studid) {
    var parameters = [studid];
    return DBA.query("SELECT SUM(GRADE_POINT*CREDIT_HOURS) AS QUALITY_POINTS, SUM(CREDIT_HOURS) AS TOT_CREDIT_HOURS, STUDENT_ID FROM COURSE WHERE STUDENT_ID = (?) GROUP BY STUDENT_ID", parameters)
      .then(function(result) {
        return DBA.getAll(result);
      });
  }

  self.add = function(session,studid) {
    
       if(session!==null && studid!==null)
       {
        var parameters = [session,studid];
        return DBA.query("INSERT INTO 'Semester'(SEM_NAME, STUDENT_ID) VALUES (?,?)", parameters);
        }
        else {
          alert("Required fields cannot be empty!!")
          return null;
        }
      }
   

  self.remove = function(sem) {
    var parameters = [sem.SEM_NAME];
    return DBA.query("DELETE FROM 'Semester' WHERE SEM_NAME = (?)", parameters);
  }

  self.update = function(origMember, editMember) {
    var parameters = [editMember.id, editMember.name, origMember.id];
    return DBA.query("UPDATE team SET id = (?), name = (?) WHERE id = (?)", parameters);
  }

  return self;
})

.factory('Course', function($cordovaSQLite, DBA) {
  var self = this;
//CRUD operation for COURSE Table
  self.all = function(studentid) {
    return DBA.query("SELECT * FROM COURSE WHERE STUDENT_ID = (?)", studentid)
      .then(function(result){
        return DBA.getAll(result);
      });
  }

  self.get = function(studid, semName) {
    var parameters = [studid, semName];
    return DBA.query("SELECT * FROM COURSE WHERE STUDENT_ID = (?) AND SEM_NAME = (?)", parameters)
      .then(function(result) {
        return DBA.getAll(result);
      });
  }

  self.getCourseById = function(courseId) {
    var parameters = [courseId];
    return DBA.query("SELECT * FROM COURSE WHERE COURSE_ID = (?)", parameters)
      .then(function(result) {
        return DBA.getById(result);
      });
  }
  
  self.updateCourseGradeById = function(courseId,grade,points){
    var parameters = [grade,points,courseId];
    return DBA.query("UPDATE COURSE SET GRADE = (?), GRADE_POINT = (?) WHERE COURSE_ID = (?)", parameters)
      .then(function(result) {
        return DBA.getAll(result);
      });
  }

  self.add = function(course) {
    
       if(course.courseName!==null && course.credits!==null && course.level!==null && course.aMin!==null && course.bMax!==null && course.bMin!==null && course.cMax!==null && course.cMin!==null && course.dMax!==null && course.dMin!==null&& course.fMax!==null)
       {
        var parameters = [course.courseName, course.cAlias, course.instructorName, course.credits, course.level, course.extra, course.stuid, course.semName, course.aMin, course.bMax, course.bMin, course.cMax, course.cMin, course.dMax, course.dMin, course.fMax];
        return DBA.query("INSERT INTO 'COURSE'(COURSE_NAME, C_ALIAS, INSTRUCTOR_NAME, CREDIT_HOURS, LEVEL, EXTRA_CREDITS, STUDENT_ID, SEM_NAME, A_MIN, B_MAX, B_MIN, C_MAX, C_MIN, D_MAX, D_MIN, F_MAX) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", parameters);
        }
        else {
          alert("Required fields cannot be empty!!")
          return null;
        }
      }

   self.getDashRubrics = function(courseId) {
    var parameters = [courseId];
    return DBA.query("SELECT SUM(DELIVERABLES.TOTAL) AS RUBRIC_TOTAL, SUM(DELIVERABLES.SCORE) AS RUBRIC_SCORE, DELIVERABLE_TYPE.NAME AS RUBRIC_NAME FROM DELIVERABLE_TYPE INNER JOIN DELIVERABLES ON (DELIVERABLES.DELI_TYPE_ID = DELIVERABLE_TYPE.DELI_TYPE_ID) WHERE DELIVERABLES.COURSE_ID = (?) GROUP BY DELIVERABLE_TYPE.DELI_TYPE_ID", parameters)
      .then(function(result) {
        return DBA.getAll(result);
      });
  }

  self.remove = function(member) {
    var parameters = [member.id];
    return DBA.query("DELETE FROM team WHERE id = (?)", parameters);
  }

  self.update = function(origMember, editMember) {
    var parameters = [editMember.id, editMember.name, origMember.id];
    return DBA.query("UPDATE team SET id = (?), name = (?) WHERE id = (?)", parameters);
  }


//CRUD for DELIVERABLE_TYPE Table
/*self.checkDeliveryTypeExits = function(courseId) {
    var parameters = [courseId];
    return DBA.query("SELECT * FROM DELIVERABLE_TYPE WHERE COURSE_ID = (?)", parameters)
      .then(function(result) {
        return DBA.getById(result);
      });
  }*/

  self.getDeliverableTypeByCourseId = function(courseId) {
    var parameters = [courseId];
    return DBA.query("SELECT * FROM DELIVERABLE_TYPE WHERE COURSE_ID = (?)", parameters)
      .then(function(result) {
          return DBA.getAll(result);
      });
  }

  self.getDeliverableTypeById = function(deliTypeId) {
    var parameters = [courseId];
    return DBA.query("SELECT * FROM DELIVERABLE_TYPE WHERE DELI_TYPE_ID = (?)", parameters)
      .then(function(result) {
        return DBA.getAll(result);
      });
  }

  self.addDeliverableType = function(deliverableType,courseId) {
    
       if(deliverableType.rubricName!==null && deliverableType.rubricWeightage!==null && courseId!==null )
       {
        var parameters = [courseId, deliverableType.rubricName, deliverableType.rubricWeightage];
        return DBA.query("INSERT INTO 'DELIVERABLE_TYPE'(COURSE_ID, NAME, PER_WEIGHT) VALUES (?,?,?)", parameters);
        }
        else {
          alert("Required fields cannot be empty!!")
          return null;
        }
      }

      self.editDeliverableType = function(deliverableType,courseId) {
    
       if(deliverableType.rubricId!==null && deliverableType.rubricName!==null && deliverableType.rubricWeightage!==null && courseId!==null )
       {
        var parameters = [courseId, deliverableType.rubricName, deliverableType.rubricWeightage, deliverableType.rubricId];
        return DBA.query("UPDATE 'DELIVERABLE_TYPE' SET COURSE_ID = (?), NAME = (?), PER_WEIGHT = (?) WHERE DELI_TYPE_ID = (?)", parameters);
        }
        else {
          alert("Required fields cannot be empty!!")
          return null;
        }
      }

  self.removeDeliverableType = function(deliverableType) {
    var parameters = [deliverableType.DELI_TYPE_ID];
    return DBA.query("DELETE FROM DELIVERABLE_TYPE WHERE DELI_TYPE_ID = (?)", parameters);
  }

  self.updateDeliverableType = function(deliverableType) {
    var parameters = [deliverableType.weight, deliverableType.name, deliverableType.id];
    return DBA.query("UPDATE DELIVERABLE_TYPE SET PER_WEIGHT = (?), NAME = (?) WHERE DELI_TYPE_ID = (?)", parameters);
  }

  //CRUD for DELIVERABLES Table
  self.getDeliverables = function(courseId) {
    var parameters = [courseId];
    return DBA.query("SELECT * FROM DELIVERABLES WHERE COURSE_ID = (?)", parameters)
      .then(function(result) {
        return DBA.getAll(result);
      });
  }

  self.addDeliverable = function(deliverable,courseId) {
    
       if(deliverable.DELI_TYPE_ID!==null && deliverable.NAME!==null && courseId!==null && deliverable.TOTAL!==null && deliverable.SCORE!==null)
       {
        var parameters = [deliverable.DELI_TYPE_ID, deliverable.DELI_NAME, courseId, deliverable.TOTAL, deliverable.SCORE];
        return DBA.query("INSERT INTO 'DELIVERABLES'(DELI_TYPE_ID, DELI_NAME, COURSE_ID, TOTAL, SCORE) VALUES (?,?,?,?,?)", parameters);
        }
        else {
          alert("Required fields cannot be empty!!")
          return null;
        }
      }

  self.editDeliverable = function(deliverable,courseId) {
    
       if(deliverable.DELI_ID!==null && deliverable.DELI_TYPE_ID!==null && deliverable.NAME!==null && courseId!==null && deliverable.TOTAL!==null && deliverable.SCORE!==null)
       {
        var parameters = [deliverable.DELI_TYPE_ID, deliverable.DELI_NAME, courseId, deliverable.TOTAL, deliverable.SCORE,deliverable.DELI_ID];
        return DBA.query("UPDATE 'DELIVERABLES' SET DELI_TYPE_ID = (?), DELI_NAME = (?), COURSE_ID = (?), TOTAL = (?), SCORE = (?) WHERE DELI_ID = (?)", parameters);
        }
        else {
          alert("Required fields cannot be empty!!")
          return null;
        }
      }

  self.removeDeliverable = function(deliverable) {
    var parameters = [deliverable.DELI_ID];
    return DBA.query("DELETE FROM DELIVERABLES WHERE DELI_ID = (?)", parameters);
  }

  self.updateDeliverable = function(deliverable) {
    var parameters = [deliverable.total, deliverable.score, deliverable.id];
    return DBA.query("UPDATE DELIVERABLES SET TOTAL = (?), SCORE = (?) WHERE DELI_ID = (?)", parameters);
  }

  return self;
})
