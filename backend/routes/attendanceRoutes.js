const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/checkin", authMiddleware, attendanceController.checkIn);
router.post("/checkout", authMiddleware, attendanceController.checkOut);
router.get("/today", authMiddleware, attendanceController.getAttendanceStatus);
router.get("/employee", authMiddleware, attendanceController.getEmployeeAttendance);
// Leaves
router.post("/apply", authMiddleware, attendanceController.applyLeave);
router.get("/my-leaves", authMiddleware, attendanceController.getMyLeaves);
router.get("/monthly-summary", authMiddleware, attendanceController.getMonthlySummary);
router.get("/salary/my-summary", authMiddleware, attendanceController.calculateSalary);
router.get("/salary/payslip", authMiddleware, attendanceController.downloadPayslip);


module.exports = router;
