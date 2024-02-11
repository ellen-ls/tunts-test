require("dotenv").config()
const { google } = require('googleapis');
const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json', // Pulling credentials in json form
    scopes: ['https://www.googleapis.com/auth/spreadsheets'] //Pulling Google Sheets API
});

const sheets = google.sheets({ version: 'v4', auth }); //By entering the Google version and authorization, you can achieve this in the documentation

// Function to calculate the student's situation
function calculeSituation(media, absences, totalClasses) {
    if (absences > 0.25 * totalClasses) {
        console.log('Repproved for absence')
        return { situation: "Reprovado por falta", naf: 0 };// if the total number of absences is greater than 0.25 times the number of classes (60 classes per semester) you will repproved for absence
    }
    else if (media <= 50 || media < 70 ) {   
        const naf = Math.ceil((50 + media)/2);
        console.log("Final exams");
        console.log(`Grade to final approved: ${naf}`);
        return { situation: "Exame Final", naf}; // if the media (P1 + P2 + P3 /2) is less than or equal to 50 or media is less than 70 you go to the final test
    } else if (media >= 70) {
        console.log("Approved");
        return { situation: "Aprovado", naf: 0 }; // if the media is more than or equal to 70 you are approved
    } else {
        console.log("Reprove to grade");
        return { situation: "Reprovado por Nota", naf: 0 }; 
    }
}
// Function to read and write on sheets media, absences and totalClasses
async function readAndWriteToSheets() {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId:process.env.SpreadsheetId, // Key to get the spreadsheet
            range: 'engenharia_de_software!A4:H', // Specify the range of cells you want to read
        });

        const rows = response.data.values;
                 
        if (rows.length) {
            const totalClasses = 60;
            const updateValues = [];

            rows.forEach(row => { // Take for each students and calculate the media and absence to pass the students status
                const name = row[1]; // Take the Student's names
                const p1 = parseFloat(row[3]); // first grade
                const p2 = parseFloat(row[4]); // second grade
                const p3 = parseFloat(row[5]); // third grade
                const media = Math.ceil((p1 + p2 + p3) / 3); // media's calcule
                const absences = parseInt(row[2]); // number of absences
                console.log(`Student's situation ${name}:`);
                console.log('Media of student is: ' + parseFloat(media)); 
                console.log('Absences: ' + absences)
                
                const situation = calculeSituation(media, absences, totalClasses); //take the situation and naf calculated in 
                                                                                   //function and take the information about the students
                updateValues.push([situation.situation, situation.naf]); // taking the data and putting it into the spreadsheet 
                               
                console.log(situation)
                console.log("-------------------------");
                return situation
            });
            
            const updateResponse = await sheets.spreadsheets.values.update({ // Update the spreadsheet
                spreadsheetId:process.env.spreadsheetId, // Key to get the spreadsheet
                range: 'engenharia_de_software!G4:H', // Specify the range where you want to update
                valueInputOption: 'USER_ENTERED', 
                resource: {
                    values: updateValues
                }
            });

            console.log(`${updateResponse.data.updatedCells} cells updated.`);
            return updateResponse
        } else {
            console.log('No data found in the spreadsheet.');
        }
    } catch (error) {
        console.error('Error reading or writing to the spreadsheet:', error);
    }
}

readAndWriteToSheets();