const express = require('express')
const app = express()
const port = 5000
const cors = require('cors')
const moment = require('moment')
const connection = require("./config/database");
const passport = require( 'passport' );
var mqtt = require('mqtt')
// var client  = mqtt.connect('wss://broker.hivemq.com:8083/mqtt')
// var client  = mqtt.connect('mqtt://broker.hivemq.com:1883')
var client  = mqtt.connect('wss://www.txio.live:8083/mqtt')
// var client  = mqtt.connect('wss://www.airmode.live:8083/mqtt')
// var client  = mqtt.connect('wss://tron.airmode.live:8083/mqtt')

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
              //  client.publish('filter/np/c/ipah/d/debug', `{"D1":${medium},"D2":${durationArray[index]}}`)
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

  function getUpdatedDataManong(){
    if(typeof jobManong !== 'undefined'){
      // console.log(timeKongPoArrayLength)
      delete jobManong;
      // console.log(schedule.scheduledJobs)
       for(i=0; i<timeManongArrayLength;i++){
         if(schedule.scheduledJobs[`manong${i}`]){
           schedule.scheduledJobs[`manong${i}`].cancel()
         }
       }
      //  console.log(schedule.scheduledJobs)
       
     }
       dat = [];
       var q = `SELECT * FROM manong_schedule WHERE date = CURDATE()`;
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
               jobManong = schedule.scheduleJob(`manong${index}`,row[i].date  +" "+  element+":00", function(){
                 console.log('Kong Po Schedule.',new Date(), element);
                 let medium
                 if (substanceArray[index] == 'water'){
                  medium = 1
                 }else{
                   medium =2
                 }
                 console.log(`{${medium},${durationArray[index]}}`)
                 client.publish('filter/np/c/manong/d', `{"D1":${medium},"D2":${durationArray[index]}}`)
  
                //  client.publish('debug/nexplex/control/kong/sv', JSON.stringify({time:`${element}`, block:`${sv}`, duration:`${durationArray[index]}`}))
               });
             });
            //  console.log(timeArray)
             timeManongArrayLength=timeArray.length
           }
         }
      });
  }

  function getUpdatedDataKelantan1(){
    if(typeof jobKelantan1 !== 'undefined'){
      // console.log(timeKongPoArrayLength)
      delete jobKelantan1;
      // console.log(schedule.scheduledJobs)
       for(i=0; i<timeKelantan1ArrayLength;i++){
         if(schedule.scheduledJobs[`kelantan1${i}`]){
           schedule.scheduledJobs[`kelantan1${i}`].cancel()
         }
       }
      //  console.log(schedule.scheduledJobs)
       
     }
       dat = [];
       var q = `SELECT * FROM kelantan1_schedule WHERE date = CURDATE()`;
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
               jobKelantan1 = schedule.scheduleJob(`kelantan1${index}`,row[i].date  +" "+  element+":00", function(){
                 console.log('Kelantan1 Schedule.',new Date(), element);
                 let medium
                 if (substanceArray[index] == 'water'){
                  medium = 1
                 }else{
                   medium =2
                 }
                 console.log(`{${medium},${durationArray[index]}}`)
                 client.publish('filter/np/c/kelantan1/d', `{"D1":${medium},"D2":${durationArray[index]}}`)
                //  client.publish('debug/nexplex/control/kong/sv', JSON.stringify({time:`${element}`, block:`${sv}`, duration:`${durationArray[index]}`}))
               });
             });
            //  console.log(timeArray)
             timeKelantan1ArrayLength=timeArray.length
           }
         }
      });
  }

  function getUpdatedDataKelantan2(){
    if(typeof jobKelantan2 !== 'undefined'){
      // console.log(timeKongPoArrayLength)
      delete jobKelantan2;
      // console.log(schedule.scheduledJobs)
       for(i=0; i<timeKelantan2ArrayLength;i++){
         if(schedule.scheduledJobs[`kelantan2${i}`]){
           schedule.scheduledJobs[`kelantan2${i}`].cancel()
         }
       }
      //  console.log(schedule.scheduledJobs)
       
     }
       dat = [];
       var q = `SELECT * FROM kelantan2_schedule WHERE date = CURDATE()`;
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
               jobKelantan2 = schedule.scheduleJob(`kelantan2${index}`,row[i].date  +" "+  element+":00", function(){
                 console.log('Kelantan2 Schedule.',new Date(), element);
                 let medium
                 if (substanceArray[index] == 'water'){
                  medium = 1
                 }else{
                   medium =2
                 }
                 console.log(`{${medium},${durationArray[index]}}`)
                 client.publish('filter/np/c/kelantan2/d', `{"D1":${medium},"D2":${durationArray[index]}}`)
                //  client.publish('debug/nexplex/control/kong/sv', JSON.stringify({time:`${element}`, block:`${sv}`, duration:`${durationArray[index]}`}))
               });
             });
            //  console.log(timeArray)
             timeKelantan2ArrayLength=timeArray.length
           }
         }
      });
  }

  function getUpdatedDataTerengganu1(){
    if(typeof jobTerengganu1 !== 'undefined'){
      // console.log(timeKongPoArrayLength)
      delete jobTerengganu1;
      // console.log(schedule.scheduledJobs)
       for(i=0; i<timeTerengganu1ArrayLength;i++){
         if(schedule.scheduledJobs[`terengganu1${i}`]){
           schedule.scheduledJobs[`terengganu1${i}`].cancel()
         }
       }
      //  console.log(schedule.scheduledJobs)
       
     }
       dat = [];
       var q = `SELECT * FROM terengganu1_schedule WHERE date = CURDATE()`;
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
               jobTerengganu1 = schedule.scheduleJob(`terengganu1${index}`,row[i].date  +" "+  element+":00", function(){
                 console.log('Terengganu1 Schedule.',new Date(), element);
                 let medium
                 if (substanceArray[index] == 'water'){
                  medium = 1
                 }else{
                   medium =2
                 }
                 console.log(`{${medium},${durationArray[index]}}`)
                 client.publish('filter/np/c/terengganu1/d', `{"D1":${medium},"D2":${durationArray[index]}}`)
                //  client.publish('debug/nexplex/control/kong/sv', JSON.stringify({time:`${element}`, block:`${sv}`, duration:`${durationArray[index]}`}))
               });
             });
            //  console.log(timeArray)
             timeTerengganu1ArrayLength=timeArray.length
           }
         }
      });
  }

  function getUpdatedDataTerengganu2(){
    if(typeof jobTerengganu2 !== 'undefined'){
      // console.log(timeKongPoArrayLength)
      delete jobTerengganu2;
      // console.log(schedule.scheduledJobs)
       for(i=0; i<timeTerengganu2ArrayLength;i++){
         if(schedule.scheduledJobs[`terengganu2${i}`]){
           schedule.scheduledJobs[`terengganu2${i}`].cancel()
         }
       }
      //  console.log(schedule.scheduledJobs)
       
     }
       dat = [];
       var q = `SELECT * FROM terengganu2_schedule WHERE date = CURDATE()`;
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
               jobTerengganu2 = schedule.scheduleJob(`terengganu2${index}`,row[i].date  +" "+  element+":00", function(){
                 console.log('Terengganu2 Schedule.',new Date(), element);
                 let medium
                 if (substanceArray[index] == 'water'){
                  medium = 1
                 }else{
                   medium =2
                 }
                 console.log(`{${medium},${durationArray[index]}}`)
                 client.publish('filter/np/c/terengganu2/d', `{"D1":${medium},"D2":${durationArray[index]}}`)
                //  client.publish('debug/nexplex/control/kong/sv', JSON.stringify({time:`${element}`, block:`${sv}`, duration:`${durationArray[index]}`}))
               });
             });
            //  console.log(timeArray)
             timeTerengganu2ArrayLength=timeArray.length
           }
         }
      });
  }

  function getUpdatedDataKertih1(){
    if(typeof jobKertih1 !== 'undefined'){
      // console.log(timeKongPoArrayLength)
      delete jobKertih1;
      // console.log(schedule.scheduledJobs)
       for(i=0; i<timeKertih1ArrayLength;i++){
         if(schedule.scheduledJobs[`kertih1${i}`]){
           schedule.scheduledJobs[`kertih1${i}`].cancel()
         }
       }
      //  console.log(schedule.scheduledJobs)
       
     }
       dat = [];
       var q = `SELECT * FROM kertih1_schedule WHERE date = CURDATE()`;
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
               jobKertih1 = schedule.scheduleJob(`kertih1${index}`,row[i].date  +" "+  element+":00", function(){
                 console.log('Kertih1 Schedule.',new Date(), element);
                 let medium
                 if (substanceArray[index] == 'water'){
                  medium = 1
                 }else{
                   medium =2
                 }
                 console.log(`{${medium},${durationArray[index]}}`)
                 client.publish('filter/np/c/kertih1/d', `{"D1":${medium},"D2":${durationArray[index]}}`)
                //  client.publish('debug/nexplex/control/kong/sv', JSON.stringify({time:`${element}`, block:`${sv}`, duration:`${durationArray[index]}`}))
               });
             });
            //  console.log(timeArray)
             timeKertih1ArrayLength=timeArray.length
           }
         }
      });
  }

  function getUpdatedDataKertih2(){
    if(typeof jobKertih2 !== 'undefined'){
      // console.log(timeKongPoArrayLength)
      delete jobKertih2;
      // console.log(schedule.scheduledJobs)
       for(i=0; i<timeKertih2ArrayLength;i++){
         if(schedule.scheduledJobs[`kertih2${i}`]){
           schedule.scheduledJobs[`kertih2${i}`].cancel()
         }
       }
      //  console.log(schedule.scheduledJobs)
       
     }
       dat = [];
       var q = `SELECT * FROM kertih2_schedule WHERE date = CURDATE()`;
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
               jobKertih2 = schedule.scheduleJob(`kertih2${index}`,row[i].date  +" "+  element+":00", function(){
                 console.log('Kertih2 Schedule.',new Date(), element);
                 let medium
                 if (substanceArray[index] == 'water'){
                  medium = 1
                 }else{
                   medium =2
                 }
                 console.log(`{${medium},${durationArray[index]}}`)
                 client.publish('filter/np/c/kertih2/d', `{"D1":${medium},"D2":${durationArray[index]}}`)
                //  client.publish('debug/nexplex/control/kong/sv', JSON.stringify({time:`${element}`, block:`${sv}`, duration:`${durationArray[index]}`}))
               });
             });
            //  console.log(timeArray)
             timeKertih2ArrayLength=timeArray.length
           }
         }
      });
  }

  function getUpdatedDataKuantan(){
    if(typeof jobKuantan !== 'undefined'){
      // console.log(timeKongPoArrayLength)
      delete jobKuantan;
      // console.log(schedule.scheduledJobs)
       for(i=0; i<timeKuantanArrayLength;i++){
         if(schedule.scheduledJobs[`kuantan${i}`]){
           schedule.scheduledJobs[`kuantan${i}`].cancel()
         }
       }
      //  console.log(schedule.scheduledJobs)
       
     }
       dat = [];
       var q = `SELECT * FROM kuantan_schedule WHERE date = CURDATE()`;
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
               jobKuantan = schedule.scheduleJob(`kuantan${index}`,row[i].date  +" "+  element+":00", function(){
                 console.log('Kuantan Schedule.',new Date(), element);
                 let medium
                 if (substanceArray[index] == 'water'){
                  medium = 1
                 }else{
                   medium =2
                 }
                 console.log(`{${medium},${durationArray[index]}}`)
                 client.publish('filter/np/c/kuantan/d', `{"D1":${medium},"D2":${durationArray[index]}}`)
                //  client.publish('debug/nexplex/control/kong/sv', JSON.stringify({time:`${element}`, block:`${sv}`, duration:`${durationArray[index]}`}))
               });
             });
            //  console.log(timeArray)
             timeKuantanArrayLength=timeArray.length
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
   
          jobIpahNutrient = schedule.scheduleJob(`ipahNutrient${i}`,row[i].date  +" "+  "05:00:00", function(){
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
   
          jobTkpmIpahNutrient = schedule.scheduleJob(`tkpmIpahNutrient${i}`,row[i].date  +" "+  "05:00:00", function(){
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
   
          jobTkpmPagohNutrient = schedule.scheduleJob(`tkpmPagohNutrient${i}`,row[i].date  +" "+  "05:00:00", function(){
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

function getUpdatedDataManongNutrient(){
  if(typeof jobManongNutrient !== 'undefined'){
    delete jobManongNutrient;
    for(i=0; i<timeManongArrayLength;i++){
      if(schedule.scheduledJobs[`manongNutrient${i}`]){
        schedule.scheduledJobs[`manongNutrient${i}`].cancel()
      }
    }
  }
  dat = [];
  var q = `SELECT * FROM manong_nutrient_schedule WHERE date = CURDATE()`;
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      for (var i = 0; i < row.length; i++) {
        console.log(row[i])
        let time = row[i].time
        // console.log(time)
        let ec = row[i].ec
          jobManongNutrient = schedule.scheduleJob(`manongNutrient${i}`,row[i].date  +" "+time, function(){
            console.log('Manong Nutrient Schedule.',new Date(), time, ec);
            // client.publish('filter/np/c/kongpo/n', JSON.stringify({'time':`${time}`, 'ec':`${ec}`}))
        client.publish('filter/np/c/manong/n', `{"D1":10,"D2":${ec}}`)
        });
        timeManongArrayLength=row.length
      }
    }
  });
}

function getUpdatedDataKelantan1Nutrient(){
  if(typeof jobKelantan1Nutrient !== 'undefined'){
    delete jobKelantan1Nutrient;
    for(i=0; i<timeKelantan1ArrayLength;i++){
      if(schedule.scheduledJobs[`kelantan1Nutrient${i}`]){
        schedule.scheduledJobs[`kelantan1Nutrient${i}`].cancel()
      }
    }
  }
  dat = [];
  var q = `SELECT * FROM kelantan1_nutrient_schedule WHERE date = CURDATE()`;
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      for (var i = 0; i < row.length; i++) {
        console.log(row[i])
        let time = row[i].time
        // console.log(time)
        let ec = row[i].ec
          jobKelantan1Nutrient = schedule.scheduleJob(`kelantan1Nutrient${i}`,row[i].date  +" "+time, function(){
            console.log('Kelantan1 Nutrient Schedule.',new Date(), time, ec);
            // client.publish('filter/np/c/kongpo/n', JSON.stringify({'time':`${time}`, 'ec':`${ec}`}))
        client.publish('filter/np/c/kelantan1/n', `{"D1":10,"D2":${ec}}`)
        });
        timeKelantan1ArrayLength=row.length
      }
    }
  });
}

