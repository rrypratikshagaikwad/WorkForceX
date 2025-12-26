const db = require("../config/db");
const moment = require("moment");
const sendSMS = require("../utils/sendSMS");
const PDFDocument = require("pdfkit");
//CHECK IN
// exports.checkIn = async (req, res) => {
//   const employee_id = req.user.user_id;

//   try {
//     const [existing] = await db.query(
//       `SELECT * FROM attendance 
//        WHERE employee_id = ? AND DATE(check_in_time) = CURDATE()`,
//       [employee_id]
//     );

//     if (existing.length > 0) {
//       return res.status(400).json({ message: "Already checked in today" });
//     }

//     const now = new Date();
//     const hour = now.getHours();
//     const minute = now.getMinutes();

//     let status = "PRESENT";

//     // 10:20 logic
//     if (hour === 10 && minute > 20 || hour === 11 && minute <= 0) {
//       status = "LATE";
//     }

//     // after 11:00
//     if (hour > 11 || (hour === 11 && minute > 0)) {
//       status = "HALF_DAY";
//     }

//     await db.query(
//       `INSERT INTO attendance (employee_id, check_in_time, attendance_status)
//        VALUES (?, NOW(), ?)`,
//       [employee_id, status]
//     );

//     //send SMS if late / half day
//     if (status !== "PRESENT") {
//       // sendSMS(employee_id, status);
//     }

//     res.json({
//       message: "Check-in successful",
//       status
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Check-in failed" });
//   }
// };

// exports.checkIn = async (req, res) => {
//   const employeeId = req.user.user_id;

//   const now = moment();
//   const lateTime = moment("10:20", "HH:mm");
//   const halfDayTime = moment("11:00", "HH:mm");

//   let status = "PRESENT";

//   if (now.isAfter(halfDayTime)) {
//     status = "HALF_DAY";
//   } else if (now.isAfter(lateTime)) {
//     status = "LATE";
//   }

//   try {
//     await db.query(
//       `INSERT INTO attendance (employee_id, check_in_time, attendance_status)
//        VALUES (?, NOW(), ?)`,
//       [employeeId, status]
//     );

//     // 📱 SMS only for LATE / HALF_DAY
//     if (status !== "PRESENT") {
//       sendSMS(
//         req.user.phone,
//         `You are marked ${status} today. Please contact HR if needed.`
//       );
//     }

//     res.json({ message: `Check-in successful (${status})` });

