
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const adminController = require("../controllers/adminController");


router.post("/add-employee",authMiddleware,adminMiddleware,adminController.addEmployee);
router.get("/employees",authMiddleware,adminMiddleware,adminController.getAllEmployees);
router.get("/employees/:id", authMiddleware, adminMiddleware, adminController.getEmployeeById);
router.put("/employees/:id", authMiddleware, adminMiddleware, adminController.updateEmployee);
router.put("/employee/:id/deactivate",authMiddleware,adminMiddleware,adminController.deactivateEmployee
);


//admin dashboard
router.get("/dashboard/kpis", authMiddleware, adminMiddleware, adminController.getKPIs);
router.get("/dashboard/weekly-attendance", authMiddleware, adminMiddleware, adminController.getWeeklyAttendance);
router.get("/dashboard/today-status", authMiddleware, adminMiddleware, adminController.getTodayStatus);
router.get("/dashboard/department-wise", authMiddleware, adminMiddleware, adminController.getDepartmentWise);
router.get("/attendance-report",authMiddleware,adminMiddleware,adminController.getAttendanceReport);

//Leaves
router.get("/all", authMiddleware, adminMiddleware, adminController.getAllLeaves);
router.put("/:id/status", authMiddleware, adminMiddleware, adminController.updateLeaveStatus);

//salary
router.get("/salary-report", authMiddleware, adminController.adminSalaryReport);
router.post("/approve-salary",authMiddleware,adminMiddleware,adminController.approveSalary);
router.get("/payslip",authMiddleware,adminMiddleware,adminController.downloadAdminPayslip
);


// // OFFICE REPORTS
// router.get("/offices", adminController.getOffices);
// router.get("/office-attendance",adminController.getOfficeAttendanceReport);
// router.get("/office-summary",adminController.getMonthlyOfficeSummary);

module.exports = router;
