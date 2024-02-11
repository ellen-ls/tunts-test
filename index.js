const { google } = require('googleapis');
const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json', // Path to credentials file
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });

// Function to calculate the student's situation
function calcularSituacao(media, absences, totalClasses) {
    if (absences > 0.25 * totalClasses) {
        return { situation: "Repproved for absence", naf: 0 };
    }
    else if (media < 50 || media < 70 ) {
        const naf = Math.max(50 + media)/2;
        return { situation: "Final test", naf};
    } else if (media >= 70) {
        return { situation: "Approved", naf: 0 };
    } else {
        return { situation: "Repproved for Grade", naf: 0 };
    }
}
// Function to read and write on sheets media, absences and totalClasses
async function readAndWriteToSheets() {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: '1uvGyCnl2RqYw-x2fljbLVjmd2vR6ZT9d3h3mfEHMPRE',
            range: 'engenharia_de_software!A4:H', // Specify the range of cells you want to read
        });

        const rows = response.data.values;
                 
        if (rows.length) {
            const totalClasses = 60;
            const updateValues = [];

            rows.forEach(row => {
                const nome = row[1];
                const p1 = parseFloat(row[3]);
                const p2 = parseFloat(row[4]);
                const p3 = parseFloat(row[5]);
                const media = Math.ceil((p1 + p2 + p3) / 3);
                const absences = parseInt(row[2]);
                const situation = calcularSituacao(media, absences, totalClasses);
                updateValues.push([situation.situation, situation.naf]);
                return situation
            });
            
            const updateResponse = await sheets.spreadsheets.values.update({
                spreadsheetId: '1uvGyCnl2RqYw-x2fljbLVjmd2vR6ZT9d3h3mfEHMPRE',
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