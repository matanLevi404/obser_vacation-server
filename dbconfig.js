const mysql = require("mysql");

const con = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE_NAME,
  timezone: "utc",
});

con.connect((err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Connected to mySql server");
});

const SQL = (q) => {
  return new Promise((resolve, reject) => {
    con.query(q, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = { SQL };
