const express = require('express')
const router = express.Router()
const connection = require("../../config/database");

var mqtt = require('mqtt')
var client  = mqtt.connect('ws://www.txio.live:8083/mqtt')


// GET //
// // DRIPPING WATER/NUTRIENT //
router.get('/api/schedule/ipah1',(req,res)=>{
  dat = [];
  var q = `SELECT * FROM ipah_schedule order by date asc`;
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      // console.log(row)
      for (var i = 0; i < row.length; i++) {
        let data2=[]
        let timeArray  = row[i].time.split(',')
        let blockArray  = row[i].block.split(',')
        let durationArray  = row[i].duration.split(',')
        let substanceArray = row[i].substance.split(',')
        timeArray.forEach((element,index) => {
          data2.push(` (${index+1}) [ Time : ${element}, Block : ${blockArray[index]}, Duration : ${durationArray[index]} min, Substance : ${substanceArray[index]}  ] `)
        });
        let data = {
          date:row[i].date,
          remarks:data2
        }
        dat.push(
          data
        );
        // console.log(dat)
      }
      ipah1=dat
    }
    ret = JSON.stringify(ipah1)
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(ret)
  });
})

router.get('/api/schedule/ipah2',(req,res)=>{
  dat = [];
  var q = `SELECT * FROM tkpmipah_schedule order by date asc`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {

      for (var i = 0; i < row.length; i++) {
        let data2=[]
        let timeArray  = row[i].time.split(',')
        let blockArray  = row[i].block.split('/')
        let durationArray  = row[i].duration.split(',')
        let substanceArray = row[i].substance.split(',')
        // console.log(blockArray)
        timeArray.forEach((element,index) => {
          data2.push(` ${index+1}) [ Time : ${element}, Block : ${blockArray[index]}, Duration : ${durationArray[index]} min, Substance : ${substanceArray[index]} ]`)
        });
        // console.log(data2)
        let data = {
          date:row[i].date,
          // time:row[i].time,
          // block:row[i].block,
          // duration:row[i].duration,
          remarks:data2
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

router.get('/api/schedule/tkpmPagoh',(req,res)=>{
  dat = [];
  var q = `SELECT * FROM tkpmpagoh_schedule order by date asc`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {

      for (var i = 0; i < row.length; i++) {
        let data2=[]
        let timeArray  = row[i].time.split(',')
        let blockArray  = row[i].block.split('/')
        let durationArray  = row[i].duration.split(',')
        let substanceArray = row[i].substance.split(',')
        // console.log(blockArray)
        timeArray.forEach((element,index) => {
          data2.push(` ${index+1}) [ Time : ${element}, Block : ${blockArray[index]}, Duration : ${durationArray[index]} min, Substance : ${substanceArray[index]} ]`)
        });
        // console.log(data2)
        let data = {
          date:row[i].date,
          // time:row[i].time,
          // block:row[i].block,
          // duration:row[i].duration,
          remarks:data2
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

router.get('/api/schedule/kongPo',(req,res)=>{
  dat = [];
  var q = `SELECT * FROM kongpo_schedule order by date asc`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      console.log(row)
      for (var i = 0; i < row.length; i++) {
        let data2=[]
        let timeArray  = row[i].time.split(',')
        let durationArray  = row[i].duration.split(',')
        let substanceArray = row[i].substance.split(',')
        // console.log(row[i])
        timeArray.forEach((element,index) => {
          data2.push(` ${index+1}) [ Time : ${element}, Duration : ${durationArray[index]} min, Substance : ${substanceArray[index]}  ], `)
        });
        // console.log(data2)
        let data = {
          date:row[i].date,
          // time:row[i].time,
          // block:row[i].block,
          // duration:row[i].duration,
          remarks:data2
        }
        dat.push(
          data
        );
        console.log(dat)
      }
      ipah1=dat
    }
    ret = JSON.stringify(ipah1)
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(ret)
  });
})

router.get('/api/schedule/manong',(req,res)=>{
  dat = [];
  // var q = `SELECT * FROM manong_schedule  order by date asc`;
  var q = `SELECT * FROM manong_schedule WHERE date >= CURDATE() order by date asc`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      for (var i = 0; i < row.length; i++) {
        let data2=[]
        let timeArray  = row[i].time.split(',')
        let durationArray  = row[i].duration.split(',')
        let substanceArray = row[i].substance.split(',')
        // console.log(row[i])
        timeArray.forEach((element,index) => {
          data2.push(` ${index+1}) [ Time : ${element}, Duration : ${durationArray[index]} min, Substance : ${substanceArray[index]}  ], `)
        });
        // console.log(data2)
        let data = {
          date:row[i].date,
          // time:row[i].time,
          // block:row[i].block,
          // duration:row[i].duration,
          remarks:data2
        }
        dat.push(
          data
        );
        // console.log(dat)
      }
      ipah1=dat
    }
    ret = JSON.stringify(ipah1)
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(ret)
  });
})

router.get('/api/schedule/kelantan1',(req,res)=>{
  dat = [];
  // var q = `SELECT * FROM manong_schedule  order by date asc`;
  var q = `SELECT * FROM kelantan1_schedule WHERE date >= CURDATE() order by date asc`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      for (var i = 0; i < row.length; i++) {
        let data2=[]
        let timeArray  = row[i].time.split(',')
        let durationArray  = row[i].duration.split(',')
        let substanceArray = row[i].substance.split(',')
        // console.log(row[i])
        timeArray.forEach((element,index) => {
          data2.push(` ${index+1}) [ Time : ${element}, Duration : ${durationArray[index]} min, Substance : ${substanceArray[index]}  ], `)
        });
        // console.log(data2)
        let data = {
          date:row[i].date,
          // time:row[i].time,
          // block:row[i].block,
          // duration:row[i].duration,
          remarks:data2
        }
        dat.push(
          data
        );
        // console.log(dat)
      }
      ipah1=dat
    }
    ret = JSON.stringify(ipah1)
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(ret)
  });
})

router.get('/api/schedule/kelantan2',(req,res)=>{
  dat = [];
  // var q = `SELECT * FROM manong_schedule  order by date asc`;
  var q = `SELECT * FROM kelantan2_schedule WHERE date >= CURDATE() order by date asc`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      for (var i = 0; i < row.length; i++) {
        let data2=[]
        let timeArray  = row[i].time.split(',')
        let durationArray  = row[i].duration.split(',')
        let substanceArray = row[i].substance.split(',')
        // console.log(row[i])
        timeArray.forEach((element,index) => {
          data2.push(` ${index+1}) [ Time : ${element}, Duration : ${durationArray[index]} min, Substance : ${substanceArray[index]}  ], `)
        });
        // console.log(data2)
        let data = {
          date:row[i].date,
          // time:row[i].time,
          // block:row[i].block,
          // duration:row[i].duration,
          remarks:data2
        }
        dat.push(
          data
        );
        // console.log(dat)
      }
      ipah1=dat
    }
    ret = JSON.stringify(ipah1)
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(ret)
  });
})

