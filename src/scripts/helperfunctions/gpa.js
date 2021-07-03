/*
@Description: copies the course names from @bodyContentHTML to @coursesHTML array.
@Returns: a copy of @courses.
@Params: @bodyContentHTML a reference to an HTML table with grades, @coursesHTML, @sizeOfTable size of HTML table.
@Note:for-loop conditional is decremented by 1  to not include first table row element with an invalid value
*/

export function setCourses(bodyContentHTML, coursesHTML, sizeOfTable) {
  for (let i = 0; i < sizeOfTable - 1; i++) {
    let tr2 = bodyContentHTML.getElementsByTagName("tr")[i + 1];
    coursesHTML[i] = tr2.getElementsByTagName("td")[1];
  }

  return coursesHTML;
}

/*
@Description: copies the course names from @bodyContentHTML to @gradesHTML array.
@Returns: a copy of @gradesHTML.
@Params: @bodyContentHTML a reference to an HTML table with grades, @gradesHTML, @sizeOfTable size of HTML table, @indexWithGrades.
@Note:for-loop conditional is decremented by 1  to not include first table row element with an invalid value
*/
export function setGrades(
  bodyContentHTML,
  gradesHTML,
  indexWithGrades,
  sizeOfTable
) {
  for (let i = 0; i < sizeOfTable - 1; i++) {
    let tr2 = bodyContentHTML.getElementsByTagName("tr")[i + 1];
    gradesHTML[i] = tr2.getElementsByTagName("td")[indexWithGrades];
  }
  return gradesHTML;
}

/*
@Description: copies the course term names from @bodyContentHTML to @terms array.
@Returns: a copy of @terms.
@Params: @bodyContentHTML a reference to an HTML table with grades, @terms, @sizeOfTable size of HTML table.
@Note:for-loop conditional is decremented by 1  to not include first table row element with an invalid value
*/
export function setCourseTerms(bodyContentHTML, terms, sizeOfTable) {
  for (let i = 0; i < sizeOfTable - 1; i++) {
    let tr = bodyContentHTML.getElementsByTagName("tr")[i + 1];
    terms[i] = tr.getElementsByTagName("td")[0].innerHTML;
  }
  return terms;
}

/*
@Description: copies the course names from @courses to  dictionary.
@Returns: a copy of dictionary.
@Params: @coursesHTML, @sizeOfTable size of HTML table.
@Note:for-loop conditional is decremented by 1  to not include first table row element with an invalid value
*/
export function setCourseCodeDictionary(sizeOfTable, coursesHTML) {
  var courseDictionary = new Set();
  for (let i = 0; i < sizeOfTable - 1; i++) {
    let courseCodeOnly = coursesHTML[i].innerHTML
      .substring(0, 7)
      .replace(/ /g, "");
    courseDictionary.add(courseCodeOnly);
  }
  return courseDictionary;
}

/*
@Description: stores all courses matching @course_code user input
@Returns: an array copy with all matching @course_code.
@Params: @coursesHTML array storing all courses, @course_code to match from user input,@indexWithGrades integer
value.
@Note: @indexWithGrades is required to know the string length. Yorku grades page has a different string length for courses
than degree progress report page.
*/

export function copyCoursesWithCode(
  course_code,
  coursesHTML,
  tdPositionWithGrades,
  temporaryCourseCode
) {
  let courses_with_code = [];
  let index = 0;
  for (let i = 0; i < coursesHTML.length; i++) {
    let temp = coursesHTML[i].innerHTML.substring(0, 7).replace(/ /g, "");
    if (temp === course_code || temp === temporaryCourseCode) {
      temp = coursesHTML[i].innerHTML;
      let courseText =
        tdPositionWithGrades === 3
          ? temp.substring(0, 12) + " " + temp.substring(19, temp.length)
          : temp; // if site is not DPR then gets rid of &nbsp text
      courses_with_code[index] = courseText;
      index++;
    }
  }

  return courses_with_code;
}
/*
@Description: stores all grade letters without whitespace from @grades.
@Returns: an array copy of grades.
@Params: @gradesHTML containning all grades
*/

export function copyGrades(gradesHTML) {
  let grades_copy = [];
  let index = 0;
  for (let i = 0; i < gradesHTML.length; i++) {
    let gradeLetter = gradesHTML[i].innerHTML;
    grades_copy[index] = gradeLetter.replace(/ /g, "");
    index++;
  }
  return grades_copy;
}

export function copyCredits(coursesHTML, creditConstraint) {
  let credits = [];
  let { startPoint, endPoint } = creditConstraint;
  for (var i = 0; i < coursesHTML.length; i++) {
    let text = coursesHTML[i].innerHTML.replace(/ /g, "");
    let credit = text.substring(
      text.length - startPoint,
      text.length - endPoint
    );
    credits[i] = credit;
  }

  return credits;
}

