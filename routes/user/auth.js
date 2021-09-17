const express = require('express')
const router = express.Router()
const passport = require( 'passport' );
require( '../../config/passport' )( passport )

const jwt = require ( 'jsonwebtoken' );
const connection = require("../../config/database");

router.post('/login', 
passport.authenticate('local', { session: true}), //need to update from nuxt auth.
async function(req, res) {
  // console.log('here')
  const token = jwt.sign(req.user.id, 'JWT_SECRET_OR_KEY2');
  return res.json({ token });
});

router.get('/me',
  passport.authenticate(['jwt',], { session: false }),
  async function(req, res,) {
    // console.log(req.user)
    // console.log(req)
    const { userId } = req.user;
    // "SELECT * FROM users INNER JOIN topics ON users.id=topics.userID WHERE id = ?",
    // connection.query(`SELECT * FROM users INNER JOIN topics ON users.id=topics.userID WHERE id = "${userId}"`, (err,results) =>{
    connection.query(`SELECT id FROM nexplex_agriculture_users WHERE id="${userId}"`, (err,results) =>{
      if (userId==results[0].id) {
        const userData =req.user;
        // console.log(userData)
        return res.status(200).json(userData);
        // return res.send('heelo');
      } else {
        res.status(500).send('invalid token');
      }
    })
  }
);

module.exports = router