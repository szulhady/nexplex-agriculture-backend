const express = require('express')
const router = express.Router()
const connection = require("../../config/database");

var mqtt = require('mqtt')
var client  = mqtt.connect('192.168.0.108:1883')
let timeIpahArrayLength=0
// GET
// NUTREINT PREPARATION //
router.get('/api/dailySchedule/ipah1',(req,res)=>{
  dat = [];
  var q = `SELECT * FROM ipah_schedule WHERE date = CURDATE()`;
  // connection.connect();
  connection.query(q, function (error, row, fields) {
    if (error) {
      console.log(error);
    }
    if (row) {
      console.log(row)
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
          });

        });
        console.log(timeArray)
        console.log(blockArray)
        console.log(durationArray)
        console.log(substanceArray)
        // console.log(timeArray)
        timeIpahArrayLength=timeArray.length
      }
      ipah1=row
    }
    ret = JSON.stringify(ipah1)
    res.header('Content-Type', 'application/json; charset=utf-8')
    res.send(ret)
  });
})

// router.get('/api/schedule/ipah2/nutrient',(req,res)=>{
//   dat = [];
//   var q = `SELECT * FROM tkpmipah_nutrient_schedule order by date asc`;
//   // connection.connect();
//   connection.query(q, function (error, row, fields) {
//     if (error) {
//       console.log(error);
//     }
//     if (row) {

//       for (var i = 0; i < row.length; i++) {
//         let data2=[]
//         data2.push(`Duration : ${row[i].duration} minutes`)
//         let data = {
//           date:row[i].date,
//           time:row[i].time,
//           remarks:data2,
//         }
//         dat.push(
//           data
//         );
//       }
//       ipah1=dat
//     }
//     ret = JSON.stringify(ipah1)
//     res.header('Content-Type', 'application/json; charset=utf-8')
//     res.send(ret)
//   });
// })

// router.get('/api/schedule/tkpmPagoh/nutrient',(req,res)=>{
//   dat = [];
//   var q = `SELECT * FROM tkpmpagoh_nutrient_schedule order by date asc`;
//   // connection.connect();
//   connection.query(q, function (error, row, fields) {
//     if (error) {
//       console.log(error);
//     }
//     if (row) {

//       for (var i = 0; i < row.length; i++) {
//         let data2=[]
//         data2.push(`Duration : ${row[i].duration} minutes`)
//         let data = {
//           date:row[i].date,
//           time:row[i].time,
//           remarks:data2,
//         }
//         dat.push(
//           data
//         );
//       }
//       ipah1=dat
//     }
//     ret = JSON.stringify(ipah1)
//     res.header('Content-Type', 'application/json; charset=utf-8')
//     res.send(ret)
//   });
// })

// router.get('/api/schedule/kongPo/nutrient',(req,res)=>{
//   dat = [];
//   var q = `SELECT * FROM kongpo_nutrient_schedule order by date asc`;
//   // connection.connect();
//   connection.query(q, function (error, row, fields) {
//     if (error) {
//       console.log(error);
//     }
//     if (row) {
//       for (var i = 0; i < row.length; i++) {
//         let data2=[]
//         data2.push(`Duration : ${row[i].duration} minutes`)
//         let data = {
//           date:row[i].date,
//           time:row[i].time,
//           remarks:data2,
//         }
//         dat.push(
//           data
//         );
//       }
//       ipah1=dat
//     }
//     ret = JSON.stringify(ipah1)
//     res.header('Content-Type', 'application/json; charset=utf-8')
//     res.send(ret)
//   });
// })

// router.get('/api/schedule/manong/nutrient',(req,res)=>{
//   dat = [];
//   var q = `SELECT * FROM manong_nutrient_schedule WHERE date >= CURDATE() order by date asc`;
//   // connection.connect();
//   connection.query(q, function (error, row, fields) {
//     if (error) {
//       console.log(error);
//     }
//     if (row) {
//       for (var i = 0; i < row.length; i++) {
//         let data2=[]
//         data2.push(`EC value : ${row[i].ec}`)
//         let data = {
//           date:row[i].date,
//           time:row[i].time,
//           remarks:data2,
//         }
//         dat.push(
//           data
//         );
//       }
//       ipah1=dat
//     }
//     ret = JSON.stringify(ipah1)
//     res.header('Content-Type', 'application/json; charset=utf-8')
//     res.send(ret)
//   });
// })

// router.get('/api/schedule/kelantan1/nutrient',(req,res)=>{
//   dat = [];
//   var q = `SELECT * FROM kelantan1_nutrient_schedule WHERE date >= CURDATE() order by date asc`;
//   // connection.connect();
//   connection.query(q, function (error, row, fields) {
//     if (error) {
//       console.log(error);
//     }
//     if (row) {
//       for (var i = 0; i < row.length; i++) {
//         let data2=[]
//         data2.push(`EC value : ${row[i].ec}`)
//         let data = {
//           date:row[i].date,
//           time:row[i].time,
//           remarks:data2,
//         }
//         dat.push(
//           data
//         );
//       }
//       ipah1=dat
//     }
//     ret = JSON.stringify(ipah1)
//     res.header('Content-Type', 'application/json; charset=utf-8')
//     res.send(ret)
//   });
// })

