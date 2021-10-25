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

const axios = require('axios')

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


// CREATE JOB SCHEDULE FOR DRIPPING WATER/NUTRIENT
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
          let substanceArray = row[i].substance.split(',')
          
          timeArray.forEach((element,index) => {
            jobIpah = schedule.scheduleJob(`ipah${index}`,row[i].date  +" "+  element+":00", function(){
              console.log('Ipah Schedule.',new Date(), blockArray[index], durationArray[index], substanceArray[index]);
              
              let medium
              if (substanceArray[index] == 'water' && blockArray[index] ==1){
               medium = 1
              }else if(substanceArray[index] == 'water' && blockArray[index] ==2){
                medium =2
              }else if(substanceArray[index] == 'water' && (blockArray[index]=='All')){
                medium = 11
              }
              
              if (substanceArray[index] == 'fertilizer' && blockArray[index] ==1){
                medium = 3
               }else if(substanceArray[index] == 'fertilizer' && blockArray[index] ==2){
                 medium =4
               }else if(substanceArray[index] == 'fertilizer' && (blockArray[index]=='All')){
                 medium = 22
               }
               console.log(`{"D1":${medium},"D2":${durationArray[index]}}`)
               client.publish('filter/np/c/ipah/d', `{"D1":${medium},"D2":${durationArray[index]}}`)
              // client.publish('debug/nexplex/control/ipah/sv', `${element}`)
              // client.publish('debug/nexplex/control/ipah/sv', JSON.stringify({'time':`${element}`, 'block':`${sv}`, 'duration':`${durationArray[index]}`,'substance':`${subtanceArray[index]}`}))
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
          let substanceArray = row[i].substance.split(',')
          // console.log(blockArray)
          timeArray.forEach((element,index) => {
            jobTkpmIpah = schedule.scheduleJob(`tkpmIpah${index}`,row[i].date  +" "+  element+":00", function(){
              console.log('Tkpm Ipah Schedule.',new Date(), blockArray[index], durationArray[index], substanceArray[index]);
              let medium
              if (substanceArray[index] == 'water' && blockArray[index] ==1){
               medium = 1
              }else if(substanceArray[index] == 'water' && blockArray[index] ==2){
                medium =2
              }else if(substanceArray[index] == 'water' && blockArray[index] ==3){
                medium =2
              }else if(substanceArray[index] == 'water' && (blockArray[index]=='1,2' || blockArray[index]=='2,1')){
                medium = 12
              }else if(substanceArray[index] == 'water' && (blockArray[index]=='1,3' || blockArray[index]=='3,1')){
                medium = 13
              }else if(substanceArray[index] == 'water' && (blockArray[index]=='2,3' || blockArray[index]=='3,2')){
                medium = 23
              }else if(substanceArray[index] == 'water' && (blockArray[index]=='1,2,3' || blockArray[index]=='1,3,2' ||blockArray[index]=='2,1,3' ||blockArray[index]=='2,3,1' ||blockArray[index]=='3,1,2' ||blockArray[index]=='3,2,1')){
                medium = 123
              }
              
              if (substanceArray[index] == 'fertilizer' && blockArray[index] ==1){
                medium = 4
               }else if(substanceArray[index] == 'fertilizer' && blockArray[index] ==2){
                 medium =5
               }else if(substanceArray[index] == 'fertilizer' && blockArray[index] ==3){
                 medium =6
               }else if(substanceArray[index] == 'fertilizer' && (blockArray[index]=='1,2' || blockArray[index]=='2,1')){
                 medium = 45
               }else if(substanceArray[index] == 'fertilizer' && (blockArray[index]=='1,3' || blockArray[index]=='3,1')){
                 medium = 46
               }else if(substanceArray[index] == 'fertilizer' && (blockArray[index]=='2,3' || blockArray[index]=='3,2')){
                 medium = 56
               }else if(substanceArray[index] == 'fertilizer' && (blockArray[index]=='1,2,3' || blockArray[index]=='1,3,2' ||blockArray[index]=='2,1,3' ||blockArray[index]=='2,3,1' ||blockArray[index]=='3,1,2' ||blockArray[index]=='3,2,1')){
                 medium = 456
               }
               console.log(`{"D1":${medium},"D2":${durationArray[index]}}`)
              //  client.publish('2filter/np/c/tkpmIpah/d', `{"D1":${medium},"D2":${durationArray[index]}}`)
               client.publish('filter/np/c/tkpmIpah/d', `{"D1":${medium},"D2":${durationArray[index]}}`)
              // nexplex/control/tkpmIpah/dripping
              // client.publish('debug/nexplex/control/tkpm/sv', JSON.stringify({time:`${element}`, block:`${sv}`, duration:`${durationArray[index]}`,'substance':`${subtanceArray[index]}`}))
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
            let substanceArray = row[i].substance.split(',')
            
            timeArray.forEach((element,index) => {
              jobTkpmPagoh = schedule.scheduleJob(`pagoh${index}`,row[i].date  +" "+  element+":00", function(){
                console.log('Tkpm Pagoh Schedule.',new Date(), blockArray[index], durationArray[index], substanceArray[index]);
                
                let medium
                if (substanceArray[index] == 'water' && blockArray[index] ==1){
                 medium = 1
                }else if(substanceArray[index] == 'water' && blockArray[index] ==2){
                  medium =2
                }else if(substanceArray[index] == 'water' && blockArray[index] ==3){
                  medium =2
                }else if(substanceArray[index] == 'water' && (blockArray[index]=='1,2' || blockArray[index]=='2,1')){
                  medium = 12
                }else if(substanceArray[index] == 'water' && (blockArray[index]=='1,3' || blockArray[index]=='3,1')){
                  medium = 13
                }else if(substanceArray[index] == 'water' && (blockArray[index]=='2,3' || blockArray[index]=='3,2')){
                  medium = 23
                }else if(substanceArray[index] == 'water' && (blockArray[index]=='1,2,3' || blockArray[index]=='1,3,2' ||blockArray[index]=='2,1,3' ||blockArray[index]=='2,3,1' ||blockArray[index]=='3,1,2' ||blockArray[index]=='3,2,1')){
                  medium = 123
                }
                
                if (substanceArray[index] == 'fertilizer' && blockArray[index] ==1){
                  medium = 4
                 }else if(substanceArray[index] == 'fertilizer' && blockArray[index] ==2){
                   medium =5
                 }else if(substanceArray[index] == 'fertilizer' && blockArray[index] ==3){
                   medium =6
                 }else if(substanceArray[index] == 'fertilizer' && (blockArray[index]=='1,2' || blockArray[index]=='2,1')){
                   medium = 45
                 }else if(substanceArray[index] == 'fertilizer' && (blockArray[index]=='1,3' || blockArray[index]=='3,1')){
                   medium = 46
                 }else if(substanceArray[index] == 'fertilizer' && (blockArray[index]=='2,3' || blockArray[index]=='3,2')){
                   medium = 56
                 }else if(substanceArray[index] == 'fertilizer' && (blockArray[index]=='1,2,3' || blockArray[index]=='1,3,2' ||blockArray[index]=='2,1,3' ||blockArray[index]=='2,3,1' ||blockArray[index]=='3,1,2' ||blockArray[index]=='3,2,1')){
                   medium = 456
                 }
              client.publish('filter/np/c/tkpmPagoh/d', `{"D1":${medium},"D2":${durationArray[index]}}`)
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
//  console.log(row)
         for (var i = 0; i < row.length; i++) {
           let timeArray  = row[i].time.split(',')
           let durationArray  = row[i].duration.split(',')
           let substanceArray = row[i].substance.split(',')
          //  console.log(substanceArray)
           timeArray.forEach((element,index) => {
             jobKongPo = schedule.scheduleJob(`kongPo${index}`,row[i].date  +" "+  element+":00", function(){
              //  console.log('Kong Po Schedule.',new Date(), blockArray[index], durationArray[index]);
               let medium
               if (substanceArray[index] == 'water'){
                medium = 1
               }else{
                 medium =2
               }
               console.log(`{${medium},${durationArray[index]}}`)
               client.publish('filter/np/c/kongpo/d', `{"D1":${medium},"D2":${durationArray[index]}}`)

              //  client.publish('debug/nexplex/control/kong/sv', JSON.stringify({time:`${element}`, block:`${sv}`, duration:`${durationArray[index]}`}))
             });
           });
          //  console.log(timeArray)
           timeKongPoArrayLength=timeArray.length
         }
       }
    });
   }

// CREATE JOB SCHEDULE FOR NUTRIENT PREPARATION
function getUpdatedDataIpahNutrient(){
  if(typeof jobIpahNutrient !== 'undefined'){
    delete jobIpahNutrient;
    for(i=0; i<timeIpahArrayLength;i++){
      if(schedule.scheduledJobs[`ipahNutrient${i}`]){
        schedule.scheduledJobs[`ipahNutrient${i}`].cancel()
      }
    }
  }
  dat = [];
  var q = `SELECT * FROM ipah_nutrient_schedule WHERE date = CURDATE()`;
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      for (var i = 0; i < row.length; i++) {
        // console.log(row[i].date)
        let time = row[i].time
        let duration = row[i].duration
   
          jobIpahNutrient = schedule.scheduleJob(`ipahNutrient${i}`,row[i].date  +" "+  "16:27:00", function(){
            console.log('Ipah Nutrient Schedule.',new Date(), time, duration);
            // client.publish('debug/nexplex/control/ipah/sv', JSON.stringify({'time':`${time}`, 'duration':`${duration}`}))
            client.publish('np/c/ipah/n', `{"D1":10,"D2":${duration}}`)
          });
        timeIpahArrayLength=row.length
      }
    }
  });
}

function getUpdatedDataTkpmIpahNutrient(){
  if(typeof jobTkpmIpahNutrient !== 'undefined'){
    delete jobTkpmIpahNutrient;
    for(i=0; i<timeTkpmIpahArrayLength;i++){
      if(schedule.scheduledJobs[`tkpmIpahNutrient${i}`]){
        schedule.scheduledJobs[`tkpmIpahNutrient${i}`].cancel()
      }
    }
  }
  dat = [];
  var q = `SELECT * FROM tkpmipah_nutrient_schedule WHERE date = CURDATE()`;
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      for (var i = 0; i < row.length; i++) {
        // console.log(row[i].date)
        let time = row[i].time
        let duration = row[i].duration
   
          jobTkpmIpahNutrient = schedule.scheduleJob(`tkpmIpahNutrient${i}`,row[i].date  +" "+  "12:39:00", function(){
            console.log('Tkpm Ipah Nutrient Schedule.',new Date(), time, duration);
            client.publish('np/c/tkpmIpah/n', `{"D1":10,"D2":${duration}}`)
          });
        timeTkpmIpahArrayLength=row.length
      }
    }
  });
}

function getUpdatedDataTkpmPagohNutrient(){
  if(typeof jobTkpmPagohNutrient !== 'undefined'){
    delete jobTkpmPagohNutrient;
    for(i=0; i<timeTkpmPagohArrayLength;i++){
      if(schedule.scheduledJobs[`tkpmPagohNutrient${i}`]){
        schedule.scheduledJobs[`tkpmPagohNutrient${i}`].cancel()
      }
    }
  }
  dat = [];
  var q = `SELECT * FROM tkpmpagoh_nutrient_schedule WHERE date = CURDATE()`;
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      for (var i = 0; i < row.length; i++) {
        // console.log(row[i].date)
        let time = row[i].time
        let duration = row[i].duration
   
          jobTkpmPagohNutrient = schedule.scheduleJob(`tkpmPagohNutrient${i}`,row[i].date  +" "+  "19:27:00", function(){
            console.log('Tkpm Pagoh Nutrient Schedule.',new Date(), time, duration);
            client.publish('np/c/tkpmPagoh/n', `{"D1":10,"D2":${duration}}`)

        });
        timeTkpmPagohArrayLength=row.length
      }
    }
  });
}

