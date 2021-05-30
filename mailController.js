//Controller mailing
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const db = require('./connect');
const controller = db.con;


exports.sendMail = (req, res) => {

    //récupération des emails

    let mail = '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8" /><meta http-equiv="X-UA-Compatible" content="IE=edge" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Document</title></head><body><h1>Bienvenue !</h1><div><p>Voici ci-dessous le lien vers le formulaire à remplir :</p><a href="https://formulairee.herokuapp.com/" target="_blank">formulaire d\'évaluation</a></div></body></html>'

    let students = [];

    controller.query('SELECT email FROM Etudiant', (err, result) => {

        if (err) throw err;

        if (result.length) {
            //console.log(result);    
            for (e in result) {
                students.push(result[e].email);
            }
            //console.log(students);       
        } else {
            console.log("ERREUR! " + err.message);
        }

    });

    //fonctions d'envoi mails
    let options = {
        host: 'smtp.gmail.com',
        port: 465,
        secureConnection: true,
        transportMethod: 'SMTP',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    }

    let mailOptions = {
        from: process.env.MAIL_FROM,
        to: students,
        subject: 'Formulaire d\'enquête! (avec recup mails bd) ',
        html: mail
    };


    let transporter = nodemailer.createTransport(smtpTransport(options));


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("ECHEC D'ENVOI MAIL: " + error.message);
        } else {
            console.log('ENVOI MAIL RÉUSSI! ' + info.response);
        }

    });

}