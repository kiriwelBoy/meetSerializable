let mysql = require('mysql');

console.log('Get connection !!!');

const con = mysql.createConnection({
    database: 'MeetCourseAnalyzer',
    host: 'localhost',
    user: 'Meet_Course_Analyzer',
    password: 'passer'
});

module.exports = con;