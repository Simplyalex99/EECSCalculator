

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




document.addEventListener('DOMContentLoaded', ()=> {
  document.getElementById('redirect-btn').addEventListener('click', clickHandler);
function clickHandler (e) {

chrome.tabs.update({url: "https://w6prod.sis.yorku.ca/yda/student"});
window.close();


}

});
/*

Add option to direct user to DPR or grades yorku in button. Make sure to make the formatting of buttons 
and instructions clear and simple so user know in a blink of an eye what to do.


*/