const express = require('express')
const router = express.Router()
const connection = require("../../config/database");

var mqtt = require('mqtt')
var client  = mqtt.connect('ws://www.txio.live:8083/mqtt')

const mysql = require("mysql");


// const connection = mysql.createPool ({
//   host: "192.168.0.148",
//   user: "root",
//   password: "c1vG7R34",
//   database: "nexplex_agriculture",
//   port: 3306,
// });

// const connection = mysql.createPool ({
//   host: "157.245.49.210",
//   user: "digitalman",
//   password: "c1vG7R34",
//   database: "nexplex_agriculture",
//   port: 3306,
// });

// GET
// NUTREINT PREPARATION //
router.get('/api/schedule/ipah1/nutrient',(req,res)=>{
  dat = [];
  var q = `SELECT * FROM ipah_nutrient_schedule order by date asc`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      // console.log(row)
      for (var i = 0; i < row.length; i++) {
        let data2=[]
        // data2.push(`EC value : ${row[i].duration}`)
        data2.push(`Volume : ${row[i].volume} Litre`)
        let data = {
          date:row[i].date,
          time:row[i].time,
          remarks:data2,
        }
        dat.push(
          data
        );
      }
      ipah1=dat
    }
    ret = JSON.stringify(ipah1)
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(ret)
  });
})

router.get('/api/schedule/ipah2/nutrient',(req,res)=>{
  dat = [];
  var q = `SELECT * FROM tkpmipah_nutrient_schedule order by date asc`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {

      for (var i = 0; i < row.length; i++) {
        let data2=[]
        data2.push(`Tank : ${row[i].tank}, Volume : ${row[i].volume} Litre`)
        let data = {
          date:row[i].date,
          time:row[i].time,
          remarks:data2,
        }
        dat.push(
          data
        );
      }
      ipah1=dat
    }
    ret = JSON.stringify(ipah1)
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(ret)
  });
})

router.get('/api/schedule/tkpmPagoh/nutrient',(req,res)=>{
  dat = [];
  var q = `SELECT * FROM tkpmpagoh_nutrient_schedule order by date asc`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {

      for (var i = 0; i < row.length; i++) {
        let data2=[]
        data2.push(`Duration : ${row[i].duration} minutes`)
        let data = {
          date:row[i].date,
          time:row[i].time,
          remarks:data2,
        }
        dat.push(
          data
        );
      }
      ipah1=dat
    }
    ret = JSON.stringify(ipah1)
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(ret)
  });
})

router.get('/api/schedule/kongPo/nutrient',(req,res)=>{
  dat = [];
  var q = `SELECT * FROM kongpo_nutrient_schedule order by date asc`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      for (var i = 0; i < row.length; i++) {
        let data2=[]
        data2.push(`Duration : ${row[i].duration} minutes`)
        let data = {
          date:row[i].date,
          time:row[i].time,
          remarks:data2,
        }
        dat.push(
          data
        );
      }
      ipah1=dat
    }
    ret = JSON.stringify(ipah1)
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(ret)
  });
})

router.get('/api/schedule/manong/nutrient',(req,res)=>{
  dat = [];
  var q = `SELECT * FROM manong_nutrient_schedule WHERE date >= CURDATE() order by date asc`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      for (var i = 0; i < row.length; i++) {
        let data2=[]
        data2.push(`EC value : ${row[i].ec}`)
        let data = {
          date:row[i].date,
          time:row[i].time,
          remarks:data2,
        }
        dat.push(
          data
        );
      }
      ipah1=dat
    }
    ret = JSON.stringify(ipah1)
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(ret)
  });
})

router.get('/api/schedule/kelantan1/nutrient',(req,res)=>{
  dat = [];
  var q = `SELECT * FROM kelantan1_nutrient_schedule WHERE date >= CURDATE() order by date asc`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      for (var i = 0; i < row.length; i++) {
        let data2=[]
        data2.push(`EC value : ${row[i].ec}`)
        let data = {
          date:row[i].date,
          time:row[i].time,
          remarks:data2,
        }
        dat.push(
          data
        );
      }
      ipah1=dat
    }
    ret = JSON.stringify(ipah1)
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(ret)
  });
})

router.get('/api/schedule/kelantan2/nutrient',(req,res)=>{
  dat = [];
  var q = `SELECT * FROM kelantan2_nutrient_schedule WHERE date >= CURDATE() order by date asc`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      for (var i = 0; i < row.length; i++) {
        let data2=[]
        data2.push(`EC value : ${row[i].ec}`)
        let data = {
          date:row[i].date,
          time:row[i].time,
          remarks:data2,
        }
        dat.push(
          data
        );
      }
      ipah1=dat
    }
    ret = JSON.stringify(ipah1)
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(ret)
  });
})

