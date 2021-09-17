const express = require("express");
const router = express.Router();
const connection = require("../../config/database");

router.get("/", (req, res, next) => {
  const table= req.query.table;
  const station= req.query.station;
  const sensor = req.query.sensor

  var today = new Date();
  function date() {
    var yy = today.getFullYear();
    today = yy;
  }
  date();

  var ret = [];

  let dat
  var q = `SELECT MIN(${sensor}) as min,MAX(${sensor}) as max, AVG(${sensor}) as avg,timestamp, MONTH(timestamp) AS month,YEAR(timestamp) AS year, DATE_FORMAT(timestamp, "%d/%c/%y") AS date ,  DATE_FORMAT(timestamp, "%M") AS monthname FROM ${table} WHERE tid="${station}" && DATE_FORMAT(timestamp, "%Y")="${today}" GROUP BY month,year ORDER BY month;`;

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
        //   if (row[i].hour < 10) {
        //     row[i].hour = "0" + row[i].hour;
        //   }
        min.push(row[i].min)
        max.push(row[i].max)
        avg.push(row[i].avg)
        time.push(row[i].monthname)

        // dat.push({
        //   min: row[i].min.toFixed(2),
        //   max: row[i].max.toFixed(2),
        //   avg: row[i].avg.toFixed(2),
        //   timestamp: row[i].timestamp,

        //   month: row[i].month,
        //   date: row[i].date,
        //   monthname: row[i].monthname,
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
    res.header("Content-Type", "application/json; charset=utf-8");
    res.send(ret);
  });
  // connection.end();
});
module.exports = router;
