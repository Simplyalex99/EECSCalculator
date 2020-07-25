chrome.runtime.onMessage.addListener((request) => {
  var tables = document.querySelectorAll("table"); //gets an array of table elements
  var currentTable = tables.length <= 8 ? tables[6] : tables[tables.length - 1]; //  gets table with all grades and courses; 8 is table on grades yorku ,and [6] is from DPR(DegreeProgesReport)

  var tbody = currentTable.getElementsByTagName("tbody")[0]; // gets tbody element with nested  tb and td elements inside
  const TABLE_SIZE = tbody.querySelectorAll("tr").length; // number of tr elements or table rows in table element

  var secondTableRow = tbody.getElementsByTagName("tr")[1];
  var tdPositionWithGrades = 0;
  var textInTdElement = secondTableRow
    .getElementsByTagName("td")[2]
    .innerHTML.replace(/ /g, ""); // gets ride of white spaces in a string

  tdPositionWithGrades = textInTdElement.length > 4 ? 3 : 2; // checks which td element has the grade letter depending if site is DPG or gradesYorku
  var terms = []; // stores td element innerHtml of school term 
  var courses = []; // stores td element with course name not the actual string value
  var grades = [];// stores td element with course grade not the actual string value
  var courseDictionary = new Set(); // stores all unique courses to validate user-input

  /*@desc: copies all courses and their corresponding grade  in @tbody to @courses and @grades array respectively.
           Also store all unique courses code (Department and Faculty) in @courseDictionary 
  */

  //@param: @size is decreased by 1 so as to not include the first element in @tbody array
  for (var i = 0; i < TABLE_SIZE - 1; i++) {
    var tr2;
    tr2 = tbody.getElementsByTagName("tr")[i + 1]; // gets specific tr elementfrom table  

    courses[i] = tr2.getElementsByTagName("td")[1]; // gets specific td element with course name from previous tr element

    grades[i] = tr2.getElementsByTagName("td")[tdPositionWithGrades]; // gets td element with grade letter
    terms[i] = tr2.getElementsByTagName("td")[0].innerHTML;
    var courseCodeOnly = courses[i].innerHTML.substring(0, 7).replace(/ /g, "");
    courseDictionary.add(courseCodeOnly);
  }

  var course_code_courses = []; // stores all unique courses with @COURSE_CODE

  var course_code_grades = []; // stores all unique grades corresponding to course with @COURSE_CODE
  var index = 0;
  var temp;
  const COURSE_CODE = request.toUpperCase().replace(/ /g, ""); // User response (course gpa to be evaluated)

  //@desc: Creates same course code but without "/" character 
  //@note: Due to webpage having different course code format, must check for both options for input consistency
  var temporaryCourseCode = "";
  for (var i = 0; i < COURSE_CODE.length; i++) {
    if (COURSE_CODE.charAt(i) != "/") {
      temporaryCourseCode += COURSE_CODE.charAt(i);
    }
  }

  var gradesAndCourses = [];
  var count = 0;

  var queryGPAState = "Sorry. Choice of GPA is not available. Please check spelling\n" +
  "or enter one as specificied in the description.\n";

  // GLOBAL STATE 1 @startpoint and @endpoint (used code prevent redudant code)
  //@desc: updates the parameters @startPoint & @endPoint's value depending on the course webpage
  // if the ending character in course code includes an invalid character in the <td> element
  //@param: @startPoint & @endPoint is the index to be started and end from in @courses_code_courses inner HTML string respectively
// Needed to find where the credit is in the string
  var startPoint = 0;
  var endPoint = 0;

  temp = courses[0].innerHTML;
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
  // END OF GLOBAL STATE 1
  //@desc: Validates if user's response is an actual course that they have in their schedule
  if (
    courseDictionary.has(COURSE_CODE) ||
    courseDictionary.has(temporaryCourseCode)
  ) {
    // -------------QUERY GPA-------------------
    /*@desc: Copies all elements in td array that have the course code @COURSE_CODE to @course_code_courses array
  and  adds its  corresponding grade letter  to @course_code_grades array.
  @note: substring is used to only compare the course code then if it is the query course the whole course name gets added.
  */

    for (var i = 0; i < courses.length; i++) {
      temp = courses[i].innerHTML.substring(0, 7).replace(/ /g, "");
      var gradeLetter = grades[i].innerHTML;
      if (temp === COURSE_CODE || temp === temporaryCourseCode) {
        temp = courses[i].innerHTML;
        var courseText =
          tdPositionWithGrades === 3
            ? temp.substring(0, 12) + " " + temp.substring(19, temp.length)
            : temp; // if site is not DPR then gets rid of &nbsp text
        course_code_courses[index] = courseText;
        course_code_grades[index] = gradeLetter.replace(/ /g, ""); // gets rid of all whitespaces
        index++;
      }
    }

    var eecsGpa = 0;
    var course_code_total_credits = 0;
    var course_code_GPA = 0;

    //@desc: Calculates user's choice of gpa
    for (var i = 0; i < course_code_courses.length; i++) {
      var courseName = course_code_courses[i].replace(/ /g, ""); // gets rid of all white spaces
      var gradeLetter = course_code_grades[i];

      var courseCredit = courseName.substring(
        courseName.length - startPoint,
        courseName.length - endPoint
      ); //grabs the digit of the credit from courseName ex: 3.00 from LE/EECSXXXX3.00

      var gradePoint = gradeLetterToNumber(gradeLetter);

      if (gradePoint >= 0) {
        gradesAndCourses[count++] =
          course_code_courses[i] + " grade: " + course_code_grades[i] + " ";
        var creditValue = parseInt(courseCredit);
        var result = gradePoint * creditValue;
        eecsGpa += result;
        course_code_total_credits += creditValue;
      }
    }
    

    //@desc:sets @eecsGPA to 0 if no credit values read to prevent NaN output
    if (course_code_total_credits == 0) course_code_GPA = 0;
    else {
      course_code_GPA = (eecsGpa / course_code_total_credits).toFixed(2); // formula to calculate gpa
    }

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
      eecsGpa + "\n";
  }

  //@desc: Converts grade letter to equivalent grade point/number according to school's grade system.
  function gradeLetterToNumber(gradeLetter) {
    if (gradeLetter === "A+") return 9;
    else if (gradeLetter === "A") return 8;
    else if (gradeLetter === "B+") return 7;
    else if (gradeLetter === "B") return 6;
    else if (gradeLetter === "C+") return 5;
    else if (gradeLetter === "C") return 4;
    else if (gradeLetter === "D+") return 3;
    else if (gradeLetter === "D") return 2;
    else if (gradeLetter === "E") return 1;
    else if (gradeLetter === "F") return 0;
    //Case if course grade is P or RLF or no grade
    else return -1;
  }

  //--------------MAJOR GPA -----------------

  var all_credits = [];
  var all_grades = [];
//@desc: Copies all grades and credits string value to @all_grades and @all_credits  respectively
  for (var i = 0; i < courses.length; i++) {
    let text = courses[i].innerHTML.replace(/ /g, "");
    let credit = text.substring(
      text.length - startPoint,
      text.length - endPoint
    );
    all_credits[i] = credit;

    all_grades[i] = grades[i].innerHTML.replace(/ /g, "");
  }

  //@descp: Calculates overall gpa.
  var overallGPA = 0;
  var totalcredits = 0;
  var totalPoints = 0;

  for (var i = 0; i < all_credits.length; i++) {
    var gradeLetter = all_grades[i];
    var point = gradeLetterToNumber(gradeLetter);

    if (point >= 0) {
      totalcredits += parseInt(all_credits[i]);

      totalPoints += point * parseInt(all_credits[i]);
    }
  }

  //@desc:sets @overallGPA to 0 if no credit values read to prevent NaN output
  if (totalcredits === 0) overallGPA = 0;
  else {
    overallGPA = (totalPoints / totalcredits).toFixed(2);
  }

  var overallGPAMessage =
    "\nOverall GPA: " +
    overallGPA +
    "  Total credits: " +
    totalcredits +
    "  Total grade points: " +
    totalPoints +
    "\n" + "\n";

  // ---------------- Sessional GPA -------------------
//@desc: Gets current year  and checks if it matches school's year term. Adjusted year if neccesary
//to match school's year term. Depending on website user visits, DPR will have most recent school term
// from the bootom of the table while yorku grades will have it at the top.
  var y = new Date().getFullYear() + "";
  var year = y.substring(2, 4);

  if (tdPositionWithGrades === 3) {
    

    var t = tbody.getElementsByTagName("tr")[1];

    temp = t.getElementsByTagName("td")[0];
   
    if (parseInt(temp.innerHTML.substring(2, 6))< parseInt(  year)) { 
      var temp2 = "" + (new Date().getFullYear() - 1);
      year = temp2.substring(2, 4);
    }
  }

  if (tdPositionWithGrades === 2) {
    if(TABLE_SIZE-1 > 0){
   var  t = tbody.getElementsByTagName("tr")[TABLE_SIZE-1];// last tr element
    temp = t.getElementsByTagName("td")[0];
    
    if (parseInt(temp.innerHTML.substring(2, 6)) < parseInt(year)) {
      var temp2 = "" + (new Date().getFullYear() - 1);
      year = temp2.substring(2, 4);
    }
  }
  }

 
  const TERM_YEAR = "FW" + year;
  const SUMMER_TERM = "SU" + year;
  var FWtermCourseCredits = [];
  var SUtermCourseCredits = [];
  var FWGrades = [];
  var SUGrades = [];

  var k = 0;//index for Fall/Winter term arrays
  var j = 0; //index for Summer term arrays
  //@desc: stores all courses and grades corresponding to the school term into their respective arrays
  for (var i = 0; i < courses.length; i++) {
    let term = terms[i];
    temp = courses[i].innerHTML;
    var courseText =
      tdPositionWithGrades === 3
        ? temp.substring(0, 12) + " " + temp.substring(19, temp.length)
        : temp;

    let gradeLetter = grades[i].innerHTML.substring(0, 2);
    courseText = courseText.replace(/ /g, "");
    if (term == TERM_YEAR && (gradeLetter != "") & (gradeLetter != null)) {// checks if table element  tr element's innerHtml term matches school term
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
  }
  //@desc: Calculatess FW term sessional GPA
  var FWsessionalGPA = 0;
  var FWsessionalCredits = 0;
  var FWsessionalPoints = 0;


  for (var i = 0; i < FWGrades.length; i++) {
    var gradeLetter = FWGrades[i];
    var credit = FWtermCourseCredits[i];
    var point = gradeLetterToNumber(gradeLetter);
    if (point >= 0) {
      var sum = point * parseInt(credit);
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
    "\n" + "\n";

  //@desc: Calculates SU sessional GPA if any SU courses

  var SUsessionalGPA = 0;
  var SUsessionalCredits = 0;
  var SUsessionalPoints = 0;

  for (var i = 0; i < SUGrades.length; i++) {
    var gradeLetter = SUGrades[i];
    var credit = SUtermCourseCredits[i];
    var point = gradeLetterToNumber(gradeLetter);
    if (point >= 0) {
      var sum = point * parseInt(credit);
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
    SUsessionalPoints;

  alert(queryGPAState + overallGPAMessage + FWOutput + SUOutput);
});