router.get('/api/schedule/terengganu1/nutrient',(req,res)=>{
  dat = [];
  var q = `SELECT * FROM terengganu1_nutrient_schedule WHERE date >= CURDATE() order by date asc`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      for (var i = 0; i < row.length; i++) {
        let data2=[]
        data2.push(`EC value : ${row[i].ec}`)
        let data = {
          date:row[i].date,
          time:row[i].time,
          remarks:data2,
        }
        dat.push(
          data
        );
      }
      ipah1=dat
    }
    ret = JSON.stringify(ipah1)
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(ret)
  });
})

router.get('/api/schedule/terengganu2/nutrient',(req,res)=>{
  dat = [];
  var q = `SELECT * FROM terengganu2_nutrient_schedule WHERE date >= CURDATE() order by date asc`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      for (var i = 0; i < row.length; i++) {
        let data2=[]
        data2.push(`EC value : ${row[i].ec}`)
        let data = {
          date:row[i].date,
          time:row[i].time,
          remarks:data2,
        }
        dat.push(
          data
        );
      }
      ipah1=dat
    }
    ret = JSON.stringify(ipah1)
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(ret)
  });
})

router.get('/api/schedule/kertih1/nutrient',(req,res)=>{
  dat = [];
  var q = `SELECT * FROM kertih1_nutrient_schedule WHERE date >= CURDATE() order by date asc`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      for (var i = 0; i < row.length; i++) {
        let data2=[]
        data2.push(`EC value : ${row[i].ec}`)
        let data = {
          date:row[i].date,
          time:row[i].time,
          remarks:data2,
        }
        dat.push(
          data
        );
      }
      ipah1=dat
    }
    ret = JSON.stringify(ipah1)
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(ret)
  });
})

router.get('/api/schedule/kertih2/nutrient',(req,res)=>{
  dat = [];
  var q = `SELECT * FROM kertih2_nutrient_schedule WHERE date >= CURDATE() order by date asc`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      for (var i = 0; i < row.length; i++) {
        let data2=[]
        data2.push(`EC value : ${row[i].ec}`)
        let data = {
          date:row[i].date,
          time:row[i].time,
          remarks:data2,
        }
        dat.push(
          data
        );
      }
      ipah1=dat
    }
    ret = JSON.stringify(ipah1)
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(ret)
  });
})

router.get('/api/schedule/kuantan/nutrient',(req,res)=>{
  dat = [];
  var q = `SELECT * FROM kuantan_nutrient_schedule WHERE date >= CURDATE() order by date asc`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      for (var i = 0; i < row.length; i++) {
        let data2=[]
        data2.push(`EC value : ${row[i].ec}`)
        let data = {
          date:row[i].date,
          time:row[i].time,
          remarks:data2,
        }
        dat.push(
          data
        );
      }
      ipah1=dat
    }
    ret = JSON.stringify(ipah1)
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(ret)
  });
})

// POST //
// NUTREINT PREPARATION //
router.post('/api/setSchedule/ipah1/nutrient',(req,res)=>{
// console.log(req.body.block)
    // ret = JSON.stringify(ipah1)
    // let dateArray = req.body.date
    // let duration = req.body.duration
    let status=''

    let dateArray = req.body.date
    let volume = req.body.volume
    let time = req.body.time
  

    let stringMysql = ''
    dateArray.forEach((date, index, array)=>{
      if(index === array.length - 1){
        stringMysql =stringMysql + `('${date}','03:00:00', '${volume}')`
      }else{
        stringMysql =stringMysql + `('${date}','03:00:00', '${volume}'),`
      }
    })
console.log(stringMysql)
    var q = `INSERT INTO ipah_nutrient_schedule (date,time,volume) VALUES ${stringMysql}`;
    connection.query(q, function (error, row, fields) {
      if (error) {
        status = error.sqlMessage
        console.log(error)
      }
      if (row) {
      status = 'Success'
      console.log(row)
      }
      // client.publish('debug/test/database/ipah1', 'updated')
      res.header('Content-Type', 'application/json; charset=utf-8')
      res.send(status)
    });
;
})

