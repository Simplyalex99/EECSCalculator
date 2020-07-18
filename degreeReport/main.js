var tables = document.querySelectorAll("table");//gets an array of table elements
var lastTable = tables[tables.length - 1]; // retrieves last table

var tbody = lastTable.getElementsByTagName("tbody")[0];
var size = tbody.querySelectorAll("tr").length;
var td = [];
var grades = [];

//@desc: copies all courses and their corresponding grade  in tbody to td and grades array respectively.

for(var i=0; i < size-1; i++){ //Not counting the first tr element so size is decreased by 1
var temp;
temp = tbody.getElementsByTagName("tr")[i+1]; 

td[i] = temp.getElementsByTagName("td")[1];


grades[i]= temp.getElementsByTagName("td")[2];
}


var eecsCourses = [];

var eecsGrades = [];
var index= 0;
var courseCode = "LE/EECS";

/*@desc: Copies all elements in td array that are have course code LE/EECS to eecsCourses array
and its grade letter corresponding to that course  to eecsGrades array.
*/
for(var i=0; i < td.length;i++){

var temp = td[i].innerHTML.substring(0,7);
var gradeLetter = grades[i].innerHTML;
if(temp === courseCode){
temp = td[i].innerHTML;
eecsCourses[index] = temp;
eecsGrades[index] =  gradeLetter.replace(/ /g,''); // replaces all whitespaces in string
index++;
}


}


//@desc: calculates eecs grade

var eecsGpa = 0;
var totalCredits =0;

for(var i=0; i < eecsCourses.length;i++){

var courseName = eecsCourses[i].replace(/ /g,'');
var gradeLetter = eecsGrades[i];
var courseCredit = courseName.substr(courseName.length-4);

var gradePoint = gradeLetterToNumber(gradeLetter);



if(gradePoint<0){
continue;

}
else{
var creditValue = parseInt(courseCredit);
var result = gradePoint * parseInt(creditValue);
eecsGpa+= result;
totalCredits += creditValue;

}

}
//formula : total points/total credits;
eecsGpa =(eecsGpa/totalCredits).toFixed(2);

console.log("eecs gpa is: " + eecsGpa + "\n all eecs courses: \n" + eecsCourses);




//@desc: Converts grade letter to equivalent grade point/number according to school's grade system.

function gradeLetterToNumber(gradeLetter){


if(gradeLetter === "A+")
return 9;
else if(gradeLetter === "A")
return 8;
else if(gradeLetter === "B+")
return 7;
else if(gradeLetter === "B")
return 6;
else if(gradeLetter === "C+")
return 5;
else if(gradeLetter === "C")
return 4;
else if(gradeLetter === "D+")
return 3;
else if(gradeLetter === "D")
return 2;
else if(gradeLetter === "E")
return 1;
else if(gradeLetter === "F" )
return 0;
else       //Case if course grade is P or RLF
return -1;
}





