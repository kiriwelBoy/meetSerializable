const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const con = require('db');
//const conn= require('db.js');
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/admin.reports.audit.readonly'];
//  token.json sauvegarde l'acces de lu'utilisateur et genere automatiquement ce fichier 
const TOKEN_PATH = 'token.json';

fs.readFile('credentials.json', (err, content) => {
    if (err) return console.error('Error loading client secret file', err);

    // Auorise le client à acceder aux credentials 

    authorize(JSON.parse(content), infoMeet);
});

function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oauth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oauth2Client, callback);
        oauth2Client.credentials = JSON.parse(token);
        callback(oauth2Client);
    });
}

function getNewToken(oauth2Client, callback) {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oauth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oauth2Client.credentials = token;
            storeToken(token);
            callback(oauth2Client);
        });
    });
}


function storeToken(token) {
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.warn(`Token not stored to ${TOKEN_PATH}`, err);
        console.log(`Token stored to ${TOKEN_PATH}`);
    });
}

/**
 * fonction qui  prend  2 paramètres et retourne sa valeur
 */
function findByName(parameters, fieldName) {
    for (const param of parameters) {
        if (param.name === fieldName) {
            if (param.intValue) return param.intValue
            return param.value
        }
        console.log(param);
    }

}
let participant = Object();
let seance = Object();
let participants = [];
let seances = [];
let participant_trouve = false;
let seance_trouve = false;

function infoMeet(auth) {
    const service = google.admin({ version: 'reports_v1', auth });
    service.activities.list({
        userKey: 'all',
        applicationName: 'meet',
        eventName: 'call_ended',
        maxResults: 1,
    }, (err, res) => {
        if (err) return console.error('The API returned an error:', err.message);
        const activities = res.data.items;
        if (activities.length) {
            console.log('INFOS MEET:');
            activities.forEach((activity) => {
                //participant.nbConnexion=1;
                let event = activity.events[0];
                seance.partage_ecran = 0;
                participant.nbConnexion = 0;
                const C_id = findByName(activity.events[0].parameters, 'meeting_code');
                const t2 = findByName(activity.events[0].parameters, 'calendar_event_id');
                const ecran = findByName(activity.events[0].parameters, 'video_send_seconds');

                const duree = findByName(activity.events[0].parameters, 'duration_seconds');
                const device = findByName(activity.events[0].parameters, 'device_type');
                const email = findByName(activity.events[0].parameters, 'identifier');
                const presence = findByName(activity.events[0].parameters, 'endpoint_id');
                const location = findByName(activity.events[0].parameters, 'location_region');
                for (let i = 0; i < participants.length; i++) {
                    if (participants[i].conference === participant.conference && participants[i].email === participant.email) {
                        participant_trouve = true;
                        participants[i].nbConnexion++;
                        participants[i].date += participant.date;
                    }
                }
                for (let j = 0; j < seances.length; j++) {
                    if (seances[j].id === seance.id) {
                        seance_trouve = true;
                        seances[j].partage_ecran += seance.partage_ecran;
                    }
                }

                //const t2=activity.id.time;
                const sql = "INSERT IGNORE INTO MeetSeance(id,heureDebut,heureFin,partageEcran) VALUES ('" + C_id + "','" + t2 + "',33,'" + ecran + "')";
                con.query(sql, function(err, result) {
                    //if (err) throw err;
                    if (err) {
                        console.error('error connecting: ' + err.stack);
                        return;
                    }
                    console.log("record inserted successfully");
                });
                const sql2 = "INSERT INTO MeetUsers(PresenceM,terminalType,email,region,nbConnexion) VALUES ('" + duree + "','" + device + "','" + email + "','" + location + "','" + nbConnexion + "')";
                con.query(sql2, function(err, result2) {
                    //if (err) throw err;
                    if (err) {
                        console.error('error connecting: ' + err.stack);
                        return;
                    }
                    console.log("record inserted successfully");
                });
                //con.end();
                //console.log(activity.events[0]);
            });

        } else {
            console.log('No infos found.');
        }
    });
}