const express = require("express");
const router = express.Router();
const { insertInOutRecord, getInOutRecords } = require("../controllers/inoutController");

// POST route (insert + upload)
router.post("/", insertInOutRecord);

// GET route (fetch all)
router.get("/", getInOutRecords);

module.exports = router;
