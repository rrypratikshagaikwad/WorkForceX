const db = require("../config/db");
const moment = require("moment");
const sendSMS = require("../utils/sendSMS");
const { getDistanceInMeters } = require("../utils/locationUtils");
const PDFDocument = require("pdfkit");
const { registerFace } = require("../utils/faceApi");
const { verifyFace } = require("../utils/faceApi");
const { detectLocation } = require("../utils/officeDetector");

// exports.checkIn = async (req, res) => {
//   try {
//     const userId = req.user.user_id;
//     const { faceImage, latitude, longitude } = req.body;

//     /* -------------------- 1️⃣ Validate input -------------------- */
//     if (!faceImage || latitude === undefined || longitude === undefined) {
//       return res.status(400).json({
//         message: "Face image and location are required"
//       });
//     }

//     /* -------------------- 2️⃣ Office location check -------------------- */
//     const officeLat = Number(process.env.OFFICE_LATITUDE);
//     const officeLng = Number(process.env.OFFICE_LONGITUDE);
//     const officeRadius = Number(process.env.OFFICE_RADIUS_METERS);

//     const gpsDistance = getDistanceInMeters(
//       officeLat,
//       officeLng,
//       latitude,
//       longitude
//     );
// console.log( gpsDistance, "meters");
    

//     if (gpsDistance > officeRadius) {
//       return res.status(403).json({
//         message: "You are outside office location",
//         distance: gpsDistance.toFixed(2)
//       });
//     }

//     /* -------------------- 3️⃣ Get employee -------------------- */
//     const [[employee]] = await db.query(
//       `SELECT employee_id, face_embedding, face_registered
//        FROM employee WHERE user_id = ?`,
//       [userId]
//     );

//     if (!employee || !employee.face_registered) {
//       return res.status(403).json({
//         message: "Face not registered"
//       });
//     }

//     /* -------------------- 4️⃣ Already checked in? -------------------- */
//     const [existing] = await db.query(
//       `SELECT attendance_id
//        FROM attendance
//        WHERE employee_id = ?
//        AND DATE(check_in_time) = CURDATE()`,
//       [employee.employee_id]
//     );

//     if (existing.length > 0) {
//       return res.status(400).json({
//         message: "Already checked in today"
//       });
//     }

//     /* -------------------- 5️⃣ Face matching (Python API) -------------------- */

// const storedEmbedding = JSON.parse(employee.face_embedding);

// const faceResult = await verifyFace(faceImage, storedEmbedding);

// if (!faceResult.matched) {
//   return res.status(403).json({
//     message: "Face verification failed"
//   });
// }

// const faceDistance = faceResult.distance;


//     /* -------------------- 6️⃣ Attendance Status Logic -------------------- */
//     const now = new Date();
//     const hour = now.getHours();
//     const minute = now.getMinutes();

//     let attendanceStatus = "PRESENT";

//     if ((hour === 10 && minute > 20) || (hour === 11 && minute === 0)) {
//       attendanceStatus = "LATE";
//     }

//     if (hour > 11 || (hour === 11 && minute > 0)) {
//       attendanceStatus = "HALF_DAY";
//     }

//     /* -------------------- 7️⃣ Insert attendance -------------------- */
//     await db.query(
//       `INSERT INTO attendance
//        (employee_id, check_in_time, attendance_status,
//         gps_latitude, gps_longitude, check_in_photo_url)
//        VALUES (?, NOW(), ?, ?, ?, ?)`,
//       [
//         employee.employee_id,
//         attendanceStatus,
//         latitude,
//         longitude,
//         faceImage
//       ]
//     );

//     res.json({
//       message: "Check-in successful",
//       attendance_status: attendanceStatus,
//       gps_distance: gpsDistance.toFixed(2),
//       face_distance: faceDistance.toFixed(4)
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Check-in failed" });
//   }
// };

//CHECK OUT


exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.user_id;
    console.log("JWT user_id:", req.user.user_id);

    const { faceImage, latitude, longitude } = req.body;

    if (!faceImage || latitude == null || longitude == null) {
      return res.status(400).json({ message: "Face & location required" });
    }

    // 1️⃣ Employee
    // const [[employee]] = await db.query(
    //   `SELECT employee_id, face_embedding, face_registered
    //    FROM employee WHERE user_id = ?`,
    //   [userId]
    // );
    const [[employee]] = await db.query(`
      SELECT 
        e.employee_id,
        e.face_embedding,
        e.face_registered,
        d.is_roaming
      FROM employee e
      JOIN department d ON e.department_id = d.department_id
      WHERE e.user_id = ?
    `, [userId]);

    if (!employee || !employee.face_registered) {
      return res.status(403).json({ message: "Face not registered" });
    }

    // 2️⃣ All active locations
    const [locations] = await db.query(
      `SELECT location_id, name, type, latitude, longitude, radius_meters
       FROM location WHERE status='active'`
    );

    // 3️⃣ Detect office/plant
    let location = detectLocation(latitude, longitude, locations);
// console.log(location,"----");
    // if (!location) {
    //   return res.status(403).json({
    //     message: "You are not inside any office or plant location"
    //   });
    // }
    if (!location) {
    if (employee.is_roaming === 1) {
      location = {
        location_id: null,
        name: "ROAMING",
        type: "ROAMING",
        distance: 0
      };
    } else {
      return res.status(403).json({
        message: "You are not inside any office location"
      });
    }
  }

    // 4️⃣ Already checked in?
    // const [[existing]] = await db.query(
    //   `SELECT attendance_id FROM attendance
    //    WHERE employee_id = ?
    //    AND DATE(check_in_time) = CURDATE()`,
    //   [employee.employee_id]
    // );
const [[existing]] = await db.query(
  `SELECT attendance_id FROM attendance
   WHERE employee_id = ?
   AND attendance_date = CURDATE()`,
  [employee.employee_id]
);
    if (existing) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    // 5️⃣ Face verify
    const storedEmbedding = JSON.parse(employee.face_embedding);
    const faceResult = await verifyFace(faceImage, storedEmbedding);

    if (!faceResult.matched) {
      return res.status(403).json({ message: "Face verification failed" });
    }

    // 6️⃣ Status logic
    const now = new Date();
    const hour = now.getHours();
    let status = "PRESENT";
    if (hour >= 11) status = "HALF_DAY";
    else if (hour > 10) status = "LATE";

    // 7️⃣ Insert attendance
    // await db.query(
    //   `INSERT INTO attendance
    //    (employee_id, location_id, check_in_time,
    //     attendance_status, gps_latitude, gps_longitude,
    //     check_in_photo_url)
    //    VALUES (?, ?, NOW(), ?, ?, ?, ?)`,
    //   [
    //     employee.employee_id,
    //     location.location_id,
    //     status,
    //     latitude,
    //     longitude,
    //     faceImage
    //   ]
    // );
await db.query(
  `INSERT INTO attendance
   (employee_id, location_id, attendance_date,
    check_in_time, attendance_status,
    gps_latitude, gps_longitude, check_in_photo_url)
   VALUES (?, ?, CURDATE(), NOW(), ?, ?, ?, ?)`,
  [
    employee.employee_id,
    location.location_id,
    status,
    latitude,
    longitude,
    faceImage
  ]
);

    res.json({
      message: "Check-in successful",
      location: location.name,
      location_type: location.type,
      attendance_status: status,
      gps_distance: location.distance.toFixed(2)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Check-in failed" });
  }
};





// exports.checkOut = async (req, res) => {
//   try {
//     const userId = req.user.user_id;
//     const { faceImage, latitude, longitude } = req.body;

//     if (!faceImage || latitude === undefined || longitude === undefined) {
//       return res.status(400).json({ message: "Face & location required" });
//     }

//     const officeLat = Number(process.env.OFFICE_LATITUDE);
//     const officeLng = Number(process.env.OFFICE_LONGITUDE);
//     const officeRadius = Number(process.env.OFFICE_RADIUS_METERS);

//     const gpsDistance = getDistanceInMeters(
//       officeLat,
//       officeLng,
//       latitude,
//       longitude
//     );

//     if (gpsDistance > officeRadius) {
//       return res.status(403).json({
//         message: "You are outside office location"
//       });
//     }
//     // get employee
//     const [[employee]] = await db.query(
//       `SELECT employee_id, face_embedding
//        FROM employee WHERE user_id = ?`,
//       [userId]
//     );

