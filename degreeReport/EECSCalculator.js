const { DH_CHECK_P_NOT_PRIME } = require("constants");

document.addEventListener(
  "DOMContentLoaded",
  function () {
    document.querySelector("p").innerHTML = function getGpa() {
      chrome.tabs.query({ currentWindow: true, active: true }, function (
        tabs
      ) {});
    };
  },
  false
);
