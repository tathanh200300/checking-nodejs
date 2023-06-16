const express = require("express");
const router = express.Router();

const jdController = require("../controllers/jd/jd.controller");

router.post("/create-jd", jdController.createJobDescription);

module.exports = router;
