const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const exportController = require("../controllers/exportController");

router.get("/attendance/excel", auth, adminOnly, exportController.exportAttendanceExcel);
router.get("/attendance/pdf", auth, adminOnly, exportController.exportAttendancePDF);

module.exports = router;
