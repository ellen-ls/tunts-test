# Tunts Test 

## Automatic Update of Student Grades in Google Sheets
This is a Node.js script that automates the calculation of student grades based on the grades and absences recorded in a 
Google Sheets spreadsheet. The script also automatically updates the spreadsheet with student statuses such as 
**"Aprovado"**, **"Reprovado por falta"**, **"Exame final"**, or **"Reprovado por nota"**.

## Requirements

- Node.js installed on your machine.
  
- Google Sheets API credentials.

## Challenge

- Read a Google Sheets spreadsheet :heavy_check_mark:
  
- Search for the necessary information :heavy_check_mark:

- Calculate and write the result in the spreadsheet :heavy_check_mark:

## Configurations
1- Clone this repository to your local environment.

2- Install Node.js dependencies using the following command:
```npm install ```

3- Get your Google Sheets API credentials:
  
 - Go to the [Google Cloud Console page](https://console.cloud.google.com/).
  
 - Create a new project or select an existing one.

 - Enable the Google Sheets API for your project.

 - Create a service credential with Google Sheets API access.

 - Download the JSON credentials file and save it in the project directory as _credentials.json_.


 4- Open the _index.js_ file and update the sheet ID and cell range as needed :
   
```
 const spreadsheetId = 'YOUR_SPREADSHEET_ID';

 const range = 'SHEET_NAME!A4:H';
```

5- Run the script using the following command:
```node index.js```

This will read the data from the specified spreadsheet, calculate the students' grades, and automatically update the students' statuses in the spreadsheet.

## Customization

You can customize the grade calculation rules and student statuses by modifying the _calculeSituation()_ function in the _index.js_ file. This function contains the logic to determine whether a student has passed, failed due to absence, needs a final exam, etc.

## Author

### Ellen Lima e Silva

## Spreadsheet link

### [Google sheets Ellen Lima e Silva](https://docs.google.com/spreadsheets/d/1uvGyCnl2RqYw-x2fljbLVjmd2vR6ZT9d3h3mfEHMPRE/edit?usp=sharing)

