const conn = require("./db");

//USers

exports.logIn = (req, res) => {
  console.log("Login");
  const { email, password } = req.body;

  try {
    const query = `SELECT * FROM users WHERE email = ? AND password = ? `;
    const values = [email, password];
    conn.query(query, values, (err, result) => {
      if (err) {
        console.log("Error in query", err);
        return res.status(500).send("DB error in Login");
      }
      console.log(result);
      if (result.length > 0) {
        console.log("1");
        return res.status(200).send({ data: result });
      } else {
        return res.status(404).send("No such User Exists");
      }
    });
  } catch (e) {
    res.status(500).json("Error");
  }
};
exports.signup = (req, res) => {
  console.log("SignUp");
  const { username, email, password } = req.body;

  try {
    const checkQuery = `SELECT * FROM users WHERE email = ?`;
    conn.query(checkQuery, [email], (err, result) => {
      if (err) {
        console.log("Error checking user", err);
        return res.status(500).json("Database Error");
      }
      if (result.length > 0) {
        res.status(400).send("Already Exists");
      } else {
        const insertQuery = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
        const values = [username, email, password];
        conn.query(insertQuery, values, (err, result) => {
          if (err) {
            console.log("Error inserting new user", err);
            return res.status(500).json("Database Error Inserting User");
          }
          console.log("SignUp Successful");
          res.status(200).send("User Inserted");
        });
      }
    });
  } catch (e) {
    console.log("Error", e);
    res.status(500).json("Error");
  }
};

exports.createRoom = async (req, res) => {
  console.log("create room", req.body);
  const { username } = req.body;
  console.log(username);
  if (!username) return res.status(500).send("No username received");
  const query = `INSERT into Rooms (username) VALUES (?)`;
  const values = [username];
  try {
    conn.query(query, values, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error occured in craete Room");
      }
      const insertedId = result.insertId;
      console.log("create room Inserted ID:", insertedId);
      return res.status(200).send({ roomId: insertedId });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error occured in craete Room");
  }
};

async function getUsernames(roomId) {
  const query = `SELECT username FROM rooms WHERE roomId = ?`;
  try {
    return new Promise((resolve, reject) => {
      conn.query(query, [roomId], (err, result) => {
        if (err) {
          console.log(err);
          reject("-1");
        } else if (result.length === 0) {
          resolve([]);
        } else {
          const usernames = result.map((user) => user.username);
          resolve(usernames);
          resolve(result);
        }
      });
    });
  } catch (e) {
    console.log(e);
    return "-1";
  }
}
exports.getRooms = async (req, res) => {
  console.log("Get rooms");
  try {
    const query = `SELECT * FROM rooms`;
    conn.query(query, async (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error getting rooms err");
      }
      return res.status(200).send({ data: result });
    });
  } catch (error) {
    return res.status(500).send("Error getting rooms");
  }
};

exports.getRoomIds = async () => {
  const query = `SELECT DISTINCT roomId FROM rooms`;
  return new Promise((resolve, reject) => {
    conn.query(query, (err, result) => {
      if (err) {
        console.log(err);
        reject(new Error("Database query failed"));
      } else {
        const roomIds = result.map((row) => row.roomId);
        resolve(roomIds);
      }
    });
  });
};

async function updateRoomLastMessage(message, roomId) {
  const query = `UPDATE Rooms SET lastMessage = ? WHERE roomId = ?`;
  const values = [message, roomId];

  try {
    conn.query(query, values, (err, result) => {
      if (err) {
        console.log("Error updating last message:", err);
        return;
      }
      if (result.affectedRows === 0) {
        console.log("No room to update Last Message");
      }

      console.log("Last message updated successfully");
    });
  } catch (error) {
    console.log("Error occurred updating Last message: ", error);
  }
}

exports.getUsernameOfRoom = async (req, res) => {
  console.log("Get Usernames");
  const roomId = req.body.roomId;
  try {
    const query = `SELECT username FROM CHATUSERS where roomId = ?`;
    conn.query(query, [roomId], (err, result) => {
      if (err) {
        console.log("Error getting roomUsers", err);
        return res.status(500).send("Error getting roomUsers");
      }
      return res.status(200).send({ data: result });
    });
  } catch (error) {
    console.error("Error getting roomUsers ", error);
  }
};

exports.getAllUsernames = async (req, res) => {
  console.log("Get All Usernames ");
  try {
    const query = `SELECT username FROM users`;
    conn.query(query, (err, result) => {
      if (err) {
        console.log("Error getting users", err);
        return res.status(500).send("Error getting users");
      }
      const usernames = result.map((user) => user.username);

      return res.status(200).send({ data: usernames });
    });
  } catch (error) {
    console.error("Error getting users ", error);
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
      updateRoomLastMessage(message.message, message.roomId);
      return res.status(200).send("Message Saved");
    });
  } catch (error) {
    console.error("Error saving message:", error);
  }
};