router.get('/api/schedule/terengganu1',(req,res)=>{
  dat = [];
  // var q = `SELECT * FROM manong_schedule  order by date asc`;
  var q = `SELECT * FROM terengganu1_schedule WHERE date >= CURDATE() order by date asc`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      for (var i = 0; i < row.length; i++) {
        let data2=[]
        let timeArray  = row[i].time.split(',')
        let durationArray  = row[i].duration.split(',')
        let substanceArray = row[i].substance.split(',')
        // console.log(row[i])
        timeArray.forEach((element,index) => {
          data2.push(` ${index+1}) [ Time : ${element}, Duration : ${durationArray[index]} min, Substance : ${substanceArray[index]}  ], `)
        });
        // console.log(data2)
        let data = {
          date:row[i].date,
          // time:row[i].time,
          // block:row[i].block,
          // duration:row[i].duration,
          remarks:data2
        }
        dat.push(
          data
        );
        // console.log(dat)
      }
      ipah1=dat
    }
    ret = JSON.stringify(ipah1)
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(ret)
  });
})

router.get('/api/schedule/terengganu2',(req,res)=>{
  dat = [];
  // var q = `SELECT * FROM manong_schedule  order by date asc`;
  var q = `SELECT * FROM terengganu2_schedule WHERE date >= CURDATE() order by date asc`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      for (var i = 0; i < row.length; i++) {
        let data2=[]
        let timeArray  = row[i].time.split(',')
        let durationArray  = row[i].duration.split(',')
        let substanceArray = row[i].substance.split(',')
        // console.log(row[i])
        timeArray.forEach((element,index) => {
          data2.push(` ${index+1}) [ Time : ${element}, Duration : ${durationArray[index]} min, Substance : ${substanceArray[index]}  ], `)
        });
        // console.log(data2)
        let data = {
          date:row[i].date,
          // time:row[i].time,
          // block:row[i].block,
          // duration:row[i].duration,
          remarks:data2
        }
        dat.push(
          data
        );
        // console.log(dat)
      }
      ipah1=dat
    }
    ret = JSON.stringify(ipah1)
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(ret)
  });
})

