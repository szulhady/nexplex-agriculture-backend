const express = require('express')
const app = express()
const port = 5000
const cors = require('cors')
const moment = require('moment')
const connection = require("./config/database");
const passport = require( 'passport' );
var mqtt = require('mqtt')
var client  = mqtt.connect('wss://tron.airmode.live:8083/mqtt')

const schedule = require('node-schedule');

  var ret = [];
  var dat = [];
  var ipah1 = []

  let timeTkpmPagohArrayLength=0
  let timeIpahArrayLength=0
  let timeTkpmIpahArrayLength=0
  let timeKongPoArrayLength=0

  //Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(async function (user, done) {
    done(null, user);
  });
  app.use(cors())
  app.use( express.json() );
  app.use( express.urlencoded( { extended: false } ));

  function getUpdatedDataIpah(){
    if(typeof jobIpah !== 'undefined'){
      // console.log(timeIpahArrayLength)
      delete jobIpah;
      // console.log(schedule.scheduledJobs)
      // if(!schedule.scheduledJobs.pagoh0){
      //   console.log('here')
      //   return
      // }
      // console.log(schedule.scheduledJobs.pagoh.cancel())
      for(i=0; i<timeIpahArrayLength;i++){
        if(schedule.scheduledJobs[`ipah${i}`]){
          schedule.scheduledJobs[`ipah${i}`].cancel()
        }
      }
      // console.log(schedule.scheduledJobs)
      
    }
    dat = [];
    var q = `SELECT * FROM ipah_schedule WHERE date = CURDATE()`;
    // connection.connect();
    connection.query(q, function (error, row, fields) {
      if (error) {
        console.log(error);
      }
      if (row) {
        // console.log(row)
        for (var i = 0; i < row.length; i++) {
          let timeArray  = row[i].time.split(',')
          let blockArray  = row[i].block.split(',')
          let durationArray  = row[i].duration.split(',')
          let subtanceArray = row[i].substance.split(',')
          
          timeArray.forEach((element,index) => {
            jobIpah = schedule.scheduleJob(`ipah${index}`,row[i].date  +" "+  element+":00", function(){
              console.log('Ipah Schedule.',new Date(), blockArray[index], durationArray[index], subtanceArray[index]);
              let sv
              if(blockArray[index]==1){
                sv='5'
              }else if(blockArray[index]==2){
                sv='6'
              }else{
                sv='all'
              }
              // client.publish('debug/nexplex/control/ipah/sv', `${element}`)
              client.publish('debug/nexplex/control/ipah/sv', JSON.stringify({'time':`${element}`, 'block':`${sv}`, 'duration':`${durationArray[index]}`,'substance':`${subtanceArray[index]}`}))
            });

          });
          // console.log(timeArray)
          timeIpahArrayLength=timeArray.length
        }
      }
    });
  }

  function getUpdatedDataTkpmIpah(){
    if(typeof jobTkpmIpah !== 'undefined'){
      // console.log(timeTkpmIpahArrayLength)
      delete jobTkpmIpah;
      // console.log(schedule.scheduledJobs)
      // if(!schedule.scheduledJobs.pagoh0){
      //   console.log('here')
      //   return
      // }
      // console.log(schedule.scheduledJobs.pagoh.cancel())
      for(i=0; i<timeTkpmIpahArrayLength;i++){
        if(schedule.scheduledJobs[`tkpmIpah${i}`]){
          schedule.scheduledJobs[`tkpmIpah${i}`].cancel()
        }
      }
      // console.log(schedule.scheduledJobs)
      
    }
    dat = [];
    var q = `SELECT * FROM tkpmipah_schedule WHERE date = CURDATE()`;
    // connection.connect();
    connection.query(q, function (error, row, fields) {
      if (error) {
        console.log(error);
      }
      if (row) {

        for (var i = 0; i < row.length; i++) {
          let timeArray  = row[i].time.split(',')
          let blockArray  = row[i].block.split('/')
          let durationArray  = row[i].duration.split(',')
          let subtanceArray = row[i].substance.split(',')
          // console.log(blockArray)
          timeArray.forEach((element,index) => {
            jobTkpmIpah = schedule.scheduleJob(`tkpmIpah${index}`,row[i].date  +" "+  element+":00", function(){
              console.log('Tkpm Ipah Schedule.',new Date(), blockArray[index], durationArray[index], subtanceArray[index]);

              let sv
              if(blockArray[index]=='1'){
                sv='13'
              }else if(blockArray[index]=='2'){
                sv='14'
              }else if(blockArray[index]=='3'){
                sv='15'
              }else if(blockArray[index]=='1,2' || blockArray[index]=='2,1' ){
                sv='13,14'
              }else if(blockArray[index]=='1,3' || blockArray[index]=='3,1' ){
                sv='13,15'
              }else if(blockArray[index]=='2,3' || blockArray[index]=='3,2' ){
                sv='14,15'
              }else{
                sv='all'
              }
              client.publish('debug/nexplex/control/tkpm/sv', JSON.stringify({time:`${element}`, block:`${sv}`, duration:`${durationArray[index]}`,'substance':`${subtanceArray[index]}`}))
            });
          });
          // console.log(timeArray)
          timeTkpmIpahArrayLength=timeArray.length
        }
      }
    });
  }

  function getUpdatedDataTkpmPagoh(){
    if(typeof jobTkpmPagoh !== 'undefined'){
      // console.log(timeTkpmPagohArrayLength)
      delete jobTkpmPagoh;
      // console.log(schedule.scheduledJobs)
      // if(!schedule.scheduledJobs.pagoh0){
      //   console.log('here')
      //   return
      // }
      // console.log(schedule.scheduledJobs.pagoh.cancel())
      for(i=0; i<timeTkpmPagohArrayLength;i++){
        if(schedule.scheduledJobs[`pagoh${i}`]){
          schedule.scheduledJobs[`pagoh${i}`].cancel()
        }
      }
      // console.log(schedule.scheduledJobs)
      
    }
    // if(eval(job4) != undefined) {
    //   eval(job4+'.cancel()');
    // }
      dat = [];
      var q = `SELECT * FROM tkpmpagoh_schedule WHERE date = CURDATE()`;
      // connection.connect();
      connection.query(q, function (error, row, fields) {
        if (error) {
          console.log(error);
        }
        if (row) {
          // console.log(row)
          for (var i = 0; i < row.length; i++) {
            let timeArray  = row[i].time.split(',')
            let blockArray  = row[i].block.split('/')
            let durationArray  = row[i].duration.split(',')
            let subtanceArray = row[i].substance.split(',')
            
            timeArray.forEach((element,index) => {
              jobTkpmPagoh = schedule.scheduleJob(`pagoh${index}`,row[i].date  +" "+  element+":00", function(){
                console.log('Tkpm Pagoh Schedule.',new Date(), blockArray[index], durationArray[index], subtanceArray[index]);
                let sv
              if(blockArray[index]=='1'){
                sv='12'
              }else if(blockArray[index]=='2'){
                sv='13'
              }else if(blockArray[index]=='3'){
                sv='14'
              }else if(blockArray[index]=='1,2' || blockArray[index]=='2,1' ){
                sv='12,13'
              }else if(blockArray[index]=='1,3' || blockArray[index]=='3,1' ){
                sv='12,14'
              }else if(blockArray[index]=='2,3' || blockArray[index]=='3,2' ){
                sv='13,14'
              }else{
                sv='all'
              }
              client.publish('debug/nexplex/control/pagoh/sv', JSON.stringify({time:`${element}`, block:`${sv}`, duration:`${durationArray[index]}`,'substance':`${subtanceArray[index]}`}))
              });
            });
            // console.log(timeArray)
            timeTkpmPagohArrayLength=timeArray.length
          } 
          // console.log(schedule.scheduledJobs)
        }
      });
    }

  function getUpdatedDataKongPo(){
  if(typeof jobKongPo !== 'undefined'){
    // console.log(timeKongPoArrayLength)
    delete jobKongPo;
    // console.log(schedule.scheduledJobs)
     for(i=0; i<timeKongPoArrayLength;i++){
       if(schedule.scheduledJobs[`kongPo${i}`]){
         schedule.scheduledJobs[`kongPo${i}`].cancel()
       }
     }
    //  console.log(schedule.scheduledJobs)
     
   }
     dat = [];
     var q = `SELECT * FROM kongpo_schedule WHERE date = CURDATE()`;
     // connection.connect();
     connection.query(q, function (error, row, fields) {
       if (error) {
         console.log(error);
       }
       if (row) {
 
         for (var i = 0; i < row.length; i++) {
           let timeArray  = row[i].time.split(',')
           let durationArray  = row[i].duration.split(',')
           
           timeArray.forEach((element,index) => {
             jobKongPo = schedule.scheduleJob(`kongPo${index}`,row[i].date  +" "+  element+":00", function(){
               console.log('Kong Po Schedule.',new Date(), blockArray[index], durationArray[index]);
               let sv
               if(blockArray[index]=='1'){
                 sv='13'
               }else if(blockArray[index]=='2'){
                 sv='14'
               }else if(blockArray[index]=='3'){
                 sv='15'
               }else if(blockArray[index]=='1,2' || blockArray[index]=='2,1' ){
                 sv='13,14'
               }else if(blockArray[index]=='1,3' || blockArray[index]=='3,1' ){
                 sv='13,15'
               }else if(blockArray[index]=='2,3' || blockArray[index]=='3,2' ){
                 sv='14,15'
               }else{
                 sv='all'
               }
               client.publish('debug/nexplex/control/kong/sv', JSON.stringify({time:`${element}`, block:`${sv}`, duration:`${durationArray[index]}`}))
             });
           });
          //  console.log(timeArray)
           timeKongPoArrayLength=timeArray.length
         }
       }
    });
   }

