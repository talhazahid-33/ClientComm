const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
}).single("file");

const base64ToMulterMiddleware = (req, res, next) => {
  try {
    const base64File = req.body.file;
    if (!base64File) {
      return res
        .status(400)
        .json({ error: "Please provide base64 file data." });
    }

    const matches = base64File.match(
      /^data:(application\/\w+|image\/\w+|text\/\w+|video\/\w+|audio\/\w+);base64,(.+)$/
    );
    
    
    if (!matches || matches.length !== 3) {
    console.log(1);
      return res.status(400).json({ error: "Invalid base64 file data." });
    }
    console.log(2);
    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");
    const fileExtension = mimeType.split("/")[1];
    const fileName = `file-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}.${fileExtension}`;
    const tempPath = path.join("./Uploads", fileName);

    fs.writeFileSync(tempPath, buffer);
    req.file = {
      fieldname: "file",
      originalname: fileName,
      mimetype: mimeType,
      path: tempPath,
      buffer: buffer,
    };
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to process base64 file." });
  }
};

exports.uploadFile = (req, res) => {
  console.log("Upload Files ",req.body);
  base64ToMulterMiddleware(req, res, () => {
    upload(req, res, function (err) {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
      }
      if (!req.file) {
        return res.status(400).json({ error: "Failed to upload file." });
      }
      res.status(200).json({
        message: "File uploaded successfully",
        filePath: req.file.path.replace(/\\/g, "/"),
      });
    });
  });
};