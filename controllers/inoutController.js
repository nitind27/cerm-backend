const path = require("path");
const multer = require("multer");
const db = require("../config/db");

// Setup multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "aadhaar_other_files/");  // Folder should exist
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // or use unique name with timestamp
  },
});
const upload = multer({ storage: storage });

// GET all records
exports.getInOutRecords = (req, res) => {
  const sql = "SELECT * FROM in_out_new";
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error: true,
        code: 500,
        message: "Database query failed",
      });
    }
    return res.json({
      error: false,
      code: 200,
      data: results,
    });
  });
};

// POST insert record and upload files
exports.insertInOutRecord = (req, res) => {
  const io = req.app.get('io'); // Get socket.io instance

  upload.fields([{ name: "photo1", maxCount: 1 }, { name: "photo2", maxCount: 1 }])(req, res, (uploadErr) => {
    if (uploadErr) {
      return res.status(500).json({
        error: true,
        code: 500,
        message: "File upload error: " + uploadErr.message,
      });
    }

    try {
      const inOutRecord = req.body.in_out_record;
      if (!inOutRecord) {
        return res.status(400).json({
          error: true,
          code: 400,
          message: "in_out_record is required",
        });
      }

      const createdAt = new Date();

      const sql = "INSERT INTO in_out_new (in_out_record, created_at, updated_at) VALUES (?, ?, ?)";
      db.query(sql, [inOutRecord, createdAt, createdAt], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            error: true,
            code: 500,
            message: "Database insertion failed",
          });
        }

        // Notify all connected clients about the new record
        if (io) {
          io.emit('new_inout_record', {
            message: 'New In/Out record added!',
            data: {
              id: result.insertId,
              inOutRecord,
              createdAt
            }
          });
        }

        // Files saved by multer automatically to 'aadhaar_other_files' folder
        return res.json({
          error: false,
          code: 200,
          message: "Success",
          insertedId: result.insertId,
        });
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        error: true,
        code: 500,
        message: "Server error: " + e.message,
      });
    }
  });
};