//   } catch (err) {
//     res.status(500).json({ message: "Check-in failed" });
//   }
// };
exports.checkIn = async (req, res) => {
  const userId = req.user.user_id;

  try {
    // 1️⃣ Get employee from user_id
    const [[employee]] = await db.query(
      `SELECT employee_id, phone, full_name
       FROM employee
       WHERE user_id = ?`,
      [userId]
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const now = moment();
    const lateTime = moment("10:20", "HH:mm");
    const halfDayTime = moment("11:00", "HH:mm");

    let status = "PRESENT";
    if (now.isAfter(halfDayTime)) status = "HALF_DAY";
    else if (now.isAfter(lateTime)) status = "LATE";

    // 2️⃣ Insert correct employee_id
    await db.query(
      `INSERT INTO attendance
       (employee_id, check_in_time, attendance_status)
       VALUES (?, NOW(), ?)`,
      [employee.employee_id, status]
    );

    // 3️⃣ Notify (SMS / Mail)
    if (status !== "PRESENT") {
      sendSMS(
        employee.phone,
        `Hi ${employee.full_name},
You are marked ${status} today.
- HR Team`
      );
    }

    res.json({ message: "Check-in successful", status });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Check-in failed" });
  }
};

//CHECK OUT
exports.checkOut = async (req, res) => {
  const employee_id = req.user.user_id;

  try {
    const [[attendance]] = await db.query(
      `SELECT attendance_id FROM attendance
       WHERE employee_id = ?
       AND DATE(check_in_time) = CURDATE()
       AND check_out_time IS NULL`,
      [employee_id]
    );

    if (!attendance) {
      return res.status(400).json({ message: "No active check-in found" });
    }

    await db.query(
      `UPDATE attendance
       SET check_out_time = NOW()
       WHERE attendance_id = ?`,
      [attendance.attendance_id]
    );

    res.json({ message: "Check-out successful" });
  } catch (err) {
    res.status(500).json({ message: "Check-out failed" });
  }
};


// GET TODAY STATUS
// exports.getAttendanceStatus = async (req, res) => {
//   const employeeId = req.user.user_id;

//   const [[row]] = await db.query(
//     `SELECT check_in_time, check_out_time
//      FROM attendance
//      WHERE employee_id = ?
//      AND DATE(check_in_time) = CURDATE()
//      LIMIT 1`,
//     [employeeId]
//   );

//   if (!row) {
//     return res.json({ status: "NOT_CHECKED_IN" });
//   }

//   if (row.check_out_time) {
//     return res.json({ status: "CHECKED_OUT" });
//   }

//   return res.json({ status: "CHECKED_IN" });
// };
exports.getAttendanceStatus = async (req, res) => {
  const userId = req.user.user_id;

  // 1️⃣ user_id → employee_id
  const [[employee]] = await db.query(
    `SELECT employee_id FROM employee WHERE user_id = ?`,
    [userId]
  );

  if (!employee) {
    return res.json({ status: "NOT_CHECKED_IN" });
  }

  // 2️⃣ today's attendance
  const [[row]] = await db.query(
    `SELECT check_in_time, check_out_time
     FROM attendance
     WHERE employee_id = ?
     AND DATE(check_in_time) = CURDATE()
     LIMIT 1`,
    [employee.employee_id]
  );

  if (!row) {
    return res.json({ status: "NOT_CHECKED_IN" });
  }

  if (row.check_out_time) {
    return res.json({ status: "CHECKED_OUT" });
  }

  return res.json({ status: "CHECKED_IN" });
};


// exports.getEmployeeAttendance = async (req, res) => {
//   const employeeId = req.user.user_id;
//  const [rows] = await db.query(
//   `SELECT 
//      DATE_FORMAT(check_in_time, '%Y-%m-%d') AS date,
//      TIME_FORMAT(check_in_time, '%H:%i') AS check_in,
//      TIME_FORMAT(check_out_time, '%H:%i') AS check_out,
//      attendance_status AS status
//    FROM attendance
//    WHERE employee_id = ?
//    ORDER BY check_in_time DESC`,
//   [employeeId]
// );


//   res.json(rows);
// };
exports.getEmployeeAttendance = async (req, res) => {
  const userId = req.user.user_id;

  const [[employee]] = await db.query(
    `SELECT employee_id FROM employee WHERE user_id = ?`,
    [userId]
  );

  const [rows] = await db.query(
    `SELECT 
      DATE_FORMAT(check_in_time,'%Y-%m-%d') AS date,
      TIME(check_in_time) AS check_in,
      TIME(check_out_time) AS check_out,
      attendance_status
     FROM attendance
     WHERE employee_id = ?
     ORDER BY check_in_time DESC`,
    [employee.employee_id]
  );

  res.json(rows);
};

exports.applyLeave = async (req, res) => {
  const userId = req.user.user_id;
  const { start_date, end_date, reason } = req.body;

  try {
    //Get employee_id using user_id
    const [[employee]] = await db.query(
      `SELECT employee_id FROM employee WHERE user_id = ?`,
      [userId]
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const employee_id = employee.employee_id;

    //Date validation
    if (moment(end_date).isBefore(start_date)) {
      return res.status(400).json({ message: "Invalid date range" });
    }

    //Insert leave request
    await db.query(
      `INSERT INTO leave_request 
       (employee_id, start_date, end_date, reason, status)
       VALUES (?, ?, ?, ?, 'PENDING')`,
      [employee_id, start_date, end_date, reason]
    );

    res.json({ message: "Leave request submitted" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to apply leave" });
  }
};


/**
 * EMPLOYEE VIEW OWN LEAVES
 */
exports.getMyLeaves = async (req, res) => {
  const userId = req.user.user_id;


  try {
    //Get employee_id from user_id
    const [[employee]] = await db.query(
      `SELECT employee_id FROM employee WHERE user_id = ?`,
      [userId]
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    //Fetch employee leaves
    const [rows] = await db.query(
      `SELECT 
        leave_id,
        start_date,
        end_date,
        reason,
        status
       FROM leave_request
       WHERE employee_id = ?
       ORDER BY applied_at DESC`,
      [employee.employee_id]
    );

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch leaves" });
  }
};

exports.getMonthlySummary = async (req, res) => {
  const userId = req.user.user_id;

  try {
    //Step 1: user_id → employee_id
    const [[employee]] = await db.query(
      `SELECT employee_id FROM employee WHERE user_id = ?`,
      [userId]
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    //Step 2: Current month range
    const startDate = moment().startOf("month").format("YYYY-MM-DD");
    const endDate = moment().endOf("month").format("YYYY-MM-DD");

    // Step 3: Fetch attendance
    const [rows] = await db.query(
      `
      SELECT 
        DATE_FORMAT(check_in_time , '%Y-%m-%d') AS date,
        attendance_status
      FROM attendance
      WHERE employee_id = ?
      AND DATE(check_in_time) BETWEEN ? AND ?
      `,
      [employee.employee_id, startDate, endDate]
    );

    //Step 4: Convert to chart format
    const map = {};

    rows.forEach(r => {
      if (!map[r.date]) {
        map[r.date] = { date: r.date, present: 0 };
      }

      // Count PRESENT + LATE + HALF_DAY as present
      if (["PRESENT", "LATE", "HALF_DAY"].includes(r.attendance_status)) {
        map[r.date].present = 1;
      }
    });

    const result = Object.values(map);

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load monthly summary" });
  }
};

exports.calculateSalary = async (req, res) => {
  const userId = req.user.user_id;
  const month = Number(req.query.month);
  const year = Number(req.query.year);

  if (!Number.isInteger(month) || !Number.isInteger(year)) {
    return res.status(400).json({ message: "Month and year are required" });
  }

  if (month < 1 || month > 12) {
    return res.status(400).json({ message: "Invalid month" });
  }

  try {
    // Get employee salary
    const [[employee]] = await db.query(
      `SELECT employee_id, monthly_salary
       FROM employee
       WHERE user_id = ?`,
      [userId]
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    //  Attendance summary
    const [[attendance]] = await db.query(
      `SELECT
        COALESCE(SUM(attendance_status IN ('PRESENT','LATE')), 0) AS present_days,
        COALESCE(SUM(attendance_status = 'HALF_DAY'), 0) AS half_days
       FROM attendance
       WHERE employee_id = ?
       AND MONTH(check_in_time) = ?
       AND YEAR(check_in_time) = ?`,
      [employee.employee_id, month, year]
    );

    const WORKING_DAYS = 30;

    const perDaySalary = employee.monthly_salary / WORKING_DAYS;

    const payableDays =
      attendance.present_days + attendance.half_days * 0.5;

    const absentDays = WORKING_DAYS - payableDays;

    const payableSalary = Number(
      (perDaySalary * payableDays).toFixed(2)
    );

    res.json({
      employee_id: employee.employee_id,
      month: `${year}-${String(month).padStart(2, "0")}`,
      monthly_salary: employee.monthly_salary,
      present_days: attendance.present_days,
      half_days: attendance.half_days,
      absent_days: absentDays,
      payable_salary: payableSalary
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Salary calculation failed" });
  }
};


exports.downloadPayslip = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const month = Number(req.query.month);
    const year = Number(req.query.year);

    if (!month || !year) {
      return res.status(400).json({ message: "Month & year required" });
    }

    // 1️⃣ Get employee
    const [[employee]] = await db.query(
      `SELECT employee_id, full_name, monthly_salary
       FROM employee
       WHERE user_id = ?`,
      [userId]
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // 2️⃣ Attendance summary
    const [[attendance]] = await db.query(
      `SELECT
        COALESCE(SUM(attendance_status IN ('PRESENT','LATE')),0) AS present_days,
        COALESCE(SUM(attendance_status='HALF_DAY'),0) AS half_days
       FROM attendance
       WHERE employee_id = ?
       AND MONTH(check_in_time) = ?
       AND YEAR(check_in_time) = ?`,
      [employee.employee_id, month, year]
    );

    const WORKING_DAYS = 30;
    const perDaySalary = employee.monthly_salary / WORKING_DAYS;
    const payableDays =
      attendance.present_days + attendance.half_days * 0.5;
    const netPay = (perDaySalary * payableDays).toFixed(2);

    // 3️⃣ PDF
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=payslip-${month}-${year}.pdf`
    );

    doc.pipe(res);

    // ===== PDF CONTENT =====
    doc.fontSize(20).text("EMPLOYEE PAYSLIP", { align: "center" });
    doc.moveDown(2);

    doc.fontSize(12);
    doc.text(`Employee Name : ${employee.full_name}`);
    doc.text(`Employee ID   : ${employee.employee_id}`);
    doc.text(`Month         : ${month}-${year}`);
    doc.moveDown();

    doc.text(`Monthly Salary : ₹ ${employee.monthly_salary}`);
    doc.text(`Present Days   : ${attendance.present_days}`);
    doc.text(`Half Days      : ${attendance.half_days}`);
    doc.moveDown();

    doc.fontSize(14).text(`Net Pay : ₹ ${netPay}`, {
      underline: true
    });

    doc.end(); // ⚠️ VERY IMPORTANT

  } catch (err) {
    console.error("Payslip error:", err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Payslip generation failed" });
    }
  }
};