function getUpdatedDataKelantan2Nutrient(){
  if(typeof jobKelantan2Nutrient !== 'undefined'){
    delete jobKelantan2Nutrient;
    for(i=0; i<timeKelantan2ArrayLength;i++){
      if(schedule.scheduledJobs[`kelantan2Nutrient${i}`]){
        schedule.scheduledJobs[`kelantan2Nutrient${i}`].cancel()
      }
    }
  }
  dat = [];
  var q = `SELECT * FROM kelantan2_nutrient_schedule WHERE date = CURDATE()`;
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      for (var i = 0; i < row.length; i++) {
        console.log(row[i])
        let time = row[i].time
        // console.log(time)
        let ec = row[i].ec
          jobKelantan2Nutrient = schedule.scheduleJob(`kelantan2Nutrient${i}`,row[i].date  +" "+time, function(){
            console.log('Kelantan2 Nutrient Schedule.',new Date(), time, ec);
            // client.publish('filter/np/c/kongpo/n', JSON.stringify({'time':`${time}`, 'ec':`${ec}`}))
        client.publish('filter/np/c/kelantan2/n', `{"D1":10,"D2":${ec}}`)
        });
        timeKelantan2ArrayLength=row.length
      }
    }
  });
}

function getUpdatedDataTerengganu1Nutrient(){
  if(typeof jobTerengganu1Nutrient !== 'undefined'){
    delete jobTerengganu1Nutrient;
    for(i=0; i<timeTerengganu1ArrayLength;i++){
      if(schedule.scheduledJobs[`terengganu1Nutrient${i}`]){
        schedule.scheduledJobs[`terengganu1Nutrient${i}`].cancel()
      }
    }
  }
  dat = [];
  var q = `SELECT * FROM terengganu1_nutrient_schedule WHERE date = CURDATE()`;
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      for (var i = 0; i < row.length; i++) {
        console.log(row[i])
        let time = row[i].time
        // console.log(time)
        let ec = row[i].ec
          jobTerengganu1Nutrient = schedule.scheduleJob(`terengganu1Nutrient${i}`,row[i].date  +" "+time, function(){
            console.log('Terengganu1 Nutrient Schedule.',new Date(), time, ec);
            // client.publish('filter/np/c/kongpo/n', JSON.stringify({'time':`${time}`, 'ec':`${ec}`}))
        client.publish('filter/np/c/terengganu1/n', `{"D1":10,"D2":${ec}}`)
        });
        timeTerengganu1ArrayLength=row.length
      }
    }
  });
}

