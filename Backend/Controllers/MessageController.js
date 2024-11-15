const conn = require("../db");

exports.getRoomMessages = async (req, res) => {
  console.log("Get Room Messages", req.body);
  try {
    const { roomId, role } = req.body;
    const query = `SELECT messageId, roomId, time, sender, seen, message, type, fileType, name, data , deleted
    FROM messages
    WHERE roomId = ? AND (owner = ? OR owner = 'both')
    ORDER BY createdAt ASC
  `;

    conn.query(query, [roomId, role], (err, result) => {
      if (err) {
        console.log("Error in getRoomMessages", err);
        return res.status(500).send("Error in getting Messages from room");
      }
      res.status(200).send({ data: result });
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve messages from room" });
  }
};

exports.saveMessage = async (req, res) => {
  console.log("Save Message", req.body);
  const message = req.body;
  try {
    const query = `insert into messages (messageId,roomid,time,sender,seen,message) values (?,?,?,?,?,?)`;
    const values = [
      message.messageId,
      message.roomId,
      message.time,
      message.sender,
      message.seen,
      message.message,
    ];
    conn.query(query, values, (err, result) => {
      if (err) {
        console.log("Error Query saving messages", err);
        return res.status(500).send("Error saving message");
      }
      //updateRoomLastMessage(message.message, message.roomId);
      return res.status(200).send("Message Saved");
    });
  } catch (error) {
    console.error("Error saving message:", error);
  }
};
exports.deleteMessage = (messageId, role) => {
  const selectQuery = `SELECT owner FROM Messages WHERE messageId = ?`;
  try {
    conn.query(selectQuery, [messageId], (err, rows) => {
      if (err) {
        console.error("Error fetching message:", err);
        return;
      }
      if (rows.length === 0) {
        console.log("No message found with the given messageId");
        return;
      }
      const currentOwner = rows[0].owner;
      if (currentOwner === "both") {
        const updateQuery = `UPDATE Messages SET owner = ? WHERE messageId = ?`;
        conn.query(updateQuery, [role, messageId], (err, result) => {
          if (err) {
            console.error("Error updating message:", err);
            return;
          }
        });
      } else {
        const deleteQuery = `DELETE FROM Messages WHERE messageId = ?`;
        conn.query(deleteQuery, [messageId], (err, result) => {
          if (err) {
            console.error("Error deleting message:", err);
            return;
          }
          if (result.affectedRows > 0) {
            console.log("Message deleted");
          } else {
            console.log("No message found to delete");
          }
        });
      }
    });
  } catch (error) {
    console.error("Unexpected error at deleteMessage:", error);
  }
};

exports.deleteForEveryOne = (messageId) => {
  const query = `Update Messages set message = ?,type = ? , deleted = true where messageId = ?`;
  try {
    conn.query(
      query,
      ["This message was deleted ", "text", messageId],
      (err, result) => {
        if (err) {
          console.error("Error deleting  message:", err);
          return;
        }
        if (result.affectedRows > 0) {
          console.log("Message Deleted");
        } else {
          console.log("No message found with the given messageId");
        }
      }
    );
  } catch (error) {
    console.error("Unexpected error at deleteMessage:", error);
  }
};

exports.updateMessageCount = async (roomId, readAll) => {
  let query;
  if (!readAll)
    query = ` UPDATE rooms SET newMessages = newMessages + 1 WHERE roomId = ?`;
  else query = `UPDATE rooms SET newMessages = 0 WHERE roomId = ?`;

  conn.query(query, [roomId], (err, result) => {
    if (err) {
      console.log(err);
      console.log("Database query failed");
    } else {
      console.log("Message Count Updated");
    }
  });
};