app.get('/', (req, res) => {
  client.publish('debug/test/express','Hello World From Express!')
  res.send(new Date().toLocaleTimeString())
})

app.get('/api/schedule/ipah1',(req,res)=>{
  dat = [];
  var q = `SELECT * FROM ipah_schedule order by date asc`;
  // connection.connect();
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
        // console.log(row[i])
        timeArray.forEach((element,index) => {
          data2.push(` ${index+1}) [ Time : ${element}, Block : ${blockArray[index]}, Duration : ${durationArray[index]} min, Substance : ${substanceArray[index]}  ], `)
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
app.get('/api/schedule/ipah2',(req,res)=>{
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
app.get('/api/schedule/tkpmPagoh',(req,res)=>{
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
app.get('/api/schedule/kongPo',(req,res)=>{
  dat = [];
  var q = `SELECT * FROM kongpo_schedule order by date asc`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {

      for (var i = 0; i < row.length; i++) {
        dat.push(
          row[i].date
        );
      }
      ipah1=dat
    }
    ret = JSON.stringify(ipah1)
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(ret)
  });
})

app.post('/api/setSchedule/ipah1',(req,res)=>{
// console.log(req.body.block)
    // ret = JSON.stringify(ipah1)
    var q = `INSERT INTO ipah_schedule (date,time, block, duration, substance) VALUES ('${req.body.date}', '${req.body.time}', '${req.body.block}', '${req.body.duration}', '${req.body.substance}')`;
    connection.query(q, function (error, row, fields) {
      if (error) {
        console.log(error);
      }
      if (row) {
  
      //  console.log(row)
      }
      client.publish('debug/test/database/ipah1', 'updated')
      res.header('Content-Type', 'application/json; charset=utf-8')
      res.send('Sucess')
    });
;
})

app.post('/api/setSchedule/ipah2',(req,res)=>{
// console.log(req.body)
    // ret = JSON.stringify(ipah1)
    var q = `INSERT INTO tkpmipah_schedule (date,time, block, duration,substance) VALUES ('${req.body.date}', '${req.body.time}', '${req.body.block}', '${req.body.duration}', '${req.body.substance}')`;
    connection.query(q, function (error, row, fields) {
      if (error) {
        console.log(error);
      }
      if (row) {
  
      //  console.log(row)
      }
      res.header('Content-Type', 'application/json; charset=utf-8')
      res.send('Sucess')
    });
;
})

app.post('/api/setSchedule/tkpmPagoh',(req,res)=>{
  // console.log(req.body)
      // ret = JSON.stringify(ipah1)
      var q = `INSERT INTO tkpmpagoh_schedule (date,time, block, duration,substance) VALUES ('${req.body.date}', '${req.body.time}', '${req.body.block}', '${req.body.duration}', '${req.body.substance}')`;
      connection.query(q, function (error, row, fields) {
        if (error) {
          console.log(error);
        }
        if (row) {
    
        //  console.log(row)
        }
        res.header('Content-Type', 'application/json; charset=utf-8')
        res.send('Sucess')
      });
  ;
  })

  app.post('/api/setSchedule/kongPo',(req,res)=>{
    // console.log(req.body.date)
        // ret = JSON.stringify(ipah1)
        var q = `INSERT INTO kongpo_schedule (date,time, duration) VALUES ('${req.body.date}', '${req.body.time}', '${req.body.duration}')`;
        connection.query(q, function (error, row, fields) {
          if (error) {
            console.log(error);
          }
          if (row) {
      
          //  console.log(row)
          }
          res.header('Content-Type', 'application/json; charset=utf-8')
          res.send('Sucess')
        });
    ;
    })

    app.delete('/api/schedule/ipah1',(req,res)=>{
      dat = [];
      var q = `DELETE FROM ipah_schedule WHERE date = "${req.body.date}"`;
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
    app.delete('/api/schedule/ipah2',(req,res)=>{
      dat = [];
      var q = `DELETE FROM tkpmipah_schedule WHERE date = "${req.body.date}"`;
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
    app.delete('/api/schedule/tkpmPagoh',(req,res)=>{
      dat = [];
      var q = `DELETE FROM tkpmpagoh_schedule WHERE date = "${req.body.date}"`;
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
    app.delete('/api/schedule/kongPo',(req,res)=>{
      dat = [];
      var q = `DELETE FROM kongpo_schedule WHERE date = "${req.body.date}"`;
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

client.on('connect', function () {
  client.subscribe('debug/test/database/ipah1', function (err) {
    if (!err) {
      client.publish('debug/test/database/ipah1000', 'hello',{retain:true})
    }
  })
  client.subscribe('debug/test/database/ipah2', function (err) {
    if (!err) {
      client.publish('presence', 'Hello mqtt')
    }
  })
  client.subscribe('debug/test/database/tkpmPagoh', function (err) {
    if (!err) {
      client.publish('presence', 'Hello mqtt')
    }
  })
  client.subscribe('debug/test/database/kongPo', function (err) {
    if (!err) {
      client.publish('presence', 'Hello mqtt')
    }
  })
})


client.on('message', function (topic, message) {
  // message is Buffer
  if(topic === 'debug/test/database/ipah1'){
    // console.log(message.toString())
    if(message.toString()==='updated'){
      getUpdatedDataIpah()
    }
  }
  if(topic === 'debug/test/database/ipah2'){
    // console.log(message.toString())
    if(message.toString()==='updated'){
      getUpdatedDataTkpmIpah()
    }
  }
  if(topic === 'debug/test/database/tkpmPagoh'){
    // console.log(message.toString())
    if(message.toString()==='updated'){
      getUpdatedDataTkpmPagoh()
    }
  }
  if(topic === 'debug/test/database/kongPo'){
    // console.log(message.toString())
    if(message.toString()==='updated'){
      getUpdatedDataKongPo()
    }
  }
  // client.end()
})

app.use("/api/auth", require("./routes/user/auth"))
app.use("/api/user", require("./routes/user/user"))
// app.use("/api/admin", require("./routes/admin"))

app.use("/api/hourly", require("./routes/data/hourly"))
app.use("/api/hourly/mobile", require("./routes/data/hourlyMobile"))
app.use("/api/daily", require("./routes/data/daily"))
app.use("/api/daily/mobile", require("./routes/data/dailyMobile"))
app.use("/api/monthly", require("./routes/data/monthly"))
app.use("/api/monthly/mobile", require("./routes/data/monthlyMobile"))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

setInterval(()=>{
// console.log(new Date())
getUpdatedDataIpah()
getUpdatedDataTkpmIpah()
getUpdatedDataTkpmPagoh()
getUpdatedDataKongPo()
},60000)