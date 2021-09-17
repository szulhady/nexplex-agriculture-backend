const express = require("express");
const router = express.Router();
// const mysql = require("mysql");
const connection = require("../../config/database");

router.get("/", (req, res, next) => {

  const table= req.query.table;
  const station= req.query.station;
  const val=req.query.val;

// const connection = mysql.createConnection({
//   host: "zr.airmode.live",
//   user: "digitalman",
//   password: "c1vG7R34",
//   database: "tracker",
//   port: 3306,
// });

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "password",
//   database: "nexplex_agriculture",
//   port: 3306,
// });

var today = new Date();
var year
function date() {
  var dd = today.getDate();
  // if(dd<10){
  //   dd='0'+dd
  // }
  // dd = dd - 1;
  var mm = today.getMonth() + 1;
  year = today.getFullYear();
  today = dd + "/" + mm + "/" + year;
  // console.log(today);
}
date();

var q = `SELECT MIN(${val}) as min,MAX(${val}) as max, AVG(${val}) as avg,timestamp, HOUR(timestamp) AS hour, DATE_FORMAT(timestamp, "%d/%c/%y") AS date FROM ${table} WHERE tid="${station}" && DATE_FORMAT(timestamp, "%e/%c/%Y")="${today}" GROUP BY hour,date ORDER BY hour;`;
// var q = `SELECT MIN(O2) as min,MAX(O2) as max, AVG(O2) as avg,timestamp, HOUR(timestamp) AS hour, DATE_FORMAT(timestamp, "%e/%c/%y") AS date, DATE(timestamp) as date2 FROM geyser_one WHERE YEAR(timestamp)="${year}" GROUP BY date2, hour ORDER BY date2 ASC, hour;`;

let dat=[]
// connection.connect();
connection.query(q, function (error, row, fields) {
  if (error) {
    console.log(error);
  }
  if (row) {
    for (var i = 0; i < row.length; i++) {
      if (row[i].hour < 10) {
        row[i].hour = "0" + row[i].hour;
      }
      dat.push({
        min: row[i].min.toFixed(2),
        max: row[i].max.toFixed(2),
        avg: row[i].avg.toFixed(2),
        timestamp: row[i].timestamp,
        hour: row[i].hour,
        date: row[i].date,
      });
    }
    // console.log(row);
    dat=row
  }

  ret = JSON.stringify(dat);
  // console.log(ret)
  // res.header("Content-Type", "application/json; charset=utf-8");
  res.send(ret);
});
// connection.end();
});
module.exports = router;
