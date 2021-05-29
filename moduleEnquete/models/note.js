let connexion = require('../config/db')
class Note{

    static create( content, note, cb){
        connexion.query('INSERT INTO note(note, commentaire) VALUES  ( ?, ?)',[content, note], (err, result) =>{
            if (err) {
                throw err               
            }
            cb(result)
        })
    }
}
module.exports = Note