//     /* -------------------- Face verification (Python API) -------------------- */

// const storedEmbedding = JSON.parse(employee.face_embedding);

// const faceResult = await verifyFace(faceImage, storedEmbedding);

// if (!faceResult.matched) {
//   return res.status(403).json({
//     message: "Face verification failed"
//   });
// }


//     // update attendance
//     await db.query(
//       `UPDATE attendance
//        SET check_out_time = NOW(),
//            check_out_photo_url = ?,
//            gps_latitude = ?,
//            gps_longitude = ?
//        WHERE employee_id = ?
//        AND DATE(check_in_time) = CURDATE()`,
//       [faceImage, latitude, longitude, employee.employee_id]
//     );

//     res.json({ message: "Check-out successful" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Check-out failed" });
//   }
// };


// exports.checkOut = async (req, res) => {
//   try {
//     const userId = req.user.user_id;
//     const { faceImage, latitude, longitude } = req.body;

//     if (!faceImage || latitude == null || longitude == null) {
//       return res.status(400).json({ message: "Face & location required" });
//     }

//     const [[employee]] = await db.query(
//       `SELECT employee_id, face_embedding
//        FROM employee WHERE user_id = ?`,
//       [userId]
//     );

//     const [[attendance]] = await db.query(
//       `SELECT attendance_id, location_id, check_out_time
//        FROM attendance
//        WHERE employee_id = ?
//        AND DATE(check_in_time) = CURDATE()`,
//       [employee.employee_id]
//     );

//     if (!attendance) {
//       return res.status(400).json({ message: "No check-in today" });
//     }

//     if (attendance.check_out_time) {
//       return res.status(400).json({ message: "Already checked out" });
//     }

//     // detect location
//     const [locations] = await db.query(
//       `SELECT * FROM location WHERE status='active'`
//     );

//     const location = detectLocation(latitude, longitude, locations);

//     if (!location || location.location_id !== attendance.location_id) {
//       return res.status(403).json({
//         message: "Check-out must be from same location"
//       });
//     }

//     // face verify
//     const faceResult = await verifyFace(
//       faceImage,
//       JSON.parse(employee.face_embedding)
//     );

//     if (!faceResult.matched) {
//       return res.status(403).json({ message: "Face verification failed" });
//     }

//     await db.query(
//       `UPDATE attendance
//        SET check_out_time = NOW(),
//            check_out_photo_url = ?,
//            gps_latitude = ?,
//            gps_longitude = ?
//        WHERE attendance_id = ?`,
//       [faceImage, latitude, longitude, attendance.attendance_id]
//     );

//     res.json({ message: "Check-out successful" });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Check-out failed" });
//   }
// };

exports.checkOut = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { faceImage, latitude, longitude } = req.body;

    if (!faceImage || latitude == null || longitude == null) {
      return res.status(400).json({ message: "Face & location required" });
    }

    // 1️⃣ Employee + shift
    const [[employee]] = await db.query(
    `SELECT 
      e.employee_id,
      e.face_embedding,
      IFNULL(s.full_day_hours, 8) AS full_day_hours,
      IFNULL(s.half_day_hours, 4) AS half_day_hours,
      IFNULL(s.ot_allowed, 0) AS ot_allowed
    FROM employee e
    LEFT JOIN shift s ON e.shift_id = s.shift_id
    WHERE e.user_id = ?`,
    [userId]
  );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // 2️⃣ Today's attendance
    // const [[attendance]] = await db.query(
    //   `SELECT attendance_id, location_id, check_in_time, check_out_time
    //    FROM attendance
    //    WHERE employee_id = ?
    //    AND DATE(check_in_time) = CURDATE()`,
    //   [employee.employee_id]
    // );
