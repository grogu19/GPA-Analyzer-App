var db = null;
angular.module("gpaApp",["ionic",'gpaApp.controllers', 'gpaApp.services', 'ngCordova', 'mgcrea.pullToRefresh'])

.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }

    if(window.cordova && window.SQLitePlugin) {
      // App syntax
      db = $cordovaSQLite.openDB("gpaAna.db", 200000);
      db.transaction(populateDB, errorCB, successCB);
    } else {
      // Ionic serve syntax
      db = window.openDatabase("gpaAna.db", "1.0", "gpaApp", 200000);
      db.transaction(populateDB, errorCB, successCB);
    }

     //$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS 'Student' (`STUDENT_ID`  INTEGER PRIMARY KEY AUTOINCREMENT, `F_NAME`  TEXT NOT NULL, `L_NAME`  TEXT, `EMAIL` TEXT NOT NULL, `SCHOOL_NAME` TEXT NOT NULL, `STU_TYPE`  NUMERIC NOT NULL, `MAJOR` TEXT NOT NULL, `MINOR` TEXT, `START_DATE`  TEXT NOT NULL, `END_DATE`  TEXT, `DEGREE_CREDITS`  INTEGER, `CGPA`  REAL NOT NULL DEFAULT 0.00)");
     //$cordovaSQLite.execute(db, "DROP TABLE Semester");
     //$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS `Semester` (`SEM_NAME`  TEXT, `STUDENT_ID`  INTEGER NOT NULL, `SEM_GPA` REAL DEFAULT 0.00, `GRADE` TEXT, `COURSES_COUNT` INTEGER DEFAULT 0,  `CREDIT_COUNT`  INTEGER DEFAULT 0, PRIMARY KEY(SEM_NAME,STUDENT_ID), FOREIGN KEY(`STUDENT_ID`) REFERENCES Student(STUDENT_ID))");
    // $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS `COURSE` ('COURSE_ID` INTEGER PRIMARY KEY AUTOINCREMENT, `COURSE_NAME` TEXT NOT NULL, `C_ALIAS` TEXT, `INSTRUCTOR_NAME` TEXT, `CREDIT_HOURS`  INTEGER NOT NULL, `LEVEL` INTEGER NOT NULL, `GRADE` TEXT, `EXTRA_CREDITS` NUMERIC, `STUDENT_ID`  INTEGER NOT NULL, `SEM_NAME`  TEXT NOT NULL, FOREIGN KEY(`STUDENT_ID`) REFERENCES STUDENT(STUDENT_ID), FOREIGN KEY(`SEM_NAME`) REFERENCES SEMESTER(SEM_NAME))");
    // $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS `COURSE_GRADE_SCALE` (`COURSE_ID` INTEGER PRIMARY KEY AUTOINCREMENT, `A_MIN` REAL NOT NULL, `B_MAX` REAL NOT NULL, `B_MIN` REAL NOT NULL, `C_MAX` REAL NOT NULL, `C_MIN` REAL NOT NULL, `D_MAX` REAL NOT NULL, `D_MIN` REAL NOT NULL, `F_MAX` REAL NOT NULL, FOREIGN KEY(`COURSE_ID`) REFERENCES COURSE(COURSE_ID))");
    // $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS `DELIVERABLES` (`DELI_ID` INTEGER PRIMARY KEY AUTOINCREMENT, `DELI_TYPE_ID`  INTEGER NOT NULL, `COURSE_ID` INTEGER NOT NULL, `TOTAL` REAL DEFAULT 100.00, `SCORE` REAL DEFAULT 0.00, `GRADE` TEXT, FOREIGN KEY(`DELI_TYPE_ID`) REFERENCES DELIVERABLE_TYPE(DELI_TYPE_ID), FOREIGN KEY(`COURSE_ID`) REFERENCES COURSE(COURSE_ID))");
    // $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS `DELIVERABLE_TYPE` (`DELI_TYPE_ID`  INTEGER PRIMARY KEY AUTOINCREMENT, `NAME`  TEXT NOT NULL, `PER_WEIGHT`  REAL NOT NULL DEFAULT 0.00)");
      //$cordovaSQLite.execute(db, "DELETE FROM 'Student' WHERE STUDENT_ID = 5");
      //$cordovaSQLite.execute(db, "INSERT INTO 'Semester'(SEM_NAME, STUDENT_ID) VALUES('FALL 2013', 1)");
     // $cordovaSQLite.execute(db, "INSERT INTO 'COURSE'(COURSE_NAME, CREDIT_HOURS, LEVEL, STUDENT_ID, SEM_NAME) VALUES('System Analysis and Design', 3, 400, 1, 'FALL 2013')");

      function populateDB(tx) {
      tx.executeSql("CREATE TABLE IF NOT EXISTS 'Student' (`STUDENT_ID`  INTEGER PRIMARY KEY AUTOINCREMENT, `F_NAME`  TEXT NOT NULL, `L_NAME`  TEXT, `EMAIL` TEXT NOT NULL, `SCHOOL_NAME` TEXT NOT NULL, `STU_TYPE`  NUMERIC NOT NULL, `MAJOR` TEXT NOT NULL, `MINOR` TEXT, `START_DATE`  TEXT NOT NULL, `END_DATE`  TEXT, `DEGREE_CREDITS`  INTEGER, `CGPA`  REAL NOT NULL DEFAULT 0.00)");
     //$cordovaSQLite.execute(db, "DROP TABLE Semester");
      tx.executeSql("CREATE TABLE IF NOT EXISTS `Semester` (`SEM_NAME`  TEXT, `STUDENT_ID`  INTEGER NOT NULL, `SEM_GPA` REAL DEFAULT 0.00, `GRADE` TEXT, `COURSES_COUNT` INTEGER DEFAULT 0,  `CREDIT_COUNT`  INTEGER DEFAULT 0, PRIMARY KEY(SEM_NAME,STUDENT_ID), FOREIGN KEY(`STUDENT_ID`) REFERENCES Student(STUDENT_ID))");
      tx.executeSql("CREATE TABLE IF NOT EXISTS `COURSE` (`COURSE_ID` INTEGER PRIMARY KEY AUTOINCREMENT, `COURSE_NAME` TEXT NOT NULL, `C_ALIAS` TEXT, `INSTRUCTOR_NAME` TEXT, `CREDIT_HOURS`  INTEGER NOT NULL, `LEVEL` INTEGER NOT NULL, `GRADE` TEXT, `GRADE_POINT` INTEGER, `EXTRA_CREDITS` NUMERIC, `STUDENT_ID`  INTEGER NOT NULL, `SEM_NAME`  TEXT NOT NULL, `A_MIN` REAL NOT NULL, `B_MAX` REAL NOT NULL, `B_MIN` REAL NOT NULL, `C_MAX` REAL NOT NULL, `C_MIN` REAL NOT NULL, `D_MAX` REAL NOT NULL, `D_MIN` REAL NOT NULL, `F_MAX` REAL NOT NULL, FOREIGN KEY(`STUDENT_ID`) REFERENCES STUDENT(STUDENT_ID), FOREIGN KEY(`SEM_NAME`) REFERENCES SEMESTER(SEM_NAME))");
      //tx.executeSql("CREATE TABLE IF NOT EXISTS `COURSE_GRADE_SCALE` (`COURSE_ID` INTEGER PRIMARY KEY AUTOINCREMENT, `A_MIN` REAL NOT NULL, `B_MAX` REAL NOT NULL, `B_MIN` REAL NOT NULL, `C_MAX` REAL NOT NULL, `C_MIN` REAL NOT NULL, `D_MAX` REAL NOT NULL, `D_MIN` REAL NOT NULL, `F_MAX` REAL NOT NULL, FOREIGN KEY(`COURSE_ID`) REFERENCES COURSE(COURSE_ID))");
      tx.executeSql("CREATE TABLE IF NOT EXISTS `DELIVERABLES` (`DELI_ID` INTEGER PRIMARY KEY AUTOINCREMENT, `DELI_NAME` TEXT NOT NULL, `DELI_TYPE_ID`  INTEGER NOT NULL, `COURSE_ID` INTEGER NOT NULL, `TOTAL` REAL DEFAULT 100.00, `SCORE` REAL DEFAULT 0.00, `GRADE` TEXT, FOREIGN KEY(`DELI_TYPE_ID`) REFERENCES DELIVERABLE_TYPE(DELI_TYPE_ID), FOREIGN KEY(`COURSE_ID`) REFERENCES COURSE(COURSE_ID))");
      tx.executeSql("CREATE TABLE IF NOT EXISTS `DELIVERABLE_TYPE` (`DELI_TYPE_ID`  INTEGER PRIMARY KEY AUTOINCREMENT, `NAME`  TEXT NOT NULL, `PER_WEIGHT`  REAL NOT NULL DEFAULT 0.00, `COURSE_ID` INTEGER NOT NULL, FOREIGN KEY(`COURSE_ID`) REFERENCES COURSE ( COURSE_ID ))");
      //$cordovaSQLite.execute(db, "DELETE FROM 'Student' WHERE STUDENT_ID = 5");
      //$cordovaSQLite.execute(db, "INSERT INTO 'Semester'(SEM_NAME, STUDENT_ID) VALUES('FALL 2013', 1)");
      //tx.executeSql("INSERT INTO 'COURSE'(COURSE_NAME, CREDIT_HOURS, LEVEL, STUDENT_ID, SEM_NAME, A_MIN, B_MAX, B_MIN, C_MAX, C_MIN, D_MAX, D_MIN, F_MAX) VALUES('System Analysis and Design', 3, 400, 1, 'FALL 2013', 90, 89, 80, 79, 70, 69, 60, 59)");
      //tx.executeSql("DELETE FROM 'COURSE' WHERE COURSE_ID=3");
      //tx.executeSql("ALTER TABLE `COURSE` ADD COLUMN GRADE_POINT INTEGER");
      //tx.executeSql("DROP TABLE `DELIVERABLES`");
      //tx.executeSql("DROP TABLE `DELIVERABLE_TYPE`");
      //tx.executeSql("DROP TABLE `COURSE_GRADE_SCALE`");
      //tx.executeSql("DROP TABLE `COURSE`");
      //tx.executeSql("DROP TABLE `Semester`");
      //tx.executeSql("DROP TABLE `Student`");
      //tx.executeSql("INSERT INTO 'DELIVERABLES'( COURSE_ID,DELI_NAME, DELI_TYPE_ID,TOTAL,SCORE) VALUES(8,'Test Assignments',1,100,98)");
    }

    // Transaction error callback
    //
    function errorCB(err) {
      console.log(err);
        alert("Error processing SQL: "+err.toString());
    }

    // Transaction success callback
    //
    function successCB() {
        //alert("success!");
    }

  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('student', {
    url: '/student',
    abstract: true,
    templateUrl: 'app/student/student.html',
    controller:'studDetailCtrl'
  })

  // Each tab has its own nav history stack:

  .state('student.dash', {
    url: '/dash/:id',
    views: {
        "tab-dash": {
          templateUrl: 'app/student/dash.html',
          controller:'studDetailCtrl'
        }
      }
  })

  .state('student.semester', {
     cache: false,
    url: '/semester/:id',
    views: {
        "tab-semester": {
          templateUrl: 'app/student/semester.html',
          controller:'studDetailCtrl'
        }
      }
  })


  .state('student.profile', {
    url: '/profile/:id',
    views: {
        "tab-profile": {
          templateUrl: 'app/student/profile.html',
          controller:'studDetailCtrl'
        }
      }
  })