function getUpdatedDataTerengganu2Nutrient(){
  if(typeof jobTerengganu2Nutrient !== 'undefined'){
    delete jobTerengganu2Nutrient;
    for(i=0; i<timeTerengganu2ArrayLength;i++){
      if(schedule.scheduledJobs[`terengganu2Nutrient${i}`]){
        schedule.scheduledJobs[`terengganu2Nutrient${i}`].cancel()
      }
    }
  }
  dat = [];
  var q = `SELECT * FROM terengganu2_nutrient_schedule WHERE date = CURDATE()`;
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      for (var i = 0; i < row.length; i++) {
        console.log(row[i])
        let time = row[i].time
        // console.log(time)
        let ec = row[i].ec
          jobTerengganu2Nutrient = schedule.scheduleJob(`terengganu2Nutrient${i}`,row[i].date  +" "+time, function(){
            console.log('terengganu2 Nutrient Schedule.',new Date(), time, ec);
            // client.publish('filter/np/c/kongpo/n', JSON.stringify({'time':`${time}`, 'ec':`${ec}`}))
        client.publish('filter/np/c/terengganu2/n', `{"D1":10,"D2":${ec}}`)
        });
        timeTerengganu2ArrayLength=row.length
      }
    }
  });
}

function getUpdatedDataKertih1Nutrient(){
  if(typeof jobKertih1Nutrient !== 'undefined'){
    delete jobKertih1Nutrient;
    for(i=0; i<timeKertih1ArrayLength;i++){
      if(schedule.scheduledJobs[`kertih1Nutrient${i}`]){
        schedule.scheduledJobs[`kertih1Nutrient${i}`].cancel()
      }
    }
  }
  dat = [];
  var q = `SELECT * FROM kertih1_nutrient_schedule WHERE date = CURDATE()`;
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      for (var i = 0; i < row.length; i++) {
        console.log(row[i])
        let time = row[i].time
        // console.log(time)
        let ec = row[i].ec
          jobKertih1Nutrient = schedule.scheduleJob(`kertih1Nutrient${i}`,row[i].date  +" "+time, function(){
            console.log('Kertih1 Nutrient Schedule.',new Date(), time, ec);
            // client.publish('filter/np/c/kongpo/n', JSON.stringify({'time':`${time}`, 'ec':`${ec}`}))
        client.publish('filter/np/c/kertih1/n', `{"D1":10,"D2":${ec}}`)
        });
        timeKertih1ArrayLength=row.length
      }
    }
  });
}

