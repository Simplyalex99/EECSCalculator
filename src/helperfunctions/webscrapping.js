export function getHTMLTableWithGrades() {
  let tables = document.querySelectorAll("table"); //gets an array of table elements
  let tableWithGrades =
    tables.length <= 8 ? tables[6] : tables[tables.length - 1]; //  gets table with all grades and courses; 8 is table on grades yorku ,and [6] is from DPR(DegreeProgesReport)
  let bodyContentHTML = tableWithGrades.getElementsByTagName("tbody")[0];
  return bodyContentHTML;
}

export function getIndexWithGrades(bodyContentHTML) {
  let secondTableRow = bodyContentHTML.getElementsByTagName("tr")[1];
  let indexPositionWithGrades = 0;
  let textInTdElement = secondTableRow
    .getElementsByTagName("td")[2]
    .innerHTML.replace(/ /g, "");
  indexPositionWithGrades = textInTdElement.length > 4 ? 3 : 2; // checks which td element has the grade letter depending if site is DPG or gradesYorku
  return indexPositionWithGrades;
}
