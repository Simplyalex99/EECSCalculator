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
    temp = coursesHTML[i].innerHTML.substring(0, 7).replace(/ /g, "");
    if (temp === course_code || temp === temporaryCourseCode) {
      temp = coursesHTML[i].innerHTML;
      let courseText =
        tdPositionWithGrades === 3
          ? temp.substring(0, 12) + " " + temp.substring(19, temp.length)
          : temp; // if site is not DPR then gets rid of &nbsp text
      course_code_courses[index] = courseText;
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
  for (let i = 0; i < gradesHTML.length; i++) {
    let gradeLetter = gradesHTML[i].innerHTML;
    grades_copy[index] = gradeLetter.replace(/ /g, "");
    index++;
  }
  return grades_copy;
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

export function calculateQueryGPA() {}