/*


@Description: Creates a copy of @course_code without the special character. 
For example, @course_code = "SC/MATH" , @special_character="/", returns "SCMATH"
@Returns a copy of @course_code without the special character. 
@Params @course_code string input, @special_character the string character to not copy.

*/
export function getRidOfCharacter(course_code, special_character) {
  let temporaryCourseCode = "";
  for (let i = 0; i < course_code.length; i++) {
    if (course_code.charAt(i) != special_character) {
      temporaryCourseCode += course_code.charAt(i);
    }
  }
  return temporaryCourseCode;
}

/*
@Description: Calculates the query gpa of user  choice using the formula:
 (Summation(credit[i] * gradeLetter numerical value[i] )) / total credits

@Returns: an object containing information about query : query gpa, total grade points and total credits.

@Params: @gradeDictionary  a Set containning unique grade letters and their value,
@course_code_courses array containing the course name and credit value matching user input, and @course_code_grades
containning the grade letters respectively and is matching the user input.
@creditConstraint containning the valid start and endpoint for credit value in @course_code_courses
*/

export function calculateQueryGPA(
  gradeDictionary,
  course_code_courses,
  course_code_grades,
  creditConstraint
) {
  const query = {
    course_code_total_grade_points: 0,
    course_code_total_credits: 0,
    course_code_GPA: 0,
  };
  let { startPoint, endPoint } = creditConstraint;

  for (let i = 0; i < course_code_courses.length; i++) {
    let courseName = course_code_courses[i].replace(/ /g, "");
    let gradeLetter = course_code_grades[i];

    let courseCredit = courseName.substring(
      courseName.length - startPoint,
      courseName.length - endPoint
    ); //grabs the digit of the credit from courseName ex: 3.00 from LE/EECSXXXX3.00
    let gradePoint = -1;
    if (gradeDictionary.has(gradeLetter)) {
      gradePoint = gradeDictionary.get(gradeLetter);
    }

    if (gradePoint >= 0) {
      let creditValue = parseInt(courseCredit);
      let result = gradePoint * creditValue;
      query.course_code_total_grade_points += result;
      query.course_code_total_credits += creditValue;
    }
  }

  //@desc:sets @eecsGPA to 0 if no credit values read to prevent NaN output
  let { course_code_total_credits, course_code_total_grade_points } = query;
  if (course_code_total_credits == 0) query.course_code_GPA = 0;
  else {
    query.course_code_GPA = (
      course_code_total_grade_points / course_code_total_credits
    ).toFixed(2);
  }
  console.log(" gp " + course_code_total_grade_points);
  return query;
}

export function calculateGPA(gradeDictionary, credits, grades) {
  let gpaObject = {
    gpa: 0,
    totalCredits: 0,
    totalGradePoints: 0,
  };

  for (let i = 0; i < credits.length; i++) {
    let gradeLetter = grades[i];
    let gradePoint = -1;
    if (gradeDictionary.has(gradeLetter)) {
      gradePoint = gradeDictionary.get(gradeLetter);
    }

    if (gradePoint >= 0) {
      gpaObject.totalCredits += parseInt(credits[i]);
      gpaObject.totalGradePoints += gradePoint * parseInt(credits[i]);
    }
  }

  let { totalCredits, totalGradePoints } = gpaObject;

  if (totalCredits == 0) gpaObject.gpa = 0;
  else {
    gpaObject.gpa = (totalGradePoints / totalCredits).toFixed(2);
  }

  return gpaObject;
}

/*
@Description: copys the grades and course  names from @course_code_grades and @course_code_courses that do not contain 
an empty value or pass grade letter.

@Returns: an array containning the grade letters and courses without an invalid value.

@Params: @gradeDictionary  a Set containning unique grade letters and their value,
@course_code_courses array containing the course name and credit value matching user input, and @course_code_grades
containning the grade letters respectively and is matching the user input.

@Note: A pass grade letter p does  not get included in calculation and so do not get displayed.
In addition, this function currently is not in use, implemented for later use maybe.
*/

export function copyGradesAndCourses(
  gradeDictionary,
  course_code_courses,
  course_code_grades
) {
  let count = 0;
  let gradesAndCourses = [];
  for (let i = 0; i < course_code_courses.length; i++) {
    let gradeLetter = course_code_grades[i];
    let gradePoint = -1;
    if (gradeDictionary.has(gradeLetter)) {
      gradePoint = gradeDictionary.get(gradeLetter);
    }

    if (gradePoint >= 0) {
      gradesAndCourses[count++] =
        course_code_courses[i] + " grade: " + course_code_grades[i] + " ";
    }
  }
  return gradesAndCourses;
}
