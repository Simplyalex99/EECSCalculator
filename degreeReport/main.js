var tables = document.querySelectorAll("table"); //gets an array of table elements
var lastTable = tables[tables.length - 1]; // retrieves last table

var tbody = lastTable.getElementsByTagName("tbody")[0]; // gets tbody element with nested  tb and td elements inside
var size = tbody.querySelectorAll("tr").length;
var td = []; // array of td elements
var grades = [];

/*@desc: copies all courses and their corresponding grade  in tbody to td and grades array respectively.
         td elements are nested inside tbody array. Only the 2nd td element gets added and 3rd td element 
         to td and grades array respectively. That is where the grades letter are and course name.
         */
//@param: @size is decreased by 1 so as to not include the first element in tbody array

for (var i = 0; i < size - 1; i++) {
  var temp;
  temp = tbody.getElementsByTagName("tr")[i + 1];

  td[i] = temp.getElementsByTagName("td")[1];

  grades[i] = temp.getElementsByTagName("td")[2];
}

var eecsCourses = [];

var eecsGrades = [];
var index = 0;
const COURSE_CODE = "LE/EECS";

/*@desc: Copies all elements in td array that have the course code LE/EECS to eecsCourses array
and  adds its  corresponding grade letter  to eecsGrades array.
@note: substring is used to only compare the course code then if it is an eecs course the whole course name gets added.
*/
var eecsDictionary = new Map();//key courseName and value is grade of the course

for (var i = 0; i < td.length; i++) {
  var temp = td[i].innerHTML.substring(0, 7);
  var gradeLetter = grades[i].innerHTML;
  if (temp === COURSE_CODE) {
    temp = td[i].innerHTML;
    eecsCourses[index] = temp;
    eecsGrades[index] = gradeLetter.replace(/ /g, ""); // gets rid of all whitespaces
    index++;
  }
}

//@desc: calculates eecs grade

var eecsGpa = 0;
var totalCredits = 0;

for (var i = 0; i < eecsCourses.length; i++) {
  var courseName = eecsCourses[i].replace(/ /g, ""); // gets rid of all white spaces
  var gradeLetter = eecsGrades[i];
  var courseCredit = courseName.substr(courseName.length - 4); //grabs the digit of the credit from courseName ex: 3.00 from LE/EECSXXXX3.00

  var gradePoint = gradeLetterToNumber(gradeLetter);

  if (gradePoint >= 0) {
    var creditValue = parseInt(courseCredit);
    var result = gradePoint * creditValue;
    eecsGpa += result;
    totalCredits += creditValue;
  }
}
//@desc: Outputs eecs gpa to console and formula used is : total points/total credits
eecsGpa = (eecsGpa / totalCredits).toFixed(2);

console.log(
  "eecs gpa is: " + eecsGpa + "\n all eecs courses: \n" + eecsCourses
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
  //Case if course grade is P or RLF
  else return -1;
}
