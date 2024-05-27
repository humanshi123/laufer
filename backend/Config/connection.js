// Config/connection.js
const mysql = require('mysql');

const con = mysql.createConnection({
  host: "localhost",  
  user: "root",      
  password: "",      
  database: "suman" 
});

con.connect(function(err) {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    return;
  }
  console.log("Connected to MySQL!");
});

module.exports = con;
