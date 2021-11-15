const express = require('express')
const router = express.Router()
const passport = require( 'passport' );
require( '../../config/passportMobile.js' )( passport )

const jwt = require ( 'jsonwebtoken' );
const connection = require("../../config/database");

router.post('/login', 
passport.authenticate('mobile-local', { session: true}), //need to update from nuxt auth.
async function(req, res) {
  // console.log('here')
  const token = jwt.sign(req.user.user_id, 'JWT_SECRET_OR_KEY2');
  // console.log(token)
  return res.json({ token });
});

router.get('/me',
  passport.authenticate(['mobile-jwt',], { session: false }),
  async function(req, res,) {
    // console.log(req)
    const { userId } = req.user;
    console.log('here',userId)
    // "SELECT * FROM users INNER JOIN topics ON users.id=topics.userID WHERE id = ?",
    // connection.query(`SELECT * FROM users INNER JOIN topics ON users.id=topics.userID WHERE id = "${userId}"`, (err,results) =>{

    connection.query(`SELECT * FROM users_nexplex_agriculture_mobile  RIGHT JOIN stations_nexplex_agriculture_mobile ON users_nexplex_agriculture_mobile.station_id = stations_nexplex_agriculture_mobile.id   RIGHT JOIN details_nexplex_agriculture_mobile ON details_nexplex_agriculture_mobile.station_id=stations_nexplex_agriculture_mobile.id  JOIN nexplex_server on server_id=2 WHERE users_nexplex_agriculture_mobile.user_id="${userId}"`, (err,results) =>{

    // connection.query(`SELECT * FROM users_nexplex_agriculture_mobile  RIGHT JOIN stations_nexplex_agriculture_mobile ON users_nexplex_agriculture_mobile.station_id = stations_nexplex_agriculture_mobile.id   RIGHT JOIN details_nexplex_agriculture_mobile ON details_nexplex_agriculture_mobile.station_id=stations_nexplex_agriculture_mobile.id WHERE users_nexplex_agriculture_mobile.user_id="${userId}"`, (err,results) =>{

    // connection.query(`SELECT * FROM users_nexplex_agriculture_mobile  RIGHT JOIN stations_nexplex_agriculture_mobile ON users_nexplex_agriculture_mobile.station_id = stations_nexplex_agriculture_mobile.id  WHERE users_nexplex_agriculture_mobile.user_id="${userId}"`, (err,results) =>{

    // connection.query(`SELECT * FROM users_nexplex_agriculture_mobile WHERE id="${userId}"`, (err,results) =>{
    console.log(results)
    if(err) {
      console.log(err)
      res.status(200).send('error');
      return
    }
    else if(results.length>0){
      if (userId==results[0].user_id) {
        const user =results[0];
        // console.log(userData)
        // console.log(user)
        return res.status(200).json(user);
        // return res.send('heelo');
      } else {
        res.status(200).send('error');
        // res.status(500).send('invalid token');
      }
    }else{
      res.status(200).send('error');
      // res.status(500).send('invalid token');
    } 
    // if (userId==results[0].user_id) {
    //     const userData =req.user;
    //     // console.log(userData)
    //     return res.status(200).json(userData);
    //     // return res.send('heelo');
    //   } else {
    //     res.status(500).send('invalid token');
    //   }
    })
  }
);

module.exports = router