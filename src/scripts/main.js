import {
  getHTMLTableWithGrades,
  getIndexWithGrades,
} from "./helperfunctions/webscrapping.js";

import {
  setCourses,
  setGrades,
  setCourseTerms,
  setCourseCodeDictionary,
  getRidOfCharacter,
  copyCoursesWithCode,
  copyGrades,
  copyCredits,
  calculateQueryGPA,
  calculateGPA,
} from "./helperfunctions/gpa.js";
export function main() {
  chrome.runtime.onMessage.addListener((request) => {
    var tbody = getHTMLTableWithGrades();
    const TABLE_SIZE = tbody.querySelectorAll("tr").length;
    var tdPositionWithGrades = getIndexWithGrades(tbody);
    var terms = []; // stores td element innerHtml of school term
    var coursesHTML = []; // stores td element with course name not the actual string value
    var gradesHTML = []; // stores td element with course grade not the actual string value
    // stores all unique courses to validate user-input
    //defining map that converts grade letter to equivalent grade point
    var gradeDictionary = new Map();
    gradeDictionary.set("A+", 9);
    gradeDictionary.set("A", 8);
    gradeDictionary.set("B+", 7);
    gradeDictionary.set("B", 6);
    gradeDictionary.set("C+", 5);
    gradeDictionary.set("C", 4);
    gradeDictionary.set("D+", 3);
    gradeDictionary.set("D", 2);
    gradeDictionary.set("E", 1);
    gradeDictionary.set("F", 0);
    coursesHTML = setCourses(tbody, coursesHTML, TABLE_SIZE);
    gradesHTML = setGrades(tbody, gradesHTML, tdPositionWithGrades, TABLE_SIZE);
    terms = setCourseTerms(tbody, terms, TABLE_SIZE);
    var courseDictionary = setCourseCodeDictionary(TABLE_SIZE, coursesHTML);

    var course_code_courses = []; // stores all unique courses with @COURSE_CODE

    var course_code_grades = []; // stores all unique grades corresponding to course with @COURSE_CODE
    var temp;
    const COURSE_CODE = request.toUpperCase().replace(/ /g, ""); // User response (course gpa to be evaluated)

    //@desc: Creates same course code but without "/" character
    //@note: Due to webpage having different course code format, must check for both options for input consistency
    var temporaryCourseCode = getRidOfCharacter(COURSE_CODE, "/");
    var queryGPAState =
      "Sorry. Culminative GPA is not available. Please check spelling.\n" +
      "(Ex: Enter SC MATH2030 3.00 M  as SC/MATH to get all math gpa).\n";

    // GLOBAL STATE 1 @startpoint and @endpoint (used code prevent redudant code)
    //@desc: updates the parameters @startPoint & @endPoint's value depending on the course webpage
    // if the ending character in course code includes an invalid character in the <td> element
    //@param: @startPoint & @endPoint is the index to be started and end from in @courses_code_courses inner HTML string respectively
    // Needed to find where the credit is in the string
    var startPoint = 0;
    var endPoint = 0;

    temp = coursesHTML[0].innerHTML;
    var c =
      tdPositionWithGrades === 3
        ? temp.substring(0, 12) + " " + temp.substring(19, temp.length)
        : temp;

    var toBeCompared = c.replace(/ /g, "");
    if (isNaN(toBeCompared.substr(toBeCompared.length - 4))) {
      startPoint = 5;
      endPoint = 1;
    } else {
      startPoint = 4;
      endPoint = 0;
    }

    var creditConstraint = { startPoint, endPoint };
    //validates if valid user input
    if (
      courseDictionary.has(COURSE_CODE) ||
      courseDictionary.has(temporaryCourseCode)
    ) {
      // -------------------------QUERY GPA-----------------------------------

      course_code_courses = copyCoursesWithCode(
        COURSE_CODE,
        coursesHTML,
        tdPositionWithGrades,
        temporaryCourseCode
      );
      course_code_grades = copyGrades(gradesHTML);

      let query = calculateQueryGPA(
        gradeDictionary,
        course_code_courses,
        course_code_grades,
        creditConstraint
      );

      let {
        course_code_GPA,
        course_code_total_credits,
        course_code_total_grade_points,
      } = query;
      queryGPAState =
        COURSE_CODE +
        " gpa: " +
        course_code_GPA +
        " " +
        COURSE_CODE +
        " credits: " +
        course_code_total_credits +
        " " +
        COURSE_CODE +
        " grade points: " +
        course_code_total_grade_points +
        "\n";
    }

    //---------------------MAJOR GPA --------------------------

    var all_credits = copyCredits(coursesHTML, creditConstraint);
    var all_grades = copyGrades(gradesHTML);
    //@desc: Copies all grades and credits string value to @all_grades and @all_credits  respectively

    //@descp: Calculates overall gpa.

    let gpaResult = calculateGPA(gradeDictionary, all_credits, all_grades);

    let { gpa, totalCredits, totalGradePoints } = gpaResult;
    var overallGPAMessage =
      "\nOverall GPA: " +
      gpa +
      "  Total credits: " +
      totalCredits +
      "  Total grade points: " +
      totalGradePoints +
      "\n" +
      "\n";

    // ---------------------------- Sessional GPA ---------------------------
    //@desc: Gets current year  and checks if it matches school's year term. Adjusted year if neccesary
    //to match school's year term. Depending on website user visits, DPR will have most recent school term
    // from the bootom of the table while yorku grades will have it at the top.
    var y = new Date().getFullYear() + "";
    var year = y.substring(2, 4);

    if (tdPositionWithGrades === 3) {
      var t = tbody.getElementsByTagName("tr")[1];

      temp = t.getElementsByTagName("td")[0];

      if (parseInt(temp.innerHTML.substring(2, 6)) < parseInt(year)) {
        var temp2 = "" + (new Date().getFullYear() - 1);
        year = temp2.substring(2, 4);
      }
    }

    if (tdPositionWithGrades === 2) {
      if (TABLE_SIZE - 1 > 0) {
        var t = tbody.getElementsByTagName("tr")[TABLE_SIZE - 1]; // last tr element
        temp = t.getElementsByTagName("td")[0];

        if (parseInt(temp.innerHTML.substring(2, 6)) < parseInt(year)) {
          var temp2 = "" + (new Date().getFullYear() - 1);
          year = temp2.substring(2, 4);
        }
      }
    }

    var lastYearGrades = [];
    var lastYearCredits = [];
    const LAST_YEAR_TERM = "FW" + (parseInt(year) - 1);

    const TERM_YEAR = "FW" + year;
    const SUMMER_TERM = "SU" + year;
    var FWtermCourseCredits = [];
    var SUtermCourseCredits = [];
    var FWGrades = [];
    var SUGrades = [];

    var k = 0; //index for Fall/Winter term arrays
    var j = 0; //index for Summer term arrays
    var m = 0; //index for Last year term
    //@desc: stores all courses and grades corresponding to the school term into their
    // respective arrays and last year term if exist
    for (var i = 0; i < coursesHTML.length; i++) {
      let term = terms[i];
      temp = coursesHTML[i].innerHTML;
      var courseText =
        tdPositionWithGrades === 3
          ? temp.substring(0, 12) + " " + temp.substring(19, temp.length)
          : temp;

      let gradeLetter = gradesHTML[i].innerHTML.substring(0, 2);
      courseText = courseText.replace(/ /g, "");
      if (term == TERM_YEAR && (gradeLetter != "") & (gradeLetter != null)) {
        // checks if table element  tr element's innerHtml term matches school term
        FWtermCourseCredits[k] = courseText.substring(
          courseText.length - startPoint,
          courseText.length - endPoint
        );
        FWGrades[k] = gradeLetter.replace(/ /g, "");

        k++;
      }
      if (term == SUMMER_TERM && (gradeLetter != "") & (gradeLetter != null)) {
        SUtermCourseCredits[j] = courseText.substring(
          courseText.length - startPoint,
          courseText.length - endPoint
        );
        SUGrades[j] = gradeLetter.replace(/ /g, "");
        j++;
      }

      if (term == LAST_YEAR_TERM && gradeLetter != "" && gradeLetter != null) {
        lastYearCredits[m] = courseText.substring(
          courseText.length - startPoint,
          courseText.length - endPoint
        );
        lastYearGrades[m] = gradeLetter.replace(/ /g, "");
        m++;
      }
    }
    //@desc: Calculatess FW term sessional GPA
    var FWsessionalGPA = 0;
    var FWsessionalCredits = 0;
    var FWsessionalPoints = 0;

    for (var i = 0; i < FWGrades.length; i++) {
      var gradeLetter = FWGrades[i];
      var credit = FWtermCourseCredits[i];
      var gradePoint = -1;
      if (gradeDictionary.has(gradeLetter)) {
        gradePoint = gradeDictionary.get(gradeLetter);
      }
      // var point = gradeLetterToNumber(gradeLetter);
      if (gradePoint >= 0) {
        var sum = gradePoint * parseInt(credit);
        FWsessionalPoints += sum;
        FWsessionalCredits += parseInt(credit);
      }
    }
    if (FWsessionalCredits == 0) {
      FWsessionalGPA = 0;
    } else {
      FWsessionalGPA = (FWsessionalPoints / FWsessionalCredits).toFixed(2);
    }

    var FWOutput =
      TERM_YEAR +
      " sessional gpa: " +
      FWsessionalGPA +
      "  Credits: " +
      FWsessionalCredits +
      "  grade points:  " +
      FWsessionalPoints +
      "\n";

    //@desc: Calculates SU sessional GPA if any SU courses

    var SUsessionalGPA = 0;
    var SUsessionalCredits = 0;
    var SUsessionalPoints = 0;

    for (var i = 0; i < SUGrades.length; i++) {
      var gradeLetter = SUGrades[i];
      var credit = SUtermCourseCredits[i];

      var gradePoint = -1;
      if (gradeDictionary.has(gradeLetter)) {
        gradePoint = gradeDictionary.get(gradeLetter);
      }
      if (gradePoint >= 0) {
        var sum = gradePoint * parseInt(credit);
        SUsessionalPoints += sum;
        SUsessionalCredits += parseInt(credit);
      }
    }
    if (SUsessionalCredits == 0) {
      SUsessionalGPA = 0;
    } else {
      SUsessionalGPA = (SUsessionalPoints / SUsessionalCredits).toFixed(2);
    }

    var SUOutput =
      SUMMER_TERM +
      " sessional gpa: " +
      SUsessionalGPA +
      "  Credits: " +
      SUsessionalCredits +
      "  grade points: " +
      SUsessionalPoints +
      "\n";

    //@desc: calculates last year term GPA.

    var lastYearGPA = 0;
    var lastYearTotalCredits = 0;
    var lastYearPoints = 0;

    for (var i = 0; i < lastYearGrades.length; i++) {
      var gradeLetter = lastYearGrades[i];
      var credit = lastYearCredits[i];

      //var point = gradeLetterToNumber(gradeLetter);
      var gradePoint = -1;
      if (gradeDictionary.has(gradeLetter)) {
        gradePoint = gradeDictionary.get(gradeLetter);
      }

      if (gradePoint >= 0) {
        var sum = gradePoint * parseInt(credit);

        lastYearPoints += sum;
        lastYearTotalCredits += parseInt(credit);
      }
    }
    var lastYearOutput = "";
    if (lastYearCredits != 0) {
      lastYearGPA = (lastYearPoints / lastYearTotalCredits).toFixed(2);
      lastYearOutput =
        "\n" +
        LAST_YEAR_TERM +
        " sessional gpa: " +
        lastYearGPA +
        "  Credits: " +
        lastYearTotalCredits +
        "  grade points: " +
        lastYearPoints;
    }

    alert(
      queryGPAState + overallGPAMessage + FWOutput + SUOutput + lastYearOutput
    );
  });
}