//Home views
  .state('home', {
    url: '/home',
    abstract: true,
    templateUrl: 'app/home/home.html'
  })

.state('home.studentList', {
    cache: false,
    url: '/studentList',
    views: {
        "student": {
          templateUrl: 'app/home/studentList.html',
          controller:'studentCtrl'
        } 
      }   
  })

.state('home.welcome', {
    cache: false,
    url: '/welcome',
    views: {
        "student": {
          templateUrl: 'app/home/welcome.html',
          controller:'studentCtrl'
        } 
      }   
  })

  .state('home.instructor', {
    cache: false,
    url: '/instructor',
    views: {
        "student": {
          templateUrl: 'app/home/instructor.html',
          controller:'studentCtrl'
        } 
      }   
  })

  .state('home.instructorDash', {
    cache: false,
    url: '/instructorDash/:name',
    views: {
        "student": {
          templateUrl: 'app/home/instructorDash.html',
          controller:'studentCtrl'
        } 
      }   
  })

  .state('home.addStudent', {
    url: '/addStudent',
    views: {
        "student": {
          templateUrl: 'app/home/addStudent.html',
          controller:'studentCtrl'
        }
      }   
  })
//Course views
  .state('course', {
    url: '/course',
    abstract: true,
    templateUrl: 'app/course/course.html',
    controller: 'courseCtrl'
  })

