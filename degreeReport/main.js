chrome.runtime.onMessage.addListener((request) => {
  var tables = document.querySelectorAll("table"); //gets an array of table elements
  var currentTable = tables.length <= 8 ? tables[6] : tables[tables.length - 1]; //  gets table with all grades and courses

  var tbody = currentTable.getElementsByTagName("tbody")[0]; // gets tbody element with nested  tb and td elements inside
  var size = tbody.querySelectorAll("tr").length; // number of tr elements or table rows

  var secondTableRow = tbody.getElementsByTagName("tr")[1];
  var tdPositionWithGrades = 0;
  var textInTdElement = secondTableRow
    .getElementsByTagName("td")[2]
    .innerHTML.replace(/ /g, ""); // gets ride of white spaces in a string

  tdPositionWithGrades = textInTdElement.length > 4 ? 3 : 2; // checks which td element has the grade letter depending if site is DPG or gradesYorku

  var courses = [];
  var grades = [];
  var courseDictionary = new Set(); // stores all unique courses to validate user-input

  /*@desc: copies all courses and their corresponding grade  in @tbody to @courses and @grades array respectively.
           Also store all unique courses code (Department and Faculty) in @courseDictionary 
  */

  //@param: @size is decreased by 1 so as to not include the first element in @tbody array
  for (var i = 0; i < size - 1; i++) {
    var tr;
    tr = tbody.getElementsByTagName("tr")[i + 1];

    courses[i] = tr.getElementsByTagName("td")[1];

    grades[i] = tr.getElementsByTagName("td")[tdPositionWithGrades];

    var courseCodeOnly = courses[i].innerHTML.substring(0, 7).replace(/ /g, "");
    courseDictionary.add(courseCodeOnly);
  }

  var course_code_courses = [];

  var course_code_grades = [];
  var index = 0;
  var temp;
  const COURSE_CODE = request.toUpperCase().replace(/ /g, "");

  /*@desc: Creates same course code but without "/" character 
  @note: Due to webpage having different course code format, must check for both options for input consistency
  */

  var temporaryCourseCode = "";
  for (var i = 0; i < COURSE_CODE.length; i++) {
    if (COURSE_CODE.charAt(i) != "/") {
      temporaryCourseCode += COURSE_CODE.charAt(i);
    }
  }

  var gradesAndCourses = [];
  var count = 0;

  if (
    courseDictionary.has(COURSE_CODE) ||
    courseDictionary.has(temporaryCourseCode)
  ) {
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
    //@desc: updates the parameters @startPoint & @endPoint's value depending on the course webpage
    // if the ending character in course code includes an invalid character in the <td> element
    //@param: @startPoint & @endPoint is the index to be started and end from in @eecsCourses inner HTML string respectively

    var startPoint = 0;
    var endPoint = 0;

    var toBeCompared = course_code_courses[0].replace(/ /g, "");
    if (isNaN(toBeCompared.substr(toBeCompared.length - 4))) {
      startPoint = 5;
      endPoint = 1;
    } else {
      startPoint = 4;
      endPoint = 0;
    }

    /* 
    @desc: Copies all credit values and grades into @all_credits and @all_grades respectively.

    @note: @courses and @grades store table elements with values while @all_Credits and @all_grades stores 
    the actual values to be used in calculations.
    
    */
    var all_credits = [];
    var all_grades = [];
    

    for (var i = 0; i < courses.length; i++) {
      let text = courses[i].innerHTML.replace(/ /g, "");
      let credit = text.substring(
        text.length - startPoint,
        text.length - endPoint
      );
      all_credits[i] = credit;

      all_grades[i] = grades[i].innerHTML.replace(/ /g, "");
    }

    /* @desc: calculates @COURSE_CODE culminative gpa using the formula: 
  Graderesult = Gradepoint_N * Creditvalue_N + Gradepoint_N-1 * Creditvalue_N-1...
  total = Graderesult / total_Gradepoint
  
  */

    var eecsGpa = 0;
    var course_code_total_credits = 0;
    var course_code_GPA = 0;

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
    course_code_GPA = eecsGpa;

    //@desc:sets @eecsGPA to 0 if no credit values read to prevent NaN output
    if (course_code_total_credits == 0) eecsGpa = 0;
    else {
      eecsGpa = (eecsGpa / course_code_total_credits).toFixed(2); // formula to calculate gpa
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

    alert(
      COURSE_CODE +
        " gpa: " +
        eecsGpa +
        "\n" + COURSE_CODE + " total credits: " + 
        course_code_total_credits + "\n" +COURSE_CODE +
        " total grade points: " +
        course_code_GPA +
        "\nOverall GPA: " + overallGPA
        
    );

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
  } else {
    alert("Invalid response. Check spelling of course name");
  }
});