router.get('/api/schedule/kertih1',(req,res)=>{
  dat = [];
  // var q = `SELECT * FROM manong_schedule  order by date asc`;
  var q = `SELECT * FROM kertih1_schedule WHERE date >= CURDATE() order by date asc`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      for (var i = 0; i < row.length; i++) {
        let data2=[]
        let timeArray  = row[i].time.split(',')
        let durationArray  = row[i].duration.split(',')
        let substanceArray = row[i].substance.split(',')
        // console.log(row[i])
        timeArray.forEach((element,index) => {
          data2.push(` ${index+1}) [ Time : ${element}, Duration : ${durationArray[index]} min, Substance : ${substanceArray[index]}  ], `)
        });
        // console.log(data2)
        let data = {
          date:row[i].date,
          // time:row[i].time,
          // block:row[i].block,
          // duration:row[i].duration,
          remarks:data2
        }
        dat.push(
          data
        );
        // console.log(dat)
      }
      ipah1=dat
    }
    ret = JSON.stringify(ipah1)
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(ret)
  });
})

router.get('/api/schedule/kertih2',(req,res)=>{
  dat = [];
  // var q = `SELECT * FROM manong_schedule  order by date asc`;
  var q = `SELECT * FROM kertih2_schedule WHERE date >= CURDATE() order by date asc`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      for (var i = 0; i < row.length; i++) {
        let data2=[]
        let timeArray  = row[i].time.split(',')
        let durationArray  = row[i].duration.split(',')
        let substanceArray = row[i].substance.split(',')
        // console.log(row[i])
        timeArray.forEach((element,index) => {
          data2.push(` ${index+1}) [ Time : ${element}, Duration : ${durationArray[index]} min, Substance : ${substanceArray[index]}  ], `)
        });
        // console.log(data2)
        let data = {
          date:row[i].date,
          // time:row[i].time,
          // block:row[i].block,
          // duration:row[i].duration,
          remarks:data2
        }
        dat.push(
          data
        );
        // console.log(dat)
      }
      ipah1=dat
    }
    ret = JSON.stringify(ipah1)
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(ret)
  });
})

