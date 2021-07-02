/* 
@Desription: checks if HTML table is length 6 from  Yorku grades' page else from degree progess report page and 
@Returns the HTML table containning the grades.
*/
export function getHTMLTableWithGrades() {
  let tables = document.querySelectorAll("table");
  let tableWithGrades =
    tables.length <= 8 ? tables[6] : tables[tables.length - 1];
  let bodyContentHTML = tableWithGrades.getElementsByTagName("tbody")[0];
  return bodyContentHTML;
}
/* 
@Desription: checks which element inside @bodyContentHTML contains grades. Yorku  grades website contains 
grade letter at 2nd table row element and degree report page at 3rd table row element.
@Returns a numerical value of the index containning the html element with grades
@Param: @bodyContentHTML a reference to the HTML element table containning the grades.
*/
export function getIndexWithGrades(bodyContentHTML) {
  let secondTableRow = bodyContentHTML.getElementsByTagName("tr")[1];
  let indexPositionWithGrades = 0;
  let textInTdElement = secondTableRow
    .getElementsByTagName("td")[2]
    .innerHTML.replace(/ /g, "");
  indexPositionWithGrades = textInTdElement.length > 4 ? 3 : 2;
  return indexPositionWithGrades;
}