// router.get('/api/schedule/kelantan2/nutrient',(req,res)=>{
//   dat = [];
//   var q = `SELECT * FROM kelantan2_nutrient_schedule WHERE date >= CURDATE() order by date asc`;
//   // connection.connect();
//   connection.query(q, function (error, row, fields) {
//     if (error) {
//       console.log(error);
//     }
//     if (row) {
//       for (var i = 0; i < row.length; i++) {
//         let data2=[]
//         data2.push(`EC value : ${row[i].ec}`)
//         let data = {
//           date:row[i].date,
//           time:row[i].time,
//           remarks:data2,
//         }
//         dat.push(
//           data
//         );
//       }
//       ipah1=dat
//     }
//     ret = JSON.stringify(ipah1)
//     res.header('Content-Type', 'application/json; charset=utf-8')
//     res.send(ret)
//   });
// })

// router.get('/api/schedule/terengganu1/nutrient',(req,res)=>{
//   dat = [];
//   var q = `SELECT * FROM terengganu1_nutrient_schedule WHERE date >= CURDATE() order by date asc`;
//   // connection.connect();
//   connection.query(q, function (error, row, fields) {
//     if (error) {
//       console.log(error);
//     }
//     if (row) {
//       for (var i = 0; i < row.length; i++) {
//         let data2=[]
//         data2.push(`EC value : ${row[i].ec}`)
//         let data = {
//           date:row[i].date,
//           time:row[i].time,
//           remarks:data2,
//         }
//         dat.push(
//           data
//         );
//       }
//       ipah1=dat
//     }
//     ret = JSON.stringify(ipah1)
//     res.header('Content-Type', 'application/json; charset=utf-8')
//     res.send(ret)
//   });
// })

// router.get('/api/schedule/terengganu2/nutrient',(req,res)=>{
//   dat = [];
//   var q = `SELECT * FROM terengganu2_nutrient_schedule WHERE date >= CURDATE() order by date asc`;
//   // connection.connect();
//   connection.query(q, function (error, row, fields) {
//     if (error) {
//       console.log(error);
//     }
//     if (row) {
//       for (var i = 0; i < row.length; i++) {
//         let data2=[]
//         data2.push(`EC value : ${row[i].ec}`)
//         let data = {
//           date:row[i].date,
//           time:row[i].time,
//           remarks:data2,
//         }
//         dat.push(
//           data
//         );
//       }
//       ipah1=dat
//     }
//     ret = JSON.stringify(ipah1)
//     res.header('Content-Type', 'application/json; charset=utf-8')
//     res.send(ret)
//   });
// })

// router.get('/api/schedule/kertih1/nutrient',(req,res)=>{
//   dat = [];
//   var q = `SELECT * FROM kertih1_nutrient_schedule WHERE date >= CURDATE() order by date asc`;
//   // connection.connect();
//   connection.query(q, function (error, row, fields) {
//     if (error) {
//       console.log(error);
//     }
//     if (row) {
//       for (var i = 0; i < row.length; i++) {
//         let data2=[]
//         data2.push(`EC value : ${row[i].ec}`)
//         let data = {
//           date:row[i].date,
//           time:row[i].time,
//           remarks:data2,
//         }
//         dat.push(
//           data
//         );
//       }
//       ipah1=dat
//     }
//     ret = JSON.stringify(ipah1)
//     res.header('Content-Type', 'application/json; charset=utf-8')
//     res.send(ret)
//   });
// })

// router.get('/api/schedule/kertih2/nutrient',(req,res)=>{
//   dat = [];
//   var q = `SELECT * FROM kertih2_nutrient_schedule WHERE date >= CURDATE() order by date asc`;
//   // connection.connect();
//   connection.query(q, function (error, row, fields) {
//     if (error) {
//       console.log(error);
//     }
//     if (row) {
//       for (var i = 0; i < row.length; i++) {
//         let data2=[]
//         data2.push(`EC value : ${row[i].ec}`)
//         let data = {
//           date:row[i].date,
//           time:row[i].time,
//           remarks:data2,
//         }
//         dat.push(
//           data
//         );
//       }
//       ipah1=dat
//     }
//     ret = JSON.stringify(ipah1)
//     res.header('Content-Type', 'application/json; charset=utf-8')
//     res.send(ret)
//   });
// })

// router.get('/api/schedule/kuantan/nutrient',(req,res)=>{
//   dat = [];
//   var q = `SELECT * FROM kuantan_nutrient_schedule WHERE date >= CURDATE() order by date asc`;
//   // connection.connect();
//   connection.query(q, function (error, row, fields) {
//     if (error) {
//       console.log(error);
//     }
//     if (row) {
//       for (var i = 0; i < row.length; i++) {
//         let data2=[]
//         data2.push(`EC value : ${row[i].ec}`)
//         let data = {
//           date:row[i].date,
//           time:row[i].time,
//           remarks:data2,
//         }
//         dat.push(
//           data
//         );
//       }
//       ipah1=dat
//     }
//     ret = JSON.stringify(ipah1)
//     res.header('Content-Type', 'application/json; charset=utf-8')
//     res.send(ret)
//   });
// })

module.exports = router