router.get('/api/schedule/kuantan',(req,res)=>{
  dat = [];
  // var q = `SELECT * FROM manong_schedule  order by date asc`;
  var q = `SELECT * FROM kuantan_schedule WHERE date >= CURDATE() order by date asc`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      for (var i = 0; i < row.length; i++) {
        let data2=[]
        let timeArray  = row[i].time.split(',')
        let durationArray  = row[i].duration.split(',')
        let substanceArray = row[i].substance.split(',')
        // console.log(row[i])
        timeArray.forEach((element,index) => {
          data2.push(` ${index+1}) [ Time : ${element}, Duration : ${durationArray[index]} min, Substance : ${substanceArray[index]}  ], `)
        });
        // console.log(data2)
        let data = {
          date:row[i].date,
          // time:row[i].time,
          // block:row[i].block,
          // duration:row[i].duration,
          remarks:data2
        }
        dat.push(
          data
        );
        // console.log(dat)
      }
      ipah1=dat
    }
    ret = JSON.stringify(ipah1)
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(ret)
  });
})

// POST //
// DRIPPING WATER/NUTRIENT //
router.post('/api/setSchedule/ipah1',(req,res)=>{
  let dateArray = req.body.date
  let time = req.body.time
  let block = req.body.block
  let duration = req.body.duration
  let substance = req.body.substance
  let status=''

  let stringMysql = ''
  dateArray.forEach((date, index, array)=>{
    if(index === array.length - 1){
      stringMysql =stringMysql + `('${date}','${time}', '${block}','${duration}', '${substance}')`
    }else{
      stringMysql =stringMysql + `('${date}','${time}', '${block}','${duration}', '${substance}'),`
    }
  })

  var q = `INSERT INTO ipah_schedule (date,time, block, duration, substance) VALUES ${stringMysql}`;
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
      status = error.sqlMessage
    }
    if (row) {
      status = 'Success'
    }
    client.publish('debug/test/database/ipah', 'updated')
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(status)
  });

})
  
router.post('/api/setSchedule/ipah2',(req,res)=>{
  let dateArray = req.body.date
  let time = req.body.time
  let block = req.body.block
  let duration = req.body.duration
  let substance = req.body.substance
  let status=''

  let stringMysql = ''
  dateArray.forEach((date, index, array)=>{
    if(index === array.length - 1){
      stringMysql =stringMysql + `('${date}','${time}', '${block}','${duration}', '${substance}')`
    }else{
      stringMysql =stringMysql + `('${date}','${time}', '${block}','${duration}', '${substance}'),`
    }
  })
        var q = `INSERT INTO tkpmipah_schedule (date,time, block, duration,substance) VALUES ${stringMysql}`;

        connection.query(q, function (error, row, fields) {
          if (error) {
            status = error.sqlMessage
          }
          if (row) {
            status = 'Success'
          }
          client.publish('debug/test/database/ipah2', 'updated')
          res.header('Content-Type', 'application/json; charset=utf-8')
          res.send(status)
        });
    ;
})
  
router.post('/api/setSchedule/tkpmPagoh',(req,res)=>{
  let dateArray = req.body.date
  let time = req.body.time
  let block = req.body.block
  let duration = req.body.duration
  let substance = req.body.substance
  let status=''

  let stringMysql = ''
  dateArray.forEach((date, index, array)=>{
    if(index === array.length - 1){
      stringMysql =stringMysql + `('${date}','${time}', '${block}','${duration}', '${substance}')`
    }else{
      stringMysql =stringMysql + `('${date}','${time}', '${block}','${duration}', '${substance}'),`
    }
  })
        var q = `INSERT INTO tkpmpagoh_schedule (date,time, block, duration,substance) VALUES ${stringMysql}`;
        connection.query(q, function (error, row, fields) {
          if (error) {
            status = error.sqlMessage
          }
          if (row) {
            status = 'Success'
          }
          client.publish('debug/test/database/tkpmPagoh', 'updated')
          res.header('Content-Type', 'application/json; charset=utf-8')
          res.send(status)
        });
    ;
})
  
