let mysql = require('mysql');
let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "kiriBoss",
    database: "mydb"
  });

con.connect();
module.exports = con