const [[attendance]] = await db.query(
  `SELECT attendance_id, location_id, check_in_time, check_out_time
   FROM attendance
   WHERE employee_id = ?
   AND attendance_date = CURDATE()`,
  [employee.employee_id]
);

    if (!attendance) {
      return res.status(400).json({ message: "No check-in today" });
    }

    if (attendance.check_out_time) {
      return res.status(400).json({ message: "Already checked out" });
    }

    // 3️⃣ Detect location
    const [locations] = await db.query(
      `SELECT * FROM location WHERE status='active'`
    );

    let location = detectLocation(latitude, longitude, locations);

    // if (!location || location.location_id !== attendance.location_id) {
    //   return res.status(403).json({
    //     message: "Check-out must be from same location"
    //   });
    // }
    // If attendance was from fixed location → enforce same location
    if (attendance.location_id !== null) {
      if (!location || location.location_id !== attendance.location_id) {
        return res.status(403).json({
          message: "Check-out must be from same location"
        });
      }
    }
// If location_id IS NULL → roaming → allow checkout anywhere

    // 4️⃣ Face verification
    const faceResult = await verifyFace(
      faceImage,
      JSON.parse(employee.face_embedding)
    );

    if (!faceResult.matched) {
      return res.status(403).json({ message: "Face verification failed" });
    }

    // 5️⃣ Work hour calculation
    const checkInTime = new Date(attendance.check_in_time);
    const checkOutTime = new Date();

    const workHours =
      (checkOutTime - checkInTime) / (1000 * 60 * 60);

    // 6️⃣ Attendance status
    let status = "ABSENT";

    if (workHours >= employee.full_day_hours) {
      status = "PRESENT";
    } else if (workHours >= employee.half_day_hours) {
      status = "HALF_DAY";
    }

    // 7️⃣ Overtime
    let overtimeHours = 0;
    if (employee.ot_allowed && workHours > employee.full_day_hours) {
      overtimeHours = workHours - employee.full_day_hours;
    }

    // 8️⃣ Update attendance
    await db.query(
      `UPDATE attendance
       SET check_out_time = NOW(),
           attendance_status = ?,
           working_hours = ?,
           overtime_hours = ?,
           check_out_photo_url = ?,
           gps_latitude = ?,
           gps_longitude = ?
       WHERE attendance_id = ?`,
      [
        status,
        workHours.toFixed(2),
        overtimeHours.toFixed(2),
        faceImage,
        latitude,
        longitude,
        attendance.attendance_id
      ]
    );

    res.json({
      message: "Check-out successful",
      attendance_status: status,
      work_hours: workHours.toFixed(2),
      overtime_hours: overtimeHours.toFixed(2)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Check-out failed" });
  }
};



exports.registerFace = async (req, res) => {
  const userId = req.user.user_id;
  const { faceImage } = req.body;

  const result = await registerFace(faceImage);

  if (!result.embedding) {
    return res.status(400).json({ message: "Face not detected" });
  }

  await db.query(
    `UPDATE employee
     SET face_embedding = ?, face_registered = true
     WHERE user_id = ?`,
    [JSON.stringify(result.embedding), userId]
  );

  res.json({ message: "Face registered successfully" });
};

// exports.getAttendanceStatus = async (req, res) => {
//   const userId = req.user.user_id;

//   // 1️⃣ user_id → employee_id
//   const [[employee]] = await db.query(
//     `SELECT employee_id FROM employee WHERE user_id = ?`,
//     [userId]
//   );

//   if (!employee) {
//     return res.json({ status: "NOT_CHECKED_IN" });
//   }

//   // 2️⃣ today's attendance
//   const [[row]] = await db.query(
//     `SELECT check_in_time, check_out_time
//      FROM attendance
//      WHERE employee_id = ?
//      AND DATE(check_in_time) = CURDATE()
//      LIMIT 1`,
//     [employee.employee_id]
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
  try {
    // 🔐 Safety check
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.user_id;

    // 1️⃣ user_id → employee_id
    const [[employee]] = await db.query(
      `SELECT employee_id FROM employee WHERE user_id = ?`,
      [userId]
    );

    if (!employee) {
      return res.json({ status: "NOT_CHECKED_IN" });
    }

    // 2️⃣ today's attendance (USE attendance_date)
    const [[row]] = await db.query(
      `SELECT check_in_time, check_out_time
       FROM attendance
       WHERE employee_id = ?
       AND attendance_date = CURDATE()
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

  } catch (err) {
    console.error("getAttendanceStatus error:", err);
    res.status(500).json({ message: "Failed to fetch attendance status" });
  }
};


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
    DATE(start_date) AS start_date,
    DATE(end_date) AS end_date,
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

