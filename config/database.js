const mysql = require("mysql");

// const connection = mysql.createPool ({
//   host: "localhost",
//   user: "root",
//   password: "password",
//   database: "nexplex_agriculture",
//   port: 3306,
// });
const connection = mysql.createPool ({
  host: "zr.airmode.live",
  user: "root",
  password: "c1vG7R34",
  database: "nexplex_agriculture",
  port: 3306,
});

module.exports = connection;