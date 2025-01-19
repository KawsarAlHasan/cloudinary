const express = require("express");
const { postGittomEmail } = require("../controllers/gittom");
const router = express.Router();

router.post("/", postGittomEmail);

module.exports = router;
