//controller + routage auth
const { json } = require('body-parser');
const express = require('express');
const db = require('./connect');
const controller = db.con;

const router = express.Router();

router.get('/', (req, res) => {
    res.send('hello')
});

//recupération des données d'auth par méthod post
router.post('/', (req, res) => {

    if (req.body) {

        console.log(req.body);

        let { login, password } = req.body;
        //verification des données de la bd 
        controller.query('SELECT * FROM Prof WHERE identifiant = ? AND mdpasse = ?', [login, password], (err, result) => {

            if (err) throw err;
            //renvoi résultat vers plugin
            if (result.length) {
                console.log(result);
                return res.status(200).send({ message: "Bienvenue!" });

            } else if (!result.length) {
                console.log("Ce prof n'existe pas!");
                return res.status(404).send({ message: "404 ERROR!" });
            }

        });

    }

})

module.exports = router;