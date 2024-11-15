const express = require("express");
const router = express.Router();
const controller = require("./Controllers/controller");
const fileController = require("./Controllers/fileController");
const fileHandler = require('./Controllers/fileHandler');
const messageController = require('./Controllers/MessageController');

const middleware = require('./middleware');

router.use(express.json());

//Users
router.post("/login",controller.logIn);
router.post("/signup", controller.signup);


//Chat Room

router.post("/createroom",controller.createRoom);
router.post("/checkroom",controller.checkRoomExists);
router.get("/getrooms",controller.getRooms);

router.post("/getmessages", messageController.getRoomMessages);
router.post("/getfiles",controller.getFiles);
router.get("/getroomusers",controller.getUsernameOfRoom);
router.post("/savemessage", messageController.saveMessage);
router.post("/updateseen",controller.updateSeen);

router.get("/getallmessages",controller.getAllMessages);

router.get("/getallusers",controller.getAllUsernames);

router.post("/uploadfile",fileController.uploadDocument);

router.post("/uploadfiles",fileHandler.uploadFile);




module.exports = router;
