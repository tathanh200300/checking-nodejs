const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/upload/upload.controller");

router.post("/upload", uploadController.uploadFiles);
router.get("/files", uploadController.getListFiles);
router.get("/files/:name", uploadController.download);

module.exports = router;
