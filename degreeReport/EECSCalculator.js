

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
