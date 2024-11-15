const conn = require("./db"); 

const checkDbConnection = (req, res, next) => {
  if (!conn) {
    console.error("Database connection not established.");
    return res.status(500).send("Database connection error.");
  }
  conn.getConnection((err) => {
    if (err) {
      console.error("Error establishing database connection:", err);
      return res.status(500).send("Failed to connect to the database.");
    }
    console.log("Database connection successful.");
    next(); 
  });
};

module.exports = checkDbConnection;
