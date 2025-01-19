const db = require("../config/db");

// upload pdf
exports.uploadPDF = async (req, res) => {
  try {
    const { name } = req.body;

    const filePath = req.file;
    let url = "";
    if (filePath) {
      url = `https://cloudinary.allbusinesssolution.com/public/uploads/${filePath.filename}`;
    }

    // Insert file into the database
    const [result] = await db.query(
      "INSERT INTO files (name, url) VALUES (?, ?)",
      [name || "", url]
    );

    // Check if the insertion was successful
    if (result.affectedRows === 0) {
      return res.status(500).send({
        success: false,
        message: "Failed to insert file, please try again",
      });
    }

    res.status(200).json({
      success: true,
      message: "Files uploaded successfully",
      fileId: result.insertId,
      url: url,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error uploading PDF",
      error: error.message,
    });
  }
};

// upload files
exports.uploadFiles = async (req, res) => {
  try {
    const { name } = req.body;

    const urls = [];
    for (const file of req.files) {
      const url = `https://cloudinary.allbusinesssolution.com/public/uploads/${file.filename}`;
      urls.push(url);

      // Insert each file into the database
      const [result] = await db.query(
        "INSERT INTO files (name, url) VALUES (?, ?)",
        [name || "", url]
      );

      // Check if the insertion was successful for each file
      if (result.affectedRows === 0) {
        return res.status(500).send({
          success: false,
          message: `Failed to insert file: ${file.originalname}`,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: "Files uploaded successfully",
      urls: urls,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error uploading Files",
      error: error.message,
    });
  }
};

// get all Files
exports.getAllFiles = async (req, res) => {
  try {
    const [data] = await db.query("SELECT * FROM files ORDER BY id DESC");
    if (!data || data.length == 0) {
      return res.status(200).send({
        success: true,
        message: "No Files found",
        result: data,
      });
    }

    res.status(200).send({
      success: true,
      message: "Get all Files",
      totalFiles: data.length,
      data,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Get All Files",
      error: error.message,
    });
  }
};

// get single Files
exports.getSingleFiles = async (req, res) => {
  try {
    const id = req.params.id;

    // Check if the files exists in the database
    const [files] = await db.query(`SELECT * FROM files WHERE id = ?`, [id]);

    // If files not found, return 404
    if (!files || files.length === 0) {
      return res.status(201).send({
        success: false,
        message: "files not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Get Single Files",
      data: files[0],
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Get All Files",
      error: error.message,
    });
  }
};

// update Files
exports.updateFiles = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const [filesPreData] = await db.query(`SELECT * FROM files WHERE id=?`, [
      id,
    ]);

    if (!filesPreData || filesPreData.length == 0) {
      return res.status(201).send({
        success: false,
        message: "files not found",
      });
    }

    const filePath = req.file;
    let url = filesPreData[0].url;
    if (filePath && filePath.path) {
      url = `http://cloudinary.allbusinesssolution.com/public/uploads/${filePath.filename}`;
    }

    // Execute the update query
    const [result] = await db.query(
      "UPDATE files SET name=?, url = ? WHERE id = ?",
      [name || filesPreData[0].name, url, id]
    );

    // Check if the files was updated successfully
    if (result.affectedRows === 0) {
      return res.status(201).send({
        success: false,
        message: "files not found or no changes made",
      });
    }

    // Success response
    res.status(200).send({
      success: true,
      message: "files updated successfully",
      url: url,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error updating files",
      error: error.message,
    });
  }
};

// delete Files
exports.deleteFiles = async (req, res) => {
  try {
    const id = req.params.id;

    // Check if the files exists in the database
    const [files] = await db.query(`SELECT * FROM files WHERE id = ?`, [id]);

    // If files not found, return 404
    if (!files || files.length === 0) {
      return res.status(201).send({
        success: false,
        message: "files not found",
      });
    }

    // Proceed to delete the files
    const [result] = await db.query(`DELETE FROM files WHERE id = ?`, [id]);

    // Check if deletion was successful
    if (result.affectedRows === 0) {
      return res.status(500).send({
        success: false,
        message: "Failed to delete files",
      });
    }

    // Send success response
    res.status(200).send({
      success: true,
      message: "files deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error deleting files",
      error: error.message,
    });
  }
};