router.post('/api/setSchedule/ipah2/nutrient',(req,res)=>{
  let dateArray = req.body.date
  let volume = req.body.volume
  let time = req.body.time
  let tank = req.body.tank
  // console.log('ec',ec)
  // let duration = req.body.duration
  let status=''

  let stringMysql = ''
  dateArray.forEach((date, index, array)=>{
    if(index === array.length - 1){
      stringMysql =stringMysql + `('${date}','03:00:00', '${tank}', ${volume})`
      // stringMysql =stringMysql + `('${date}','03:00:00', '${tank}', ${volume})`
    }else{
      stringMysql =stringMysql + `('${date}','03:00:00', '${tank}', ${volume}),`
      // stringMysql =stringMysql + `('${date}','03:00:00', '${tank}', ${volume}),`
    }
  })
  console.log(stringMysql)
      var q = `INSERT INTO tkpmipah_nutrient_schedule (date,time,tank,volume) VALUES ${stringMysql}`;
      connection.query(q, function (error, row, fields) {
        if (error) {
          status = error.sqlMessage
        }
        if (row) {
        status = 'Success'
        }
        // client.publish('debug/test/database/ipah2', 'updated')
        res.header('Content-Type', 'application/json; charset=utf-8')
        res.send(status)
      });
  ;
})

router.post('/api/setSchedule/tkpmPagoh/nutrient',(req,res)=>{
  let dateArray = req.body.date
  let duration = req.body.duration
  let status=''

  let stringMysql = ''
  dateArray.forEach((date, index, array)=>{
    if(index === array.length - 1){
      stringMysql =stringMysql + `('${date}','03:00:00', '${duration}')`
    }else{
      stringMysql =stringMysql + `('${date}','03:00:00', '${duration}'),`
    }
  })
      var q = `INSERT INTO tkpmpagoh_nutrient_schedule (date,time,duration) VALUES ${stringMysql}`;
      connection.query(q, function (error, row, fields) {
        if (error) {
          status = error.sqlMessage
        }
        if (row) {
        status = 'Success'
        }
        // client.publish('debug/test/database/ipah2', 'updated')
        res.header('Content-Type', 'application/json; charset=utf-8')
        res.send(status)
      });
  ;
})

router.post('/api/setSchedule/kongPo/nutrient',(req,res)=>{
  let dateArray = req.body.date
  let duration = req.body.duration
  let status=''

  let stringMysql = ''
  dateArray.forEach((date, index, array)=>{
    if(index === array.length - 1){
      stringMysql =stringMysql + `('${date}','03:00:00', '${duration}')`
    }else{
      stringMysql =stringMysql + `('${date}','03:00:00', '${duration}'),`
    }
  })
      var q = `INSERT INTO kongpo_nutrient_schedule (date,time, duration) VALUES ${stringMysql}`;
      connection.query(q, function (error, row, fields) {
        if (error) {
          status = error.sqlMessage
        }
        if (row) {
        status = 'Success'
        }
        // client.publish('debug/test/database/kongPo', 'updated')
        res.header('Content-Type', 'application/json; charset=utf-8')
        res.send(status)
      });
  ;
})

router.post('/api/setSchedule/manong/nutrient',(req,res)=>{
  // console.log(req.body.date)
      // ret = JSON.stringify(ipah1)
      let dateArray = req.body.params.date
      let ec = req.body.params.ec

      let stringMysql = ''
      let status=''
      dateArray.forEach((date, index, array)=>{
        if(index === array.length - 1){

          stringMysql =stringMysql + `('${date}','05:00:00', '${ec}')`
        }else{
          stringMysql =stringMysql + `('${date}','05:00:00', '${ec}'),`
        }
      })

      var q = `INSERT INTO manong_nutrient_schedule (date,time, ec) VALUES  ${stringMysql}`;
      connection.query(q, function (error, row, fields) {
        if (error) {
          console.log(error);
          status = error.sqlMessage
        }
        if (row) {
          // console.log('post manong nutrient success')
          status = 'Success'
          client.publish("np/manong/table/dosing","Table manong nutrient schedule updated")
        //  console.log(row)
        }
        // client.publish('debug/test/database/kongPo', 'updated')
        res.header('Content-Type', 'application/json; charset=utf-8')
        res.send(status)
      });
  ;
}) 