function getUpdatedDataKertih2Nutrient(){
  if(typeof jobKertih2Nutrient !== 'undefined'){
    delete jobKertih2Nutrient;
    for(i=0; i<timeKertih2ArrayLength;i++){
      if(schedule.scheduledJobs[`kertih2Nutrient${i}`]){
        schedule.scheduledJobs[`kertih2Nutrient${i}`].cancel()
      }
    }
  }
  dat = [];
  var q = `SELECT * FROM kertih2_nutrient_schedule WHERE date = CURDATE()`;
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      for (var i = 0; i < row.length; i++) {
        console.log(row[i])
        let time = row[i].time
        // console.log(time)
        let ec = row[i].ec
          jobKertih2Nutrient = schedule.scheduleJob(`kertih2Nutrient${i}`,row[i].date  +" "+time, function(){
            console.log('kertih2 Nutrient Schedule.',new Date(), time, ec);
            // client.publish('filter/np/c/kongpo/n', JSON.stringify({'time':`${time}`, 'ec':`${ec}`}))
        client.publish('filter/np/c/kertih2/n', `{"D1":10,"D2":${ec}}`)
        });
        timeKertih2ArrayLength=row.length
      }
    }
  });
}

function getUpdatedDataKuantanNutrient(){
  if(typeof jobKuantanNutrient !== 'undefined'){
    delete jobKuantanNutrient;
    for(i=0; i<timeKuantanArrayLength;i++){
      if(schedule.scheduledJobs[`kuantanNutrient${i}`]){
        schedule.scheduledJobs[`kuantanNutrient${i}`].cancel()
      }
    }
  }
  dat = [];
  var q = `SELECT * FROM kuantan_nutrient_schedule WHERE date = CURDATE()`;
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      for (var i = 0; i < row.length; i++) {
        console.log(row[i])
        let time = row[i].time
        // console.log(time)
        let ec = row[i].ec
          jobKuantanNutrient = schedule.scheduleJob(`kuantanNutrient${i}`,row[i].date  +" "+time, function(){
            console.log('Kuantan Nutrient Schedule.',new Date(), time, ec);
            // client.publish('filter/np/c/kongpo/n', JSON.stringify({'time':`${time}`, 'ec':`${ec}`}))
        client.publish('filter/np/c/kuantan/n', `{"D1":10,"D2":${ec}}`)
        });
        timeKuantanArrayLength=row.length
      }
    }
  });
}

