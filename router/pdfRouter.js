const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  uploadPDF,
  getAllFiles,
  getSingleFiles,
  updateFiles,
  deleteFiles,
  uploadFiles,
} = require("../controllers/pdfController");

router.post("/upload", upload.single("pdf"), uploadPDF);
router.post("/uploads", upload.array("pdfs", 10), uploadFiles);
router.get("/all", getAllFiles);
router.get("/:id", getSingleFiles);
router.put("/update/:id", upload.single("pdf"), updateFiles);
router.delete("/delete/:id", deleteFiles);

module.exports = router;