function getUpdatedDataKongPoNutrient(){
  if(typeof jobKongPoNutrient !== 'undefined'){
    delete jobKongPoNutrient;
    for(i=0; i<timeKongPoArrayLength;i++){
      if(schedule.scheduledJobs[`kongPoNutrient${i}`]){
        schedule.scheduledJobs[`kongPoNutrient${i}`].cancel()
      }
    }
  }
  dat = [];
  var q = `SELECT * FROM kongpo_nutrient_schedule WHERE date = CURDATE()`;
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      for (var i = 0; i < row.length; i++) {
        // console.log(row[i].date)
        let time = row[i].time
        // console.log(time)
        let duration = row[i].duration
   
          jobKongPoNutrient = schedule.scheduleJob(`kongPoNutrient${i}`,row[i].date  +" "+time, function(){
            console.log('Kong Po Nutrient Schedule.',new Date(), time, duration);
            // client.publish('filter/np/c/kongpo/n', JSON.stringify({'time':`${time}`, 'duration':`${duration}`}))
        client.publish('filter/np/c/kongpo/n', `{"D1":10,"D2":${duration}}`)
        });
        timeKongPoArrayLength=row.length
      }
    }
  });
}

// // // // // //

app.get('/', (req, res) => {
  client.publish('debug/test/express','Hello World From Express!')
  res.send(new Date().toLocaleTimeString())
})