// // // // // //

app.get('/', (req, res) => {
  client.publish('debug/test/express','Hello World From Express!')
  res.send(new Date().toLocaleTimeString())
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


// // // // // // // // //
client.on('connect', function () {
  console.log('herreeee')
  client.subscribe('debug/test/database/ipah1', function (err) {
    if (!err) {
      
      // client.publish('debug/test/database/ipah1000', 'hello',{retain:true})
    }
  })
  client.subscribe('debug/test/database/ipah2', function (err) {
    if (!err) {
      // client.publish('filter/np/c/manong/d', 'Hello mqtt')
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

// API FOR USER/AUTH  MOBILE
app.use("/api/auth/mobile", require("./routes/user/authMobile"))
app.use("/api/user/mobile", require("./routes/user/userMobile"))
// app.use("/api/admin", require("./routes/admin"))

// API FOR SCHEDULE MOBILE
app.use("/", require("./routes/schedule/scheduleDripping"))
app.use("/", require("./routes/schedule/scheduleDossing"))

// API FOR OPEN WEATHERMAP
app.use("/", require("./routes/weatherMap/weatherMap"))

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
getUpdatedDataManong()
getUpdatedDataKelantan1()
getUpdatedDataKelantan2()
getUpdatedDataTerengganu1()
getUpdatedDataTerengganu2()
getUpdatedDataKertih1()
getUpdatedDataKertih2()
getUpdatedDataKuantan()

// NUTRIENT PREPARATION
getUpdatedDataIpahNutrient()
getUpdatedDataTkpmIpahNutrient()
getUpdatedDataTkpmPagohNutrient()
getUpdatedDataKongPoNutrient()
getUpdatedDataManongNutrient()
getUpdatedDataKelantan1Nutrient()
getUpdatedDataKelantan2Nutrient()
getUpdatedDataTerengganu1Nutrient()
getUpdatedDataTerengganu2Nutrient()
getUpdatedDataKertih1Nutrient()
getUpdatedDataKertih2Nutrient()
getUpdatedDataKuantanNutrient()
},6000)

app.post("/try/react",(req,res)=>{
  console.log(req.body.params)
})