router.post('/api/setSchedule/kelantan1/nutrient',(req,res)=>{
  // console.log(req.body.date)
      // ret = JSON.stringify(ipah1)
      let dateArray = req.body.params.date
      let ec = req.body.params.ec

      let stringMysql = ''
      let status=''
      dateArray.forEach((date, index, array)=>{
        if(index === array.length - 1){

          stringMysql =stringMysql + `('${date}','05:00:00', '${ec}')`
        }else{
          stringMysql =stringMysql + `('${date}','05:00:00', '${ec}'),`
        }
      })

      var q = `INSERT INTO kelantan1_nutrient_schedule (date,time, ec) VALUES  ${stringMysql}`;
      connection.query(q, function (error, row, fields) {
        if (error) {
          console.log(error);
          status = error.sqlMessage
        }
        if (row) {
          // console.log('post manong nutrient success')
          status = 'Success'
        //  console.log(row)
        client.publish("np/7hq1/table/dosing","Table kelantan1 nutrient schedule updated")
        }
        // client.publish('debug/test/database/kongPo', 'updated')
        res.header('Content-Type', 'application/json; charset=utf-8')
        res.send(status)
      });
  ;
}) 

router.post('/api/setSchedule/kelantan2/nutrient',(req,res)=>{
  // console.log(req.body.date)
      // ret = JSON.stringify(ipah1)
      let dateArray = req.body.params.date
      let ec = req.body.params.ec

      let stringMysql = ''
      let status=''
      dateArray.forEach((date, index, array)=>{
        if(index === array.length - 1){

          stringMysql =stringMysql + `('${date}','05:00:00', '${ec}')`
        }else{
          stringMysql =stringMysql + `('${date}','05:00:00', '${ec}'),`
        }
      })

      var q = `INSERT INTO kelantan2_nutrient_schedule (date,time, ec) VALUES  ${stringMysql}`;
      connection.query(q, function (error, row, fields) {
        if (error) {
          console.log(error);
          status = error.sqlMessage
        }
        if (row) {
          // console.log('post manong nutrient success')
          status = 'Success'
          client.publish("np/7hq2/table/dosing","Table kelantan2 nutrient schedule updated")
        //  console.log(row)
        }
        // client.publish('debug/test/database/kongPo', 'updated')
        res.header('Content-Type', 'application/json; charset=utf-8')
        res.send(status)
      });
  ;
}) 

router.post('/api/setSchedule/terengganu1/nutrient',(req,res)=>{
  // console.log(req.body.date)
      // ret = JSON.stringify(ipah1)
      let dateArray = req.body.params.date
      let ec = req.body.params.ec

      let stringMysql = ''
      let status=''
      dateArray.forEach((date, index, array)=>{
        if(index === array.length - 1){

          stringMysql =stringMysql + `('${date}','05:00:00', '${ec}')`
        }else{
          stringMysql =stringMysql + `('${date}','05:00:00', '${ec}'),`
        }
      })

      var q = `INSERT INTO terengganu1_nutrient_schedule (date,time, ec) VALUES  ${stringMysql}`;
      connection.query(q, function (error, row, fields) {
        if (error) {
          console.log(error);
          status = error.sqlMessage
        }
        if (row) {
          // console.log('post manong nutrient success')
          status = 'Success'
          client.publish("np/7hq3/table/dosing","Table terengganu1 nutrient schedule updated")
        //  console.log(row)
        }
        // client.publish('debug/test/database/kongPo', 'updated')
        res.header('Content-Type', 'application/json; charset=utf-8')
        res.send(status)
      });
  ;
}) 

router.post('/api/setSchedule/terengganu2/nutrient',(req,res)=>{
  // console.log(req.body.date)
      // ret = JSON.stringify(ipah1)
      let dateArray = req.body.params.date
      let ec = req.body.params.ec

      let stringMysql = ''
      let status=''
      dateArray.forEach((date, index, array)=>{
        if(index === array.length - 1){

          stringMysql =stringMysql + `('${date}','05:00:00', '${ec}')`
        }else{
          stringMysql =stringMysql + `('${date}','05:00:00', '${ec}'),`
        }
      })

      var q = `INSERT INTO terengganu2_nutrient_schedule (date,time, ec) VALUES  ${stringMysql}`;
      connection.query(q, function (error, row, fields) {
        if (error) {
          console.log(error);
          status = error.sqlMessage
        }
        if (row) {
          // console.log('post manong nutrient success')
          status = 'Success'
          client.publish("np/7hq4/table/dosing","Table terengganu2 nutrient schedule updated")
        //  console.log(row)
        }
        // client.publish('debug/test/database/kongPo', 'updated')
        res.header('Content-Type', 'application/json; charset=utf-8')
        res.send(status)
      });
  ;
}) 

