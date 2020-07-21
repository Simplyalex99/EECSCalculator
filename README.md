# GPACalculator

## Description
An extension for yorku students that calculates culminative gpa of one's query in  the degree progress report page or york university course grade page. For example, entering LE/EECS will give you the overall gpa for all eecs courses including the courses  and grades corresponding to that faculty as well as total grade point and credits.

![](gpaPreview.png)


## setup
- Download the folder degreeProgressReport with its files (You can please find an arrow in the green bar "Code" subheading that has an option to download via zip)

- Add the files as a browser extension; In the browser go to extensions, enable dev tools and click "load unpack" then select the degreeProgess folder.
  Enable the extension as if might be set off and not appear next to extension icon.

- Copy the URL of the site and replace the URL next to the "matches" in manifest.json file with your URL of the page.

- Make sure to save then refresh the extension anytime changes are made.

 To calculate the gpa of certain course faculty, go to your degree progress report page (https://myacademicrecord.students.yorku.ca/degree-progress-report) with    the page showing the grades or (https://myonlineservices.students.yorku.ca/ in course and grade list section) 

Enter your choice by clicking on the "eecs calculator " extension! You can now see your gpa of choice whenever you need to!

-  **Note: If the following error appears on the console "runtime.lastError", refresh the webpage. Must also be on the webpage specified in the last step to calculate your choice of gpa for a faculty**


### To-do:
Improve the structure of the code and visual aspects of the extension's UI.

### Special thanks:
To all those who helped!
