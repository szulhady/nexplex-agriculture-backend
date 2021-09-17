const express = require("express");
const router = express.Router();
const connection = require("../../config/database");

router.get("/", (req, res, next) => {
  const table= req.query.table;
  const station= req.query.station;
  const val=req.query.val;
  // const mysql = require("mysql");

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
  function date() {
    var yy = today.getFullYear();
    today = yy;
  }
  date();

  var ret = [];
  var dat = [];
  var q = `SELECT MIN(${val}) as min,MAX(${val}) as max, AVG(${val}) as avg,timestamp, MONTH(timestamp) AS month,YEAR(timestamp) AS year, DATE_FORMAT(timestamp, "%d/%c/%y") AS date ,  DATE_FORMAT(timestamp, "%M") AS monthname FROM ${table} WHERE tid="${station}" && DATE_FORMAT(timestamp, "%Y")="${today}" GROUP BY month,year ORDER BY month;`;
  //   var q = `SELECT * FROM sonar_data ORDER BY timestamp `;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {

      for (var i = 0; i < row.length; i++) {
        //   if (row[i].hour < 10) {
        //     row[i].hour = "0" + row[i].hour;
        //   }
        dat.push({
          min: row[i].min.toFixed(2),
          max: row[i].max.toFixed(2),
          avg: row[i].avg.toFixed(2),
          timestamp: row[i].timestamp,

          month: row[i].month,
          date: row[i].date,
          monthname: row[i].monthname,
        });
      }
    }

    ret = JSON.stringify(dat);
    res.header("Content-Type", "application/json; charset=utf-8");
    res.send(ret);
  });
  // connection.end();
});
module.exports = router;