router.post('/api/setSchedule/kertih1/nutrient',(req,res)=>{
  // console.log(req.body.date)
      // ret = JSON.stringify(ipah1)
      let dateArray = req.body.params.date
      let ec = req.body.params.ec

      let stringMysql = ''
      let status=''
      dateArray.forEach((date, index, array)=>{
        if(index === array.length - 1){

          stringMysql =stringMysql + `('${date}','05:00:00', '${ec}')`
        }else{
          stringMysql =stringMysql + `('${date}','05:00:00', '${ec}'),`
        }
      })

      var q = `INSERT INTO kertih1_nutrient_schedule (date,time, ec) VALUES  ${stringMysql}`;
      connection.query(q, function (error, row, fields) {
        if (error) {
          console.log(error);
          status = error.sqlMessage
        }
        if (row) {
          console.log('post manong nutrient success')
          status = 'Success'
          client.publish("np/7hq5/table/dosing","Table kertih1 nutrient schedule updated")
        //  console.log(row)
        }
        // client.publish('debug/test/database/kongPo', 'updated')
        res.header('Content-Type', 'application/json; charset=utf-8')
        res.send(status)
      });
  ;
}) 

router.post('/api/setSchedule/kertih2/nutrient',(req,res)=>{
  // console.log(req.body.date)
      // ret = JSON.stringify(ipah1)
      let dateArray = req.body.params.date
      let ec = req.body.params.ec

      let stringMysql = ''
      let status=''
      dateArray.forEach((date, index, array)=>{
        if(index === array.length - 1){

          stringMysql =stringMysql + `('${date}','05:00:00', '${ec}')`
        }else{
          stringMysql =stringMysql + `('${date}','05:00:00', '${ec}'),`
        }
      })

      var q = `INSERT INTO kertih2_nutrient_schedule (date,time, ec) VALUES  ${stringMysql}`;
      connection.query(q, function (error, row, fields) {
        if (error) {
          console.log(error);
          status = error.sqlMessage
        }
        if (row) {
          // console.log('post manong nutrient success')
          client.publish("np/7hq6/table/dosing","Table kertih2 nutrient schedule updated")
          status = 'Success'
        //  console.log(row)
        }
        // client.publish('debug/test/database/kongPo', 'updated')
        res.header('Content-Type', 'application/json; charset=utf-8')
        res.send(status)
      });
  ;
}) 

router.post('/api/setSchedule/kuantan/nutrient',(req,res)=>{
      let dateArray = req.body.params.date
      let ec = req.body.params.ec

      let stringMysql = ''
      let status=''
      dateArray.forEach((date, index, array)=>{
        if(index === array.length - 1){

          stringMysql =stringMysql + `('${date}','05:00:00', '${ec}')`
        }else{
          stringMysql =stringMysql + `('${date}','05:00:00', '${ec}'),`
        }
      })

      var q = `INSERT INTO kuantan_nutrient_schedule (date,time, ec) VALUES  ${stringMysql}`;
      connection.query(q, function (error, row, fields) {
        if (error) {
          console.log(error);
          status = error.sqlMessage
        }
        if (row) {
          // console.log('post manong nutrient success')
          status = 'Success'
          client.publish("np/7hq7/table/dosing","Table kuantan nutrient schedule updated")
        //  console.log(row)
        }
        // client.publish('debug/test/database/kongPo', 'updated')
        res.header('Content-Type', 'application/json; charset=utf-8')
        res.send(status)
      });
  ;
}) 

// DELETE //
//  NUTRIENT PREPARATION //
router.delete('/api/schedule/ipah1/nutrient',(req,res)=>{

  let dateArrayDelete = (req.body.date)
  let stringMysql =""
  dateArrayDelete.forEach((date, index, array)=>{
    if(index === array.length - 1){
      stringMysql =stringMysql + `'${date.date}'`
    }else{
      stringMysql =stringMysql + `'${date.date}',`
    }
  })

      dat = [];
      var q = `DELETE FROM ipah_nutrient_schedule WHERE DATE IN (${stringMysql})`;
      // var q = `DELETE FROM ipah_nutrient_schedule WHERE date = "${req.body.date}"`;
      // connection.connect();
      connection.query(q, function (error, row, fields) {
        if (error) {
          console.log(error);
        }
        if (row) {
          res.json('deleted')

        }
      });
})

