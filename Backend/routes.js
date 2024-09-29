const express = require("express");
const router = express.Router();
const controller = require("./controller");
const fileController = require("./fileController");
const fileHandler = require('./fileHandler');
router.use(express.json());

//Users
router.post("/login",controller.logIn);
router.post("/signup", controller.signup);


//Chat Room

router.post("/createroom",controller.createRoom);
router.get("/getrooms",controller.getRooms);

router.post("/getmessages", controller.getRoomMessages);
router.post("/getfiles",controller.getFiles);
router.get("/getroomusers",controller.getUsernameOfRoom);
router.post("/savemessage", controller.saveMessage);
router.post("/updateseen",controller.updateSeen);

router.get("/getallmessages",controller.getAllMessages);

router.get("/getallusers",controller.getAllUsernames);

router.post("/uploadimage",fileController.uploadDocument);

router.post("/uploadimages",fileHandler.uploadFile);


module.exports = router;
