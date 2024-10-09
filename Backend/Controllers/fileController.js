const multer = require("multer");
const path = require("path");

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
const documentFileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "video/mp4",
    "video/webm",
    "video/x-msvideo",
    "video/mpeg",
    "audio/mpeg",
    "audio/ogg",
    "audio/wav",
    "audio/aac",
    "audio/webm",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Please upload an image, PDF, Word, or Excel document."
      ),
      false
    );
  }
};

const uploadDocument = multer({
  storage: storage,
  fileFilter: documentFileFilter,
}).single("file");

exports.uploadDocument = (req, res) => {
  uploadDocument(req, res, function (err) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: err.message });
    }
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "Please provide a document to upload." });
    }
    const filePath = req.file.path;
    res.status(200).json({
      message: "Document uploaded successfully",
      filePath: filePath,
    });
  });
};
