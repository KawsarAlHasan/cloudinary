const express = require("express");
const { postGittomEmail, checkEmailAndCode } = require("../controllers/gittom");
const router = express.Router();

router.post("/", postGittomEmail);
router.post("/check", checkEmailAndCode);

module.exports = router;