.state('course.courseList', {
    url: '/courseList/:id?semName',
    views: {
        "course": {
          templateUrl: 'app/course/courseList.html',
          controller:'courseCtrl'
        } 
      }   
  })

  .state('course.addCourse', {
    url: '/addCourse/:id?semName',
    views: {
        "course": {
          templateUrl: 'app/course/addCourse.html',
          controller:'courseCtrl'
        }
      }   
  })

  .state('deliverable', {
    url: '/deliverable',
    abstract: true,
    templateUrl: 'app/deliverable/deliverable.html'
  })

  .state('deliverable.courseDash', {
    url: '/courseDash/:courseId',
    views: {
        "tab-cDash": {
          templateUrl: 'app/deliverable/courseDash.html',
          controller: 'deliverCtrl'
        }
      }   
  })

  .state('deliverable.deliverableList', {
    url: '/deliverableList/:courseId',
    views: {
        "tab-deliverable": {
          templateUrl: 'app/deliverable/deliverableList.html',
          controller: 'deliverCtrl'
        } 
      }   
  })

  .state('deliverable.addDeliverables', {
    url: '/addDeliverables',
    views: {
        "tab-deliverable": {
          templateUrl: 'app/deliverable/addDeliv.html',
          controller: 'deliverCtrl'
        }
      }   
  })

  .state('deliverable.rubricsType', {
    url: '/:courseId',
    views: {
        "tab-rubrics": {
          templateUrl: 'app/deliverable/rubricsType.html',
          controller: 'deliverCtrl'
        }
      }   
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/home/welcome');

});
