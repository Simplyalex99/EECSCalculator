const { DH_CHECK_P_NOT_PRIME } = require("constants");

var response = document.getElementById("user").value;

document.addEventListener(
  "DOMContentLoaded", ()=>{

document.querySelector('button').addEventListener('click',getGpa,false)

function getGpa(){

chrome.tabs.query({currentWindow:true,active:true},
  
  function(tabs){

chrome.tabs.sendMessage(tabs[0].id,response)



  }
  
  
  
  )


}



  }
  
,false)
