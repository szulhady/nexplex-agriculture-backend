const express = require("express");
const router = express.Router();

// const connection = require("../../config/database");
const connection = require("../../config/database");

// connection.query(`USE nexplex_agriculture`);
router.get("/", (req, res, next) => {
  const table= req.query.table;
  const station= req.query.station;
  const sensor=req.query.sensor;
  // const mysql = require("mysql");
  // console.log(station)

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

  function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    // Return array of year and week number
    // console.log(weekNo)
    if(weekNo<10){
      weekNo='0'+weekNo
    }
    return weekNo;
  }
  var d = new Date();
  var year = d.getFullYear();
  var week = getWeekNumber(new Date());
  // console.log(week)
  // console.log(year)

  var ret = [];
  var dat = [];
  var q = `SELECT MIN(${sensor}) as min,MAX(${sensor}) as max, AVG(${sensor}) as avg,timestamp, DATE_FORMAT(timestamp, "%a") AS day, DATE_FORMAT(timestamp, "%d/%c/%y") AS date FROM ${table} WHERE tid="${station}" && DATE_FORMAT(timestamp, "%Y")="${year}" && DATE_FORMAT(timestamp, "%u")="${week}" GROUP BY day ORDER BY date;`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {

      let min=[]
      let max=[]
      let avg = []
      let time = []

      for (var i = 0; i < row.length; i++) {
        min.push(row[i].min)
        max.push(row[i].max)
        avg.push(row[i].avg)
        time.push(row[i].day)
        // dat.push({
        //   min: row[i].min.toFixed(2),
        //   max: row[i].max.toFixed(2),
        //   avg: row[i].avg.toFixed(2),
        //   timestamp: row[i].timestamp,
        //   date: row[i].date,
        //   day: row[i].day,
        // });
      }
      dat = {
        min:min,
        max:max,
        avg:avg,
        time:time
      }
    }

    ret = JSON.stringify(dat);
    // console.log(ret)
    res.header("Content-Type", "application/json; charset=utf-8");
    res.send(ret);
  });
  // connection.end();
});
module.exports = router;
