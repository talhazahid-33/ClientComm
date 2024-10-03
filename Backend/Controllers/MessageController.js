const conn = require("../db");
exports.deleteMessage = (messageId) => {
  const query = `DELETE from messages where messageId = ?`;
  try {
    conn.query(query, [messageId], (err, result) => {
      if (err) {
        console.error("Error deleting message:", err);
        return;
      }
      if (result.affectedRows > 0) {
        console.log("Message Deleted");
      } else {
        console.log("No message found with the given messageId");
      }
    });
  } catch (error) {
    console.error("Unexpected error at deleteMessage:", error);
  }
};

exports.deleteForEveryOne = (messageId) => {
  const query = `Update Messages set message = ?,type = ? where messageId = ?`;
  try {
    conn.query(query, [messageId,"This message was deleted " ,"text"], (err, result) => {
      if (err) {
        console.error("Error deleting  message:", err);
        return;
      }
      if (result.affectedRows > 0) {
        console.log("Message Deleted");
      } else {
        console.log("No message found with the given messageId");
      }
    });
  } catch (error) {
    console.error("Unexpected error at deleteMessage:", error);
  }
};