exports.saveFiles = async (message) => {
  try {
    console.log(message);

    const fileBuffer = Buffer.from(message.file.data.split(",")[1], "base64");
    const query = `INSERT INTO files (messageId,roomId, sender, seen, fileName,fileType, Type, Data, time)
   VALUES (?, ?, ?, ?, ?, ?, ?, ? ,?)`;
    const values = [
      message.messageId,
      message.roomId,
      message.sender,
      message.seen,
      message.file.name,
      message.file.type,
      message.type,
      fileBuffer,
      message.time,
    ];
    conn.query(query, values, (err, result) => {
      if (err) {
        console.error("Error inserting file into database: ", err);
        return;
      }
      console.log("File stored successfully");
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getFiles = async (req, res) => {
  const { roomId } = req.body;
  console.log("getFiles : ",roomId);
  try {
    const query = `
      SELECT messageId, roomId, time, sender, seen, fileName, fileType, Data, type
      FROM files
      WHERE roomId = ?
      ORDER BY createdAt DESC`;

    conn.query(query, [roomId], (err, results) => {
      if (err) {
        console.error("Error fetching files: ", err);
        return res.status(500).json({ message: "Error fetching files" });
      }

      const formattedFiles = results.map((file) => ({
        roomId: file.roomId,
        messageId: file.messageId,
        sender: file.sender,
        seen: file.seen,
        time: file.time,
        type: file.type,
        file: {
          type: file.fileType,
          name: file.fileName,
          data: `data:${file.fileType};base64,${Buffer.from(file.Data).toString('base64')}`
        },
      }));
      res.status(200).send({data:formattedFiles});
    });
  } catch (error) {
    console.error("Error occurred: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.saveMessageFromSocket = async (message) => {
  //console.log("Save Message in DB from Socket", message);
  try {
    const query = `insert into messages (messageId,roomid,time,sender,seen,message,type) values (?,?,?,?,?,?,?)`;
    const values = [
      message.messageId,
      message.roomId,
      message.time,
      message.sender,
      message.seen,
      message.message,
      "text",
    ];
    conn.query(query, values, (err, result) => {
      if (err) {
        console.log("Error Query saving messages", err);
      }
      updateRoomLastMessage(message.message, message.roomId);
    });
  } catch (error) {
    console.error("Error saving message:", error);
  }
};


exports.saveFileFromSocket = async (message) => {
  //console.log("Save File in DB from Socket", message);
  try {
    console.log("saving File: ");
    //const fileBuffer = Buffer.from(message.data, "base64");
    const query = `insert into messages (messageId,roomid,time,sender,seen,type,fileType,name,data) values (?,?,?,?,?,?,?,?,?)`;
    const values = [
      message.messageId,
      message.roomId,
      message.time,
      message.sender,
      message.seen,
      message.type,
      message.fileType,
      message.name,
      message.data,
    ];
    conn.query(query, values, (err, result) => {
      if (err) {
        console.log("Error Query saving messages", err);
      }
      //updateRoomLastMessage(message.message, message.roomId);
    });
  } catch (error) {
    console.error("Error saving message:", error);
  }
};

exports.getRoomMessages = async (req, res) => {
  console.log("Get Room Messages", req.body);
  try {
    const roomId = req.body.roomId;
    const query = `select messageId ,roomId, time, sender, seen, message, type,fileType,name,data from messages where roomId = ? ORDER BY createdAt ASC`;

    conn.query(query, [roomId], (err, result) => {
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

exports.updateSeen = (msgId) => {
  console.log("Update Seen", msgId);
  const query = `UPDATE messages SET seen = true WHERE messageId = ?`;
  try {
    conn.query(query, [msgId], (err, result) => {
      if (err) {
        console.log("Erro in Seen status Update", err);
      }

      if (result.affectedRows === 0) {
        console.log("Nothing to update");
      }

      console.log("Seen updated successfully");
    });
  } catch (error) {
    console.log("Error occurred updating Last message: ", error);
  }
};

exports.updateSeenForAll = (username, roomId) => {
  console.log("Update Seen for All", username);
  const query = `UPDATE messages SET seen = true WHERE sender != ? AND roomId = ?`;
  try {
    conn.query(query, [username, roomId], (err, result) => {
      if (err) {
        console.error("Error in updating Seen status for all", err);
      }
      if (result.affectedRows === 0) {
        console.log("No messages to update for !sender:", username);
      }
      console.log(
        "Seen status updated successfully for all messages except sender"
      );
    });
  } catch (error) {
    console.error(
      "Error occurred while updating seen status for all messages:",
      error
    );
  }
};

exports.getRoomsByUsername = async (req, res) => {
  const username = req.body.username;
  try {
    console.log("Room Ids : ", roomIds);
    const query = `SELECT roomId FROM rooms WHERE username = ? `;
    const values = [username];
    conn.query(query, values, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error in getRoomIdsBy Username");
      }
      res.status(200).send(result);
    });
  } catch (error) {
    console.error("Error fetching roomsIds:", error);
    res.status(500).send("Some Error Occured getRoomsByUsername");
  }
};



exports.getAllMessages = (req,res) => {

  try {
    const query = `select messageId ,roomId, time, sender, seen, message, type,fileType,name,data from messages ORDER BY createdAt ASC`;

    conn.query(query,  (err, result) => {
      if (err) {
        console.log("Error in getAllMessages", err);
        return res.status(500).send("Error in getting all Messages");
      }
      res.status(200).send({ data: result });
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve all Messages" });
  }


}