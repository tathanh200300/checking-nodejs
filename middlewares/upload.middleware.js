const util = require("util");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

var storage = new GridFsStorage({
  url: process.env.MONGODB,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${file.originalname}`;
      return filename;
    }

    return {
      bucketName: process.env.IMAGE_BUCKET,
      filename: `${file.originalname}`,
      _id: `${file._id}`,
      // bucketName: `${file.bucketName}`,
    };
  },
});

var uploadFiles = multer({ storage: storage }).single("file");
var uploadFilesMiddleware = util.promisify(async (req, res) => {
  try {
    await uploadFiles(req, res);
    // Access the uploaded file object to get bucketName and _id
    const { bucketName, _id } = req.file;
    return { bucketName, _id };
  } catch (error) {
    // Handle any errors that occurred during file upload
    console.error(error);
    throw error;
  }
});
module.exports = uploadFilesMiddleware;
