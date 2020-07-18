# EECSCalculator

## Description
An extension that calculates the eecs gpa in degree progress report page in the developer tools console


## setup
- Download folder degreeProgressReport with its files
- Add the files as a browser extension; In the browser go to extensions, enable dev tools and click "load unpack" then select the degreeProgess file.
- In the manifest.json file,  you will find "matches": ["https://w6prod.sis.yorku.ca/yda/student"] . Replace the url in the manifest.json file  with  the url in       your  degree report page
- refresh the extension
- enable the extension as if might be set off and not appear next to extension icon.
- To see eecs gpa, go to your degree progress report with grades and check the console! You can now see your eecs gpa whenever you need to even if grade report    updates

### To-do:
Allow a pop up window to display eecs gpa.
