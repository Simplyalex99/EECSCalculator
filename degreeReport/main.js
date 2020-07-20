

chrome.runtime.onMessage.addListener((request) => {
  var tables = document.querySelectorAll("table"); //gets an array of table elements
  var lastTable ;
  if(tables.length <= 8){

lastTable = tables[6];


  }
  else{
   lastTable = tables[tables.length - 1]; // retrieves last table
  }
  var tbody = lastTable.getElementsByTagName("tbody")[0]; // gets tbody element with nested  tb and td elements inside
  var size = tbody.querySelectorAll("tr").length;
  var courses = []; // array of td elements
  var grades = [];
  var courseDictionary = new Set();

  /*@desc: copies all courses and their corresponding grade  in tbody to td and grades array respectively.
           td elements are nested inside tbody array. Only the 2nd td element gets added and 3rd td element 
           to td and grades array respectively. That is where the grades letter are and course name.
           */
  //@param: @size is decreased by 1 so as to not include the first element in tbody array

  var temp = tbody.getElementsByTagName("tr")[1];
  var start = 0;
  var textInTdElement = temp
    .getElementsByTagName("td")[2]
    .innerHTML.split(/ /g, "");

  start = textInTdElement.length > 4 ? 3 : 2; // checks which td has the grade letter depending if site is DPG or gradesYorku

  for (var i = 0; i < size - 1; i++) {
    var tr;
    tr = tbody.getElementsByTagName("tr")[i + 1];

    courses[i] = tr.getElementsByTagName("td")[1];

    grades[i] = tr.getElementsByTagName("td")[start];

    var courseCodeOnly = courses[i].innerHTML.substring(0, 7).replace(/ /g, "");
    courseDictionary.add(courseCodeOnly);
  }

  var eecsCourses = [];

  var eecsGrades = [];
  var index = 0;
  const COURSE_CODE = request.toUpperCase().replace(/ /g, "");

  /*@desc: Creates same course code but without "/" character 
  @note: Due to webpage having different course code format, must check for both options for consistency
  */
  
  var temporaryCourseCode = "";
  for(var i=0;i < t.length;i++){
    
    if (COURSE_CODE.charAt(i) != "/"){
      
      temporaryCourseCode+= COURSE_CODE.charAt(i);
      
    }
    
  }

  var gradesAndCourses = [];
  var count = 0;

  if (!(courseDictionary.has(COURSE_CODE) || courseDictionary.has(temporaryCourseCode))) {
    alert("Invalid response. Check spelling of course name");
  } else {
    /*@desc: Copies all elements in td array that have the course code LE/EECS to eecsCourses array
  and  adds its  corresponding grade letter  to eecsGrades array.
  @note: substring is used to only compare the course code then if it is an eecs course the whole course name gets added.
  */

    for (var i = 0; i < courses.length; i++) {
      temp = courses[i].innerHTML.substring(0, 7).replace(/ /g, "");
      var gradeLetter = grades[i].innerHTML;
      if (temp === COURSE_CODE || temp=== temporaryCourseCode) {
        temp = courses[i].innerHTML;
        eecsCourses[index] = temp;
        eecsGrades[index] = gradeLetter.replace(/ /g, ""); // gets rid of all whitespaces
        index++;
      }
    }

    //@desc: calculates eecs grade

   
    var startPoint = 0;
    var endPoint = 0;
if(isNaN(eecsCourses[0].substr(eecsCourses[0].length-4))){
startPoint = 5;
endPoint = 1;

} else{
startPoint = 4;
endPoint = 0;

}

    var eecsGpa = 0;
    var totalCredits = 0;

    for (var i = 0; i < eecsCourses.length; i++) {
      var courseName = eecsCourses[i].replace(/ /g, ""); // gets rid of all white spaces
      var gradeLetter = eecsGrades[i];

      var courseCredit = courseName.substring(startPoint,courseName.length - endPoint); //grabs the digit of the credit from courseName ex: 3.00 from LE/EECSXXXX3.00

      var gradePoint = gradeLetterToNumber(gradeLetter);

      if (gradePoint >= 0) {
        gradesAndCourses[count++] = eecsCourses[i] + " " + eecsGrades[i] + " ";
        var creditValue = parseInt(courseCredit);
        var result = gradePoint * creditValue;
        eecsGpa += result;
        totalCredits += creditValue;
      }
    }
    //@desc: Outputs eecs gpa to console and formula used is : total points/total credits
    eecsGpa = (eecsGpa / totalCredits).toFixed(2);
    alert(COURSE_CODE + " gpa: " + eecsGpa +  " total credits: " + totalCredits + "courses: \n"+ gradesAndCourses);

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
      //Case if course grade is P or RLF
      else return -1;
    }
  }
});