router.post('/api/setSchedule/kongPo',(req,res)=>{
  let dateArray = req.body.date
  let time = req.body.time
  let duration = req.body.duration
  let substance = req.body.substance
  let status=''

  let stringMysql = ''
  dateArray.forEach((date, index, array)=>{
    if(index === array.length - 1){
      stringMysql =stringMysql + `('${date}','${time}', '${duration}', '${substance}')`
    }else{
      stringMysql =stringMysql + `('${date}','${time}', '${duration}', '${substance}'),`
    }
  })
        var q = `INSERT INTO kongpo_schedule (date,time,duration, substance) VALUES ${stringMysql}`;
        connection.query(q, function (error, row, fields) {
          if (error) {
            status = error.sqlMessage
          }
          if (row) {
            status = 'Success'
          }
          client.publish('debug/test/database/kongPo', 'updated')
          res.header('Content-Type', 'application/json; charset=utf-8')
          res.send(status)
        });
    ;
})
  
router.post('/api/setSchedule/manong',(req,res)=>{
    let dateArray = req.body.params.date
    let time = req.body.params.time
    let duration = req.body.params.duration
    let substance = req.body.params.substance
    let status=''
  
    let stringMysql = ''
    dateArray.forEach((date, index, array)=>{

      if(index === array.length - 1){
        stringMysql =stringMysql + `('${date}','${time}', '${duration}', '${substance}')`
      }else{
        stringMysql =stringMysql + `('${date}','${time}', '${duration}', '${substance}'),`
      }
    })
    // console.log(stringMysql)
        // ret = JSON.stringify(ipah1)
        // var w = `INSERT INTO kongpo_schedule (date,time,duration, substance) VALUES ('${req.body.date}', '${req.body.time}', '${req.body.duration}', '${req.body.substance}')`;
        var q = `INSERT INTO manong_schedule (date,time,duration, substance) VALUES ${stringMysql}`;
        connection.query(q, function (error, row, fields) {
          if (error) {
            console.log(error);
            status = error.sqlMessage
          }
          if (row) {
            status = 'Success'
          //  console.log(row)
          }
        //   client.publish('debug/test/database/ipah1', 'updated')
        //   res.header('Content-Type', 'application/json; charset=utf-8')
          res.send(status)
        });
    ;
})

router.post('/api/setSchedule/kelantan1',(req,res)=>{
  let dateArray = req.body.params.date
  let time = req.body.params.time
  let duration = req.body.params.duration
  let substance = req.body.params.substance
  let status=''

  let stringMysql = ''
  dateArray.forEach((date, index, array)=>{

    if(index === array.length - 1){
      stringMysql =stringMysql + `('${date}','${time}', '${duration}', '${substance}')`
    }else{
      stringMysql =stringMysql + `('${date}','${time}', '${duration}', '${substance}'),`
    }
  })
  // console.log(stringMysql)
      // ret = JSON.stringify(ipah1)
      // var w = `INSERT INTO kongpo_schedule (date,time,duration, substance) VALUES ('${req.body.date}', '${req.body.time}', '${req.body.duration}', '${req.body.substance}')`;
      var q = `INSERT INTO kelantan1_schedule (date,time,duration, substance) VALUES ${stringMysql}`;
      connection.query(q, function (error, row, fields) {
        if (error) {
          console.log(error);
          status = error.sqlMessage
        }
        if (row) {
          status = 'Success'
        //  console.log(row)
        }
      //   client.publish('debug/test/database/ipah1', 'updated')
      //   res.header('Content-Type', 'application/json; charset=utf-8')
        res.send(status)
      });
  ;
})

