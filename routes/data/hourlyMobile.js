const express = require("express");
const router = express.Router();
// const mysql = require("mysql");
const connection = require("../../config/database");

connection.query(`USE nexplex_agriculture`);

router.get("/", (req, res, next) => {

  const table= req.query.table;
  const station= req.query.station;
  const sensor = req.query.sensor

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

// var q = `SELECT MIN(soilNPK_val) as minNPK, MAX(soilNPK_val) as maxNPK, AVG(soilNPK_val) as avgNPK, MIN(soilPH_val) as minPH, MAX(soilPH_val) as maxPH, AVG(soilPH_val) as avgPH, MIN(soilEC_val) as minEC, MAX(soilEC_val) as maxEC, AVG(soilEC_val) as avgEC, MIN(soilMS_val) as minMS, MAX(soilMS_val) as maxMS, AVG(soilMS_val) as avgMS, MIN(soilTEMP_val) as minTEMP, MAX(soilTEMP_val) as maxTEMP, AVG(soilTEMP_val) as avgTEMP,timestamp, HOUR(timestamp) AS hour, DATE_FORMAT(timestamp, "%d/%c/%y") AS date FROM ${table} WHERE sid="${station}" && DATE_FORMAT(timestamp, "%e/%c/%Y")="${today}" GROUP BY hour,date ORDER BY hour;`;
var q = `SELECT MIN(${sensor}) as min, MAX(${sensor}) as max, AVG(${sensor}) as avg,timestamp, HOUR(timestamp) AS hour, DATE_FORMAT(timestamp, "%d/%c/%y") AS date FROM ${table} WHERE tid="${station}" && DATE_FORMAT(timestamp, "%e/%c/%Y")="${today}" GROUP BY hour,date ORDER BY hour;`;

let dat
// let dat=[]
// connection.connect();
connection.query(q, function (error, row, fields) {
  if (error) {
    console.log(error);
  }
  if (row) {
    console.log(row)
    let min=[]
    let max=[]
    let avg = []
    let time = []
 
    for (var i = 0; i < row.length; i++) {
      if (row[i].hour < 10) {
        row[i].hour = "0" + row[i].hour;
      }
      if(row[i].hour%2 == 0){


      min.push(row[i].min)
      max.push(row[i].max)
      avg.push(row[i].avg)
      time.push(row[i].hour)
    }
      // dat.push({
      //   min: row[i].min.toFixed(2),
      //   max: row[i].max.toFixed(2),
      //   avg: row[i].avg.toFixed(2),
      //   // minPH: row[i].minPH.toFixed(2),
      //   // maxPH: row[i].maxPH.toFixed(2),
      //   // avgPH: row[i].avgPH.toFixed(2),
      //   // minEC: row[i].minEC.toFixed(2),
      //   // maxEC: row[i].maxEC.toFixed(2),
      //   // avgEC: row[i].avgEC.toFixed(2),
      //   // minMS: row[i].minMS.toFixed(2),
      //   // maxMS: row[i].maxMS.toFixed(2),
      //   // avgMS: row[i].avgMS.toFixed(2),
      //   // minTEMP: row[i].minTEMP.toFixed(2),
      //   // maxTEMP: row[i].maxTEMP.toFixed(2),
      //   // avgTEMP: row[i].avgTEMP.toFixed(2),
      //   timestamp: row[i].timestamp,
      //   hour: row[i].hour,
      //   date: row[i].date,
      // });
    }
    dat = {
      min:min,
      max:max,
      avg:avg,
      time:time
    }
    // dat=row
    console.log(dat);
  }
// console.log(dat)
  ret = JSON.stringify(dat);
  // console.log(ret)
  // res.header("Content-Type", "application/json; charset=utf-8");
  res.send(ret);
});
// connection.end();
});
module.exports = router;
