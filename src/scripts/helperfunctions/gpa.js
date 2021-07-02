export function setCourses(bodyContentHTML, courses, sizeOfTable) {
  for (let i = 0; i < sizeOfTable - 1; i++) {
    let tr2 = bodyContentHTML.getElementsByTagName("tr")[i + 1]; // gets specific tr elementfrom table
    courses[i] = tr2.getElementsByTagName("td")[1]; // gets specific td element with course name from previous tr element
  }
}

export function setGrades(
  bodyContentHTML,
  grades,
  indexWithGrades,
  sizeOfTable
) {
  for (let i = 0; i < sizeOfTable - 1; i++) {
    let tr2 = bodyContentHTML.getElementsByTagName("tr")[i + 1]; // gets specific tr elementfrom table
    grades[i] = tr2.getElementsByTagName("td")[indexWithGrades]; // gets td element with grade letter
  }
}

export function setCourseTerms(bodyContentHTML, terms, sizeOfTable) {
  for (let i = 0; i < sizeOfTable - 1; i++) {
    let tr = bodyContentHTML.getElementsByTagName("tr")[i + 1]; // gets specific tr elementfrom table
    terms[i] = tr.getElementsByTagName("td")[0].innerHTML;
  }
}

export function setCourseCodeDictionary(sizeOfTable, courses) {
  var courseDictionary = new Set();
  for (let i = 0; i < sizeOfTable - 1; i++) {
    let courseCodeOnly = courses[i].innerHTML.substring(0, 7).replace(/ /g, "");
    courseDictionary.add(courseCodeOnly);
  }
  return courseDictionary;
}