router.delete('/api/schedule/ipah2/nutrient',(req,res)=>{
      dat = [];
      let dateArrayDelete = (req.body.date)
      let stringMysql =""
      dateArrayDelete.forEach((date, index, array)=>{
        if(index === array.length - 1){
          stringMysql =stringMysql + `'${date.date}'`
        }else{
          stringMysql =stringMysql + `'${date.date}',`
        }
      })
      var q = `DELETE FROM tkpmipah_nutrient_schedule WHERE DATE IN (${stringMysql})`;
      connection.query(q, function (error, row, fields) {
        if (error) {
          console.log(error);
        }
        if (row) {
          res.json('deleted')
        }
      });
})

router.delete('/api/schedule/tkpmPagoh/nutrient',(req,res)=>{
  dat = [];
  let dateArrayDelete = (req.body.date)
  let stringMysql =""
  dateArrayDelete.forEach((date, index, array)=>{
    if(index === array.length - 1){
      stringMysql =stringMysql + `'${date.date}'`
    }else{
      stringMysql =stringMysql + `'${date.date}',`
    }
  })
  var q = `DELETE FROM tkpmpagoh_nutrient_schedule WHERE DATE IN (${stringMysql})`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      res.json('deleted')
    }
  });
})

router.delete('/api/schedule/kongPo/nutrient',(req,res)=>{
  dat = [];
  let dateArrayDelete = (req.body.date)
  let stringMysql =""
  dateArrayDelete.forEach((date, index, array)=>{
    if(index === array.length - 1){
      stringMysql =stringMysql + `'${date.date}'`
    }else{
      stringMysql =stringMysql + `'${date.date}',`
    }
  })
  var q = `DELETE FROM kongpo_nutrient_schedule WHERE DATE IN (${stringMysql})`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      res.json('deleted')
    }
  });
})

router.delete('/api/schedule/manong/nutrient',(req,res)=>{
  dat = [];
  var q = `DELETE FROM manong_nutrient_schedule WHERE date = "${req.body.date}"`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      client.publish("np/manong/table/dosing","Table manong nutrient schedule updated")
      res.json('deleted')
    }
  });
})

router.delete('/api/schedule/kelantan1/nutrient',(req,res)=>{
  dat = [];
  var q = `DELETE FROM kelantan1_nutrient_schedule WHERE date = "${req.body.date}"`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      client.publish("np/7hq1/table/dosing","Table kelantan1 nutrient schedule updated")
      res.json('deleted')
    }
  });
})

router.delete('/api/schedule/kelantan2/nutrient',(req,res)=>{
  dat = [];
  var q = `DELETE FROM kelantan2_nutrient_schedule WHERE date = "${req.body.date}"`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      client.publish("np/7hq2/table/dosing","Table kelantan2 nutrient schedule updated")
      res.json('deleted')
    }
  });
})

router.delete('/api/schedule/terengganu1/nutrient',(req,res)=>{
  dat = [];
  var q = `DELETE FROM terengganu1_nutrient_schedule WHERE date = "${req.body.date}"`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      client.publish("np/7hq3/table/dosing","Table terengganu1 nutrient schedule updated")
      res.json('deleted')
    }
  });
})

router.delete('/api/schedule/terengganu2/nutrient',(req,res)=>{
  dat = [];
  var q = `DELETE FROM terengganu2_nutrient_schedule WHERE date = "${req.body.date}"`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      client.publish("np/7hq4/table/dosing","Table terengganu2 nutrient schedule updated")
      res.json('deleted')
    }
  });
})

router.delete('/api/schedule/kertih1/nutrient',(req,res)=>{
  dat = [];
  var q = `DELETE FROM kertih1_nutrient_schedule WHERE date = "${req.body.date}"`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      client.publish("np/7hq5/table/dosing","Table kertih1 nutrient schedule updated")
      res.json('deleted')
    }
  });
})

router.delete('/api/schedule/kertih2/nutrient',(req,res)=>{
  dat = [];
  var q = `DELETE FROM kertih2_nutrient_schedule WHERE date = "${req.body.date}"`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      client.publish("np/7hq6/table/dosing","Table kertih2 nutrient schedule updated")
      res.json('deleted')
    }
  });
})

router.delete('/api/schedule/kuantan/nutrient',(req,res)=>{
  dat = [];
  var q = `DELETE FROM kuantan_nutrient_schedule WHERE date = "${req.body.date}"`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      client.publish("np/7hq7/table/dosing","Table kuantan nutrient schedule updated")
      res.json('deleted')
    }
  });
})

module.exports = router