router.post('/api/setSchedule/kelantan2',(req,res)=>{
  let dateArray = req.body.params.date
  let time = req.body.params.time
  let duration = req.body.params.duration
  let substance = req.body.params.substance
  let status=''

  let stringMysql = ''
  dateArray.forEach((date, index, array)=>{

    if(index === array.length - 1){
      stringMysql =stringMysql + `('${date}','${time}', '${duration}', '${substance}')`
    }else{
      stringMysql =stringMysql + `('${date}','${time}', '${duration}', '${substance}'),`
    }
  })
  // console.log(stringMysql)
      // ret = JSON.stringify(ipah1)
      // var w = `INSERT INTO kongpo_schedule (date,time,duration, substance) VALUES ('${req.body.date}', '${req.body.time}', '${req.body.duration}', '${req.body.substance}')`;
      var q = `INSERT INTO kelantan2_schedule (date,time,duration, substance) VALUES ${stringMysql}`;
      connection.query(q, function (error, row, fields) {
        if (error) {
          console.log(error);
          status = error.sqlMessage
        }
        if (row) {
          status = 'Success'
        //  console.log(row)
        }
      //   client.publish('debug/test/database/ipah1', 'updated')
      //   res.header('Content-Type', 'application/json; charset=utf-8')
        res.send(status)
      });
  ;
})

router.post('/api/setSchedule/terengganu1',(req,res)=>{
  let dateArray = req.body.params.date
  let time = req.body.params.time
  let duration = req.body.params.duration
  let substance = req.body.params.substance
  let status=''

  let stringMysql = ''
  dateArray.forEach((date, index, array)=>{

    if(index === array.length - 1){
      stringMysql =stringMysql + `('${date}','${time}', '${duration}', '${substance}')`
    }else{
      stringMysql =stringMysql + `('${date}','${time}', '${duration}', '${substance}'),`
    }
  })
  // console.log(stringMysql)
      // ret = JSON.stringify(ipah1)
      // var w = `INSERT INTO kongpo_schedule (date,time,duration, substance) VALUES ('${req.body.date}', '${req.body.time}', '${req.body.duration}', '${req.body.substance}')`;
      var q = `INSERT INTO terengganu1_schedule (date,time,duration, substance) VALUES ${stringMysql}`;
      connection.query(q, function (error, row, fields) {
        if (error) {
          console.log(error);
          status = error.sqlMessage
        }
        if (row) {
          status = 'Success'
        //  console.log(row)
        }
      //   client.publish('debug/test/database/ipah1', 'updated')
      //   res.header('Content-Type', 'application/json; charset=utf-8')
        res.send(status)
      });
  ;
})

router.post('/api/setSchedule/terengganu2',(req,res)=>{
  let dateArray = req.body.params.date
  let time = req.body.params.time
  let duration = req.body.params.duration
  let substance = req.body.params.substance
  let status=''

  let stringMysql = ''
  dateArray.forEach((date, index, array)=>{

    if(index === array.length - 1){
      stringMysql =stringMysql + `('${date}','${time}', '${duration}', '${substance}')`
    }else{
      stringMysql =stringMysql + `('${date}','${time}', '${duration}', '${substance}'),`
    }
  })
  // console.log(stringMysql)
      // ret = JSON.stringify(ipah1)
      // var w = `INSERT INTO kongpo_schedule (date,time,duration, substance) VALUES ('${req.body.date}', '${req.body.time}', '${req.body.duration}', '${req.body.substance}')`;
      var q = `INSERT INTO terengganu2_schedule (date,time,duration, substance) VALUES ${stringMysql}`;
      connection.query(q, function (error, row, fields) {
        if (error) {
          console.log(error);
          status = error.sqlMessage
        }
        if (row) {
          status = 'Success'
        //  console.log(row)
        }
      //   client.publish('debug/test/database/ipah1', 'updated')
      //   res.header('Content-Type', 'application/json; charset=utf-8')
        res.send(status)
      });
  ;
})