// GET //
// DRIPPING WATER/NUTRIENT //
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
        console.log(dat)
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

// NUTREINT PREPARATION //
app.get('/api/schedule/ipah1/nutrient',(req,res)=>{
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

app.get('/api/schedule/ipah2/nutrient',(req,res)=>{
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

app.get('/api/schedule/tkpmPagoh/nutrient',(req,res)=>{
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

app.get('/api/schedule/kongPo/nutrient',(req,res)=>{
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

// POST //
// DRIPPING WATER/NUTRIENT //
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
        client.publish('debug/test/database/ipah2', 'updated')
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
        client.publish('debug/test/database/tkpmPagoh', 'updated')
        res.header('Content-Type', 'application/json; charset=utf-8')
        res.send('Sucess')
      });
  ;
})

app.post('/api/setSchedule/kongPo',(req,res)=>{
  // console.log(req.body.block)
      // ret = JSON.stringify(ipah1)
      var q = `INSERT INTO kongpo_schedule (date,time,duration, substance) VALUES ('${req.body.date}', '${req.body.time}', '${req.body.duration}', '${req.body.substance}')`;
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

// NUTREINT PREPARATION //
app.post('/api/setSchedule/ipah1/nutrient',(req,res)=>{
// console.log(req.body.block)
    // ret = JSON.stringify(ipah1)
    var q = `INSERT INTO ipah_nutrient_schedule (date,time,duration) VALUES ('${req.body.date}', '${req.body.time}', '${req.body.duration}')`;
    connection.query(q, function (error, row, fields) {
      if (error) {
        console.log(error);
      }
      if (row) {
  
      //  console.log(row)
      }
      console.log('post ipah nutrient success')
      // client.publish('debug/test/database/ipah1', 'updated')
      res.header('Content-Type', 'application/json; charset=utf-8')
      res.send('Sucess')
    });
;
})

app.post('/api/setSchedule/ipah2/nutrient',(req,res)=>{
  // console.log(req.body)
      // ret = JSON.stringify(ipah1)
      var q = `INSERT INTO tkpmipah_nutrient_schedule (date,time,duration) VALUES ('${req.body.date}', '${req.body.time}', '${req.body.duration}')`;
      connection.query(q, function (error, row, fields) {
        if (error) {
          console.log(error);
        }
        if (row) {
          console.log('post tkpm ipah nutrient success')
        //  console.log(row)
        }
        // client.publish('debug/test/database/ipah2', 'updated')
        res.header('Content-Type', 'application/json; charset=utf-8')
        res.send('Sucess')
      });
  ;
})

app.post('/api/setSchedule/tkpmPagoh/nutrient',(req,res)=>{
  // console.log(req.body)
      // ret = JSON.stringify(ipah1)
      var q = `INSERT INTO tkpmpagoh_nutrient_schedule (date,time,duration) VALUES ('${req.body.date}', '${req.body.time}', '${req.body.duration}')`;
      connection.query(q, function (error, row, fields) {
        if (error) {
          console.log(error);
        }
        if (row) {
          console.log('post tkpm pagoh nutrient success')
        //  console.log(row)
        }
        // client.publish('debug/test/database/tkpmPagoh', 'updated')
        res.header('Content-Type', 'application/json; charset=utf-8')
        res.send('Sucess')
      });
  ;
})

app.post('/api/setSchedule/kongPo/nutrient',(req,res)=>{
  // console.log(req.body.date)
      // ret = JSON.stringify(ipah1)
      var q = `INSERT INTO kongpo_nutrient_schedule (date,time, duration) VALUES ('${req.body.date}', '${req.body.time}', '${req.body.duration}')`;
      connection.query(q, function (error, row, fields) {
        if (error) {
          console.log(error);
        }
        if (row) {
          console.log('post kong po nutrient success')
        //  console.log(row)
        }
        // client.publish('debug/test/database/kongPo', 'updated')
        res.header('Content-Type', 'application/json; charset=utf-8')
        res.send('Sucess')
      });
  ;
})


// DELETE //
// DRIPPING WATER/NUTRIENT //
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

//  NUTRIENT PREPARATION //
app.delete('/api/schedule/ipah1/nutrient',(req,res)=>{
      dat = [];
      var q = `DELETE FROM ipah_nutrient_schedule WHERE date = "${req.body.date}"`;
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

app.delete('/api/schedule/ipah2/nutrient',(req,res)=>{
      dat = [];
      var q = `DELETE FROM tkpmipah_nutrient_schedule WHERE date = "${req.body.date}"`;
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

app.delete('/api/schedule/tkpmPagoh/nutrient',(req,res)=>{
  dat = [];
  var q = `DELETE FROM tkpmpagoh_nutrient_schedule WHERE date = "${req.body.date}"`;
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

app.delete('/api/schedule/kongPo/nutrient',(req,res)=>{
  dat = [];
  var q = `DELETE FROM kongpo_nutrient_schedule WHERE date = "${req.body.date}"`;
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


// REPORT GENERATOR //
app.post('/api/report/form',(req,res)=>{
  let {user_id, fullName,widthArea, typeOfPlant,location,typeOfPlantSystem, typeOfIrrigationSystem,typeOfWaterSource ,typeOfWaterPump , waterPumpOutput ,typeOfFertilizer ,  typeOfInsecticide ,typeOfNozzle , durationOfFlush ,dateOfPlanting ,dateOfCropYield ,fertilizingDate ,insecticideProcessDate , dateOfPlantingYieldCropInformation, dateOfCropYieldYieldCropInformation ,yieldQuantity ,damageYieldQuantity ,sellingPrice ,salesRevenue ,seasonalResult ,annualResult ,salesRevenueReport ,yieldImprovement ,irrigationPeriod ,rainIntensity ,daysOfRaining ,systemBreakdown}= req.body
  console.log(req.body)
  var q = `INSERT INTO nexplex_agriculture_report (user_id, fullName,widthArea, typeOfPlant,location,typeOfPlantSystem, typeOfIrrigationSystem,typeOfWaterSource ,typeOfWaterPump , waterPumpOutput ,typeOfFertilizer ,  typeOfInsecticide ,typeOfNozzle , durationOfFlush ,dateOfPlanting ,dateOfCropYield ,fertilizingDate , insecticideProcessDate, dateOfPlantingYieldCropInformation,dateOfCropYieldYieldCropInformation,yieldQuantity ,damageYieldQuantity ,sellingPrice ,salesRevenue ,seasonalResult ,annualResult ,salesRevenueReport,yieldImprovement ,irrigationPeriod ,rainIntensity ,daysOfRaining ,systemBreakdown) VALUES ('${user_id}', '${fullName}', '${widthArea}','${typeOfPlant}', '${location}', '${typeOfPlantSystem}','${typeOfIrrigationSystem}', '${typeOfWaterSource}', '${typeOfWaterPump}','${waterPumpOutput}', '${typeOfFertilizer}', '${typeOfInsecticide}','${typeOfNozzle}', '${durationOfFlush}', '${dateOfPlanting}','${dateOfCropYield}', '${fertilizingDate}', '${insecticideProcessDate}', '${dateOfPlantingYieldCropInformation}','${dateOfCropYieldYieldCropInformation }','${yieldQuantity}', '${damageYieldQuantity}', '${sellingPrice}','${salesRevenue}', '${seasonalResult}', '${annualResult}', '${salesRevenueReport}','${yieldImprovement}', '${irrigationPeriod}','${rainIntensity}', '${daysOfRaining}', '${systemBreakdown}')`;

  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      console.log('post nexplex_agriculture_report success')
    //  console.log(row)
    
    }
    // client.publish('debug/test/database/kongPo', 'updated')
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send('Sucess')
  });
})


app.get('/api/report/ipah1',(req,res)=>{
  console.log('heyyy')
  dat = [];
  var q = `SELECT * FROM nexplex_agriculture_report where user_id="0" order by timestamp desc`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      console.log(row[0])
      ipah1=row[0]
    }
    ret = JSON.stringify(ipah1)
    // ret = JSON.stringify(ipah1)
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(ret)
  });
})

app.get('/api/report/ipah2',(req,res)=>{
  console.log('heyyy')
  dat = [];
  var q = `SELECT * FROM nexplex_agriculture_report where user_id="1" order by timestamp desc`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      console.log(row[0])
      ipah1=row[0]
    }
    ret = JSON.stringify(ipah1)
    // ret = JSON.stringify(ipah1)
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(ret)
  });
})

app.get('/api/report/tkpmPagoh',(req,res)=>{
  console.log('heyyy')
  dat = [];
  var q = `SELECT * FROM nexplex_agriculture_report where user_id="2" order by timestamp desc`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      console.log(row[0])
      ipah1=row[0]
    }
    ret = JSON.stringify(ipah1)
    // ret = JSON.stringify(ipah1)
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(ret)
  });
})

// OPEN WEATHER MAP API //

app.get("/api/openWeatherMap/ipah1", async (req, res) => {
  try {
      const response = await axios.get("https://api.openweathermap.org/data/2.5/forecast?lat=1.9340&lon=103.1841&appid=45a2a23d23c78dbe34c5fbd75a591573&units=metric")
      res.json(response.data)
  }
  catch (err) {
      console.log(err)
  }
})

app.get("/api/openWeatherMap/ipah2", async (req, res) => {
  try {
      const response = await axios.get("https://api.openweathermap.org/data/2.5/forecast?lat=1.9340&lon=103.1841&appid=45a2a23d23c78dbe34c5fbd75a591573&units=metric")
      res.json(response.data)
  }
  catch (err) {
      console.log(err)
  }
})

app.get("/api/openWeatherMap/tkpmPagoh", async (req, res) => {
  try {
      const response = await axios.get("https://api.openweathermap.org/data/2.5/forecast?lat=2.1381&lon=102.7395&appid=45a2a23d23c78dbe34c5fbd75a591573&units=metric")
      res.json(response.data)
      console.log(res)
  }
  catch (err) {
      console.log(err)
  }
})

app.get("/api/openWeatherMap/kongPo", async (req, res) => {
  try {
      const response = await axios.get("https://api.openweathermap.org/data/2.5/forecast?lat=1.5135&lon=103.9605&appid=45a2a23d23c78dbe34c5fbd75a591573&units=metric")
      res.json(response.data)
  }
  catch (err) {
      console.log(err)
  }
})

// // // // // // // // //
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

// API FOR USER/AUTH 
app.use("/api/auth", require("./routes/user/auth"))
app.use("/api/user", require("./routes/user/user"))
// app.use("/api/admin", require("./routes/admin"))


// API FOR TRENDS
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

// DRIPING WATER/NUTRIENT
getUpdatedDataIpah()
getUpdatedDataTkpmIpah()
getUpdatedDataTkpmPagoh()
getUpdatedDataKongPo()

// NUTRIENT PREPARATION
getUpdatedDataIpahNutrient()
getUpdatedDataTkpmIpahNutrient()
getUpdatedDataTkpmPagohNutrient()
getUpdatedDataKongPoNutrient()
},6000)