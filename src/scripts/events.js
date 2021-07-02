/*
@Description: Onclick event sends user input to content script main.js.
@Note: sendMessage function allows extension and content scripts to share messages
for reference please visit: https://developer.chrome.com/docs/extensions/mv3/messaging/
*/

document.addEventListener(
  "DOMContentLoaded",
  () => {
    document.querySelector("button").addEventListener("click", getGpa, false);

    function getGpa() {
      var response = document.getElementById("user").value;
      chrome.tabs.query(
        { currentWindow: true, active: true },

        function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, response);
        }
      );
    }
  },

  false
);

/* 
@Description: Onclick event redirects user to yorku's grade page  in a new tab
*/

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("redirect-btn")
    .addEventListener("click", clickHandler);
  function clickHandler(e) {
    chrome.tabs.update({
      url: "https://wrem.sis.yorku.ca/Apps/WebObjects/ydml.woa/wa/DirectAction/document?name=CourseListv1",
    });
    window.close();
  }
});