router.post('/api/setSchedule/kertih1',(req,res)=>{
  let dateArray = req.body.params.date
  let time = req.body.params.time
  let duration = req.body.params.duration
  let substance = req.body.params.substance
  let status=''

  let stringMysql = ''
  dateArray.forEach((date, index, array)=>{

    if(index === array.length - 1){
      stringMysql =stringMysql + `('${date}','${time}', '${duration}', '${substance}')`
    }else{
      stringMysql =stringMysql + `('${date}','${time}', '${duration}', '${substance}'),`
    }
  })
  // console.log(stringMysql)
      // ret = JSON.stringify(ipah1)
      // var w = `INSERT INTO kongpo_schedule (date,time,duration, substance) VALUES ('${req.body.date}', '${req.body.time}', '${req.body.duration}', '${req.body.substance}')`;
      var q = `INSERT INTO kertih1_schedule (date,time,duration, substance) VALUES ${stringMysql}`;
      connection.query(q, function (error, row, fields) {
        if (error) {
          console.log(error);
          status = error.sqlMessage
        }
        if (row) {
          client.publish("np/7hq5/table/dripping","Table kertih1 schedule updated")
          status = 'Success'
        //  console.log(row)
        }
      //   client.publish('debug/test/database/ipah1', 'updated')
      //   res.header('Content-Type', 'application/json; charset=utf-8')
        res.send(status)
      });
  ;
})

router.post('/api/setSchedule/kertih2',(req,res)=>{
  let dateArray = req.body.params.date
  let time = req.body.params.time
  let duration = req.body.params.duration
  let substance = req.body.params.substance
  let status=''

  let stringMysql = ''
  dateArray.forEach((date, index, array)=>{

    if(index === array.length - 1){
      stringMysql =stringMysql + `('${date}','${time}', '${duration}', '${substance}')`
    }else{
      stringMysql =stringMysql + `('${date}','${time}', '${duration}', '${substance}'),`
    }
  })
  // console.log(stringMysql)
      // ret = JSON.stringify(ipah1)
      // var w = `INSERT INTO kongpo_schedule (date,time,duration, substance) VALUES ('${req.body.date}', '${req.body.time}', '${req.body.duration}', '${req.body.substance}')`;
      var q = `INSERT INTO kertih2_schedule (date,time,duration, substance) VALUES ${stringMysql}`;
      connection.query(q, function (error, row, fields) {
        if (error) {
          console.log(error);
          status = error.sqlMessage
        }
        if (row) {
          client.publish("np/7hq6/table/dripping","Table kertih2 schedule updated")
          status = 'Success'
        //  console.log(row)
        }
      //   client.publish('debug/test/database/ipah1', 'updated')
      //   res.header('Content-Type', 'application/json; charset=utf-8')
        res.send(status)
      });
  ;
})

router.post('/api/setSchedule/kuantan',(req,res)=>{
  let dateArray = req.body.params.date
  let time = req.body.params.time
  let duration = req.body.params.duration
  let substance = req.body.params.substance
  let status=''

  let stringMysql = ''
  dateArray.forEach((date, index, array)=>{

    if(index === array.length - 1){
      stringMysql =stringMysql + `('${date}','${time}', '${duration}', '${substance}')`
    }else{
      stringMysql =stringMysql + `('${date}','${time}', '${duration}', '${substance}'),`
    }
  })
  // console.log(stringMysql)
      // ret = JSON.stringify(ipah1)
      // var w = `INSERT INTO kongpo_schedule (date,time,duration, substance) VALUES ('${req.body.date}', '${req.body.time}', '${req.body.duration}', '${req.body.substance}')`;
      var q = `INSERT INTO kuantan_schedule (date,time,duration, substance) VALUES ${stringMysql}`;
      connection.query(q, function (error, row, fields) {
        if (error) {
          console.log(error);
          status = error.sqlMessage
        }
        if (row) {
          status = 'Success'
          client.publish("np/7hq7/table/dripping","Table kuantan schedule updated")
        //  console.log(row)
        }
      //   client.publish('debug/test/database/ipah1', 'updated')
      //   res.header('Content-Type', 'application/json; charset=utf-8')
        res.send(status)
      });
  ;
})

