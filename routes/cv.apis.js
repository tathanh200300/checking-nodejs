const express = require("express");
const router = express.Router();

const cvController = require("../controllers/cv/cv.controller");

router.post("/create-cv", cvController.createCurriculumVitae);

module.exports = router;