// DELETE //
// DRIPPING WATER/NUTRIENT //

router.delete('/api/schedule/ipah1',(req,res)=>{
  let dateArrayDelete = (req.body.date)
  let stringMysql =""
  dateArrayDelete.forEach((date, index, array)=>{
    if(index === array.length - 1){
      stringMysql =stringMysql + `'${date.date}'`
    }else{
      stringMysql =stringMysql + `'${date.date}',`
    }
  })
  var q = `DELETE FROM ipah_schedule WHERE DATE IN (${stringMysql})`;

  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      res.json('deleted')
    }
  });
})

router.delete('/api/schedule/ipah2',(req,res)=>{
  let dateArrayDelete = (req.body.date)
  let stringMysql =""
  dateArrayDelete.forEach((date, index, array)=>{
    if(index === array.length - 1){
      stringMysql =stringMysql + `'${date.date}'`
    }else{
      stringMysql =stringMysql + `'${date.date}',`
    }
  })
  var q = `DELETE FROM tkpmipah_schedule WHERE DATE IN (${stringMysql})`;
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      res.json('deleted')
    }
  });
})

router.delete('/api/schedule/tkpmPagoh',(req,res)=>{
  let dateArrayDelete = (req.body.date)
  let stringMysql =""
  dateArrayDelete.forEach((date, index, array)=>{
    if(index === array.length - 1){
      stringMysql =stringMysql + `'${date.date}'`
    }else{
      stringMysql =stringMysql + `'${date.date}',`
    }
  })
  var q = `DELETE FROM tkpmpagoh_schedule WHERE DATE IN (${stringMysql})`;
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      res.json('deleted')
    }
  });
})

router.delete('/api/schedule/kongPo',(req,res)=>{
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
  var q = `DELETE FROM kongpo_schedule WHERE DATE IN (${stringMysql})`;
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

router.delete('/api/schedule/manong',(req,res)=>{
dat = [];
var q = `DELETE FROM manong_schedule WHERE date = "${req.body.date}"`;
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

router.delete('/api/schedule/kelantan1',(req,res)=>{
  dat = [];
  var q = `DELETE FROM kelantan1_schedule WHERE date = "${req.body.date}"`;
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

router.delete('/api/schedule/kelantan2',(req,res)=>{
  dat = [];
  var q = `DELETE FROM kelantan2_schedule WHERE date = "${req.body.date}"`;
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

router.delete('/api/schedule/terengganu1',(req,res)=>{
  dat = [];
  var q = `DELETE FROM terengganu1_schedule WHERE date = "${req.body.date}"`;
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

router.delete('/api/schedule/terengganu2',(req,res)=>{
  dat = [];
  var q = `DELETE FROM terengganu2_schedule WHERE date = "${req.body.date}"`;
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

router.delete('/api/schedule/kertih1',(req,res)=>{
  dat = [];
  var q = `DELETE FROM kertih1_schedule WHERE date = "${req.body.date}"`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
  if (error) {
    console.log(error);
  }
  if (row) {
    client.publish("np/7hq5/table/dripping","Table kertih1 schedule updated")
    res.json('deleted')
  
  }
  });
})

router.delete('/api/schedule/kertih2',(req,res)=>{
  dat = [];
  var q = `DELETE FROM kertih2_schedule WHERE date = "${req.body.date}"`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
  if (error) {
    console.log(error);
  }
  if (row) {
    client.publish("np/7hq6/table/dripping","Table kertih2 schedule updated")
    res.json('deleted')
  
  }
  });
})

router.delete('/api/schedule/kuantan',(req,res)=>{
  dat = [];
  var q = `DELETE FROM kuantan_schedule WHERE date = "${req.body.date}"`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
  if (error) {
    console.log(error);
  }
  if (row) {
    client.publish("np/7hq7/table/dripping","Table kuantan schedule updated")
    res.json('deleted')
  
  }
  });
})
  

module.exports = router