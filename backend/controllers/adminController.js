const db = require("../config/db");
const bcrypt = require("bcrypt");
const PDFDocument = require("pdfkit");

// exports.addEmployee = async (req, res) => {
//   const {
//     full_name,
//     email,
//     password,
//     designation,
//     department,
//     phone,
//     work_location,
//     joining_date,
//     employee_type,
//     shift_hours
//   } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);

//     //Insert into user table
//     const [userResult] = await db.query(
//       "INSERT INTO user (name,email, password,phone, role) VALUES (?,?,?,?, 'employee')",
//       [full_name,email, hashedPassword,phone]
//     );

//     const userId = userResult.insertId;

//     //Insert into employee table
//     await db.query(
//   `INSERT INTO employee
//    (user_id, full_name, designation, department, phone, work_location, joining_date, status, employee_type, shift_hours)
//    VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)`,
//   [
//     userId,
//     full_name,
//     designation,
//     department,
//     phone,
//     work_location,
//     joining_date,
//     employee_type,
//     shift_hours
//   ]
// );


//     res.json({ message: "Employee added successfully" });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.sqlMessage || "Failed to add employee" });
//   }
// };
exports.addEmployee = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const {
      full_name,
      email,
      password,
      designation,
      department,
      phone,
      work_location,
      joining_date,
      employee_type,
      shift_hours,
      blood_group,
      permanent_address,
      reference_contacts
    } = req.body;

    // 1️⃣ Check duplicate email
    const [[existing]] = await connection.query(
      "SELECT user_id FROM user WHERE email = ?",
      [email]
    );

    if (existing) {
      await connection.rollback();
      return res.status(400).json({ message: "Email already exists" });
    }

    // 2️⃣ Create user
    const hashedPassword = await bcrypt.hash(password, 10);

    const [userResult] = await connection.query(
      `INSERT INTO user (name, email, password, phone, role)
       VALUES (?, ?, ?, ?, 'employee')`,
      [full_name, email, hashedPassword, phone]
    );

    const userId = userResult.insertId;

    // 3️⃣ Create employee ✅ employeeId DEFINED HERE
    const [employeeResult] = await connection.query(
      `INSERT INTO employee
       (user_id, full_name, designation, department, phone,
        work_location, joining_date, status,
        employee_type, shift_hours, blood_group, permanent_address)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?, ?)`,
      [
        userId,
        full_name,
        designation,
        department,
        phone,
        work_location,
        joining_date,
        employee_type,
        shift_hours,
        blood_group,
        permanent_address
      ]
    );

    const employeeId = employeeResult.insertId; // ✅ INITIALIZED HERE

    // 4️⃣ Insert reference contacts (AFTER employeeId exists)
    if (Array.isArray(reference_contacts)) {
      for (const ref of reference_contacts) {
        if (ref.name && ref.phone) {
          await connection.query(
            `INSERT INTO employee_reference
             (employee_id, name, phone, address, relation)
             VALUES (?, ?, ?, ?, ?)`,
            [
              employeeId,
              ref.name,
              ref.phone,
              ref.address,
              ref.relation
            ]
          );
        }
      }
    }

    await connection.commit();
    res.json({ message: "Employee added successfully" });

  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: "Failed to add employee" });

  } finally {
    connection.release();
  }
};


exports.getAllEmployees = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;
  const search = req.query.search || "";
  const department = req.query.department || "";
  const searchQuery = `%${search}%`;
  const status = req.query.status || "";

  try {
    //Dynamic WHERE condition
    let whereClause = `
      WHERE (
        e.full_name LIKE ? OR
        u.email LIKE ? OR
        e.department LIKE ? OR
        e.designation LIKE ?
      )
    `;

    const params = [
      searchQuery,
      searchQuery,
      searchQuery,
      searchQuery
    ];

    //Department filter add only if selected
    if (department) {
      whereClause += " AND e.department = ?";
      params.push(department);
    }

    //Status filter (ACTIVE / INACTIVE)
    if (status) {
      whereClause += " AND e.status = ?";
      params.push(status);
    }

    //TOTAL COUNT
    const [[countResult]] = await db.query(
      `
      SELECT COUNT(*) AS total
      FROM employee e
      JOIN user u ON e.user_id = u.user_id
      ${whereClause}
      `,
      params
    );

    const totalEmployees = countResult.total;
    const totalPages = Math.ceil(totalEmployees / limit);

    //DATA QUERY
    const [rows] = await db.query(
      `
      SELECT 
        e.employee_id,
        e.full_name AS name,
        u.email,
        e.employee_type,
        e.department,
        e.designation,
        e.status
      FROM employee e
      JOIN user u ON e.user_id = u.user_id
      ${whereClause}
      ORDER BY e.employee_id DESC
      LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    res.json({
      data: rows,
      pagination: {
        page,
        limit,
        totalEmployees,
        totalPages
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load employees" });
  }
};



exports.getEmployeeById = async (req, res) => {
  const { id } = req.params;

  try {
    const [[employee]] = await db.query(
      `SELECT employee_id, full_name, designation, department, phone,
              work_location, employee_type, status,
              blood_group, permanent_address
       FROM employee
       WHERE employee_id = ?`,
      [id]
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const [references] = await db.query(
      `SELECT reference_id, name, phone, address, relation
       FROM employee_reference
       WHERE employee_id = ?`,
      [id]
    );

    res.json({
      ...employee,
      reference_contacts: references
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch employee" });
  }
};

exports.updateEmployee = async (req, res) => {
  const { id } = req.params;

  const {
    full_name,
    designation,
    department,
    phone,
    work_location,
    employee_type,
    status,
    blood_group,
    permanent_address,
    reference_contacts
  } = req.body;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1️⃣ Update employee
    await connection.query(
      `UPDATE employee SET
        full_name = ?,
        designation = ?,
        department = ?,
        phone = ?,
        work_location = ?,
        employee_type = ?,
        status = ?,
        blood_group = ?,
        permanent_address = ?
       WHERE employee_id = ?`,
      [
        full_name,
        designation,
        department,
        phone,
        work_location,
        employee_type,
        status,
        blood_group,
        permanent_address,
        id
      ]
    );

    // 2️⃣ Update reference contacts
    if (Array.isArray(reference_contacts)) {
      for (const ref of reference_contacts) {
        if (ref.reference_id) {
          await connection.query(
            `UPDATE employee_reference
             SET name=?, phone=?, address=?, relation=?
             WHERE reference_id=?`,
            [
              ref.name,
              ref.phone,
              ref.address,
              ref.relation,
              ref.reference_id
            ]
          );
        }
      }
    }

    await connection.commit();
    res.json({ message: "Employee updated successfully" });

  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: "Failed to update employee" });

  } finally {
    connection.release();
  }
};

exports.deactivateEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    //Update employee status
    await db.query(
      "UPDATE employee SET status = 'inactive' WHERE employee_id = ?",
      [id]
    );

    //Also block login (important)
    await db.query(
      `UPDATE user u
       JOIN employee e ON u.user_id = e.user_id
       SET u.status = 'inactive'
       WHERE e.employee_id = ?`,
      [id]
    );

    res.json({ message: "Employee deactivated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to deactivate employee" });
  }
};

//Admin Dashboard
// exports.getKPIs = async (req, res) => {
//   try {
//     const [[total]] = await db.query(
//       "SELECT COUNT(*) AS total FROM employee"
//     );

//           const [[present]] = await db.query(
//           `SELECT COUNT(DISTINCT employee_id) AS present
//           FROM attendance
//           WHERE DATE(check_in_time) = CURDATE()
//           AND attendance_status IN ('PRESENT', 'LATE', 'HALF_DAY')`
//         );
        
//         const [[halfDay]] = await db.query(
//           `SELECT COUNT(DISTINCT employee_id) AS halfDay
//           FROM attendance
//           WHERE DATE(check_in_time) = CURDATE()
//           AND attendance_status = 'HALF_DAY'`
//         );
//         const [[onLeave]] = await db.query(
//           `SELECT COUNT(*) AS onLeave
//           FROM leave_request
//           WHERE status = 'approved'
//           AND CURDATE() BETWEEN start_date AND end_date`
//         );
//       const [[absent]] = await db.query(`
//         SELECT COUNT(*) AS absent
//         FROM employee e
//         WHERE e.employee_id NOT IN (
//           SELECT employee_id
//           FROM attendance
//           WHERE DATE(check_in_time) = CURDATE()
//         )
//       `);
//           res.json({
//         totalEmployees: total.total,
//         presentToday: present.present,
//         absentToday: absent.absent,
//         onLeave: onLeave.onLeave
//       });

//   } catch (err) {
//     res.status(500).json({ message: "Failed to load KPI data" });
//   }
// };
exports.getKPIs = async (req, res) => {
  try {
    const [[total]] = await db.query(
      "SELECT COUNT(*) AS total FROM employee WHERE status='active'"
    );

    const [[present]] = await db.query(
      `SELECT COUNT(DISTINCT employee_id) AS present
       FROM attendance
       WHERE DATE(check_in_time) = CURDATE()
       AND attendance_status IN ('PRESENT', 'LATE')`
    );

    const [[halfDay]] = await db.query(
      `SELECT COUNT(DISTINCT employee_id) AS halfDay
       FROM attendance
       WHERE DATE(check_in_time) = CURDATE()
       AND attendance_status = 'HALF_DAY'`
    );

    const [[onLeave]] = await db.query(
      `SELECT COUNT(DISTINCT employee_id) AS onLeave
       FROM leave_request
       WHERE status = 'approved'
       AND CURDATE() BETWEEN start_date AND end_date`
    );

    const [[absent]] = await db.query(
      `SELECT COUNT(DISTINCT employee_id) AS absent
       FROM attendance
       WHERE DATE(check_in_time) = CURDATE()
       AND attendance_status = 'ABSENT'`
    );

    res.json({
      totalEmployees: total.total,
      presentToday: present.present,
      halfDayToday: halfDay.halfDay,
      absentToday: absent.absent,
      onLeave: onLeave.onLeave
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load KPI data" });
  }
};

// WEEKLY LINE CHART
// exports.getWeeklyAttendance = async (req, res) => {
//   try {
//     const [rows] = await db.query(`
//       SELECT 
//         DAYNAME(check_in_time) AS day,
//         COUNT(DISTINCT employee_id) AS present
//       FROM attendance
//       WHERE check_in_time >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
//       GROUP BY DATE(check_in_time)
//       ORDER BY DATE(check_in_time)
//     `);

//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to load weekly attendance" });
//   }
// };
// exports.getWeeklyAttendance = async (req, res) => {
//   try {
//     const [rows] = await db.query(`
//       SELECT 
//         DAYNAME(check_in_time) AS day,
//         COUNT(DISTINCT employee_id) AS present
//       FROM attendance
//       WHERE check_in_time >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
//       AND attendance_status IN ('PRESENT', 'LATE')
//       GROUP BY DATE(check_in_time)
//       ORDER BY DATE(check_in_time)
//     `);

//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to load weekly attendance" });
//   }
// };

// TODAY PIE CHART

exports.getWeeklyAttendance = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        DATE(check_in_time) AS date,
        DAYNAME(check_in_time) AS day,
        COUNT(DISTINCT employee_id) AS present
      FROM attendance
      WHERE DATE(check_in_time) BETWEEN
        DATE_SUB(CURDATE(), INTERVAL 6 DAY) AND CURDATE()
      AND attendance_status IN ('PRESENT', 'LATE', 'HALF_DAY')
      GROUP BY DATE(check_in_time)
      ORDER BY DATE(check_in_time)
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to load weekly attendance" });
  }
};


// exports.getTodayStatus = async (req, res) => {
//   try {
//     const [[present]] = await db.query(
//       "SELECT COUNT(DISTINCT employee_id) AS value FROM attendance WHERE DATE(check_in_time) = CURDATE()"
//     );

//     const [[absent]] = await db.query(
//       `SELECT COUNT(*) AS value
//        FROM employee
//        WHERE employee_id NOT IN (
//          SELECT employee_id FROM attendance WHERE DATE(check_in_time) = CURDATE()
//        )`
//     );

//     const [[leave]] = await db.query(
//       `SELECT COUNT(*) AS value
//        FROM leave_request
//        WHERE status='approved'
//        AND CURDATE() BETWEEN start_date AND end_date`
//     );

//     res.json([
//       { name: "Present", value: present.value },
//       { name: "Absent", value: absent.value },
//       { name: "On Leave", value: leave.value }
//     ]);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to load today status" });
//   }
// };


// BAR CHART


exports.getTodayStatus = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);

    const [[present]] = await db.query(`
      SELECT COUNT(*) AS value
      FROM attendance
      WHERE attendance_date = ?
      AND attendance_status IN ('PRESENT', 'HALF_DAY', 'LATE')
    `, [today]);

    const [[absent]] = await db.query(`
      SELECT COUNT(*) AS value
      FROM attendance
      WHERE attendance_date = ?
      AND attendance_status = 'ABSENT'
    `, [today]);

    const [[leave]] = await db.query(`
      SELECT COUNT(*) AS value
      FROM leave_request
      WHERE status = 'approved'
      AND ? BETWEEN start_date AND end_date
    `, [today]);

    res.json([
      { name: "Present", value: present.value },
      { name: "Absent", value: absent.value },
      { name: "On Leave", value: leave.value }
    ]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load today status" });
  }
};

exports.getDepartmentWise = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT department, COUNT(*) AS employees
      FROM employee
      GROUP BY department
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to load department data" });
  }
};

exports.getAttendanceReport = async (req, res) => {
  const { fromDate, toDate, department, employeeId } = req.query;

  try {
    let whereClause = "WHERE 1=1";
    const params = [];

    if (fromDate && toDate) {
      whereClause += " AND DATE(a.check_in_time) BETWEEN ? AND ?";
      params.push(fromDate, toDate);
    }

    if (department) {
      whereClause += " AND e.department = ?";
      params.push(department);
    }

    if (employeeId) {
      whereClause += " AND e.employee_id = ?";
      params.push(employeeId);
    }

    const [rows] = await db.query(
      `
      SELECT 
        a.attendance_id,
        DATE_FORMAT(a.check_in_time,'%Y-%m-%d') AS date,
        TIME(a.check_in_time) AS check_in,
        TIME(a.check_out_time) AS check_out,
        a.attendance_status,
        e.employee_id,
        e.full_name,
        e.department
      FROM attendance a
      JOIN employee e ON a.employee_id = e.employee_id
      ${whereClause}
      ORDER BY date DESC
      `,
      params
    );
 
    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load attendance report" });
  }
};

/**
 * ADMIN VIEW ALL LEAVES
 */
exports.getAllLeaves = async (req, res) => {
  const [rows] = await db.query(
  `SELECT 
    l.leave_id,
    e.full_name,
    DATE(l.start_date) AS start_date,
    DATE(l.end_date) AS end_date,
    l.reason,
    l.status
   FROM leave_request l
   JOIN employee e ON l.employee_id = e.employee_id
   ORDER BY l.applied_at DESC`
);

  res.json(rows);
};


/**
 * ADMIN UPDATE LEAVE STATUS (APPROVE / REJECT)
 */
exports.updateLeaveStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["APPROVED", "REJECTED"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    await db.query(
      `UPDATE leave_request
       SET status = ?
       WHERE leave_id = ?`,
      [status, id]
    );

    res.json({ message: "Leave status updated" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update leave status" });
  }
};

exports.adminSalaryReport = async (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    return res.status(400).json({ message: "Month & year required" });
  }

  try {
    const [rows] = await db.query(
      `SELECT
        e.employee_id,
        e.full_name,
        e.monthly_salary,
        COALESCE(SUM(a.attendance_status IN ('PRESENT','LATE')),0) AS present_days,
        COALESCE(SUM(a.attendance_status='HALF_DAY'),0) AS half_days
      FROM employee e
      LEFT JOIN attendance a
        ON e.employee_id = a.employee_id
        AND MONTH(a.check_in_time)=?
        AND YEAR(a.check_in_time)=?
      GROUP BY e.employee_id`,
      [month, year]
    );

    const WORKING_DAYS = 30;

    const report = rows.map(emp => {
      const perDay = emp.monthly_salary / WORKING_DAYS;
      const payableDays = emp.present_days + emp.half_days * 0.5;
      return {
        ...emp,
        absent_days: WORKING_DAYS - payableDays,
        payable_salary: (perDay * payableDays).toFixed(2)
      };
    });

    res.json(report);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load salary report" });
  }
};

exports.approveSalary = async (req, res) => {
  const { employee_id, month, year } = req.body;
  const adminId = req.user.user_id;

  if (!employee_id || !month || !year) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  try {
    await db.query(
      `INSERT INTO salary_approval
       (employee_id, month, year, approved_by)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE approved_at = NOW()`,
      [employee_id, month, year, adminId]
    );

    res.json({ message: "Salary approved successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Approval failed" });
  }
};

exports.downloadAdminPayslip = async (req, res) => {
  const { employee_id, month, year } = req.query;

  // 1️⃣ Check approval
  const [[approval]] = await db.query(
    `SELECT * FROM salary_approval
     WHERE employee_id = ? AND month = ? AND year = ?`,
    [employee_id, month, year]
  );

  if (!approval) {
    return res.status(403).json({
      message: "Salary not approved yet"
    });
  }

  // 2️⃣ Fetch salary summary
  const [[salary]] = await db.query(
    `SELECT * FROM salary_summary
     WHERE employee_id = ? AND month = ? AND year = ?`,
    [employee_id, month, year]
  );

  if (!salary) {
    return res.status(404).json({ message: "Salary data not found" });
  }

  // 3️⃣ Create PDF
  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=payslip-${month}-${year}.pdf`
  );

  doc.pipe(res);

  doc.fontSize(18).text("Company Name Pvt Ltd", { align: "center" });
  doc.moveDown();

  doc.fontSize(12)
    .text(`Employee ID: ${salary.employee_id}`)
    .text(`Month: ${month}/${year}`)
    .text(`Present Days: ${salary.present_days}`)
    .text(`Half Days: ${salary.half_days}`)
    .text(`Absent Days: ${salary.absent_days}`)
    .moveDown();

  doc.text(`Monthly Salary: ₹${salary.monthly_salary}`);
  doc.text(`Payable Salary: ₹${salary.payable_salary}`);

  doc.moveDown();
  doc.text("Authorized by HR Department");

  doc.end();
};




// // OFFICE DAY REPORT
// exports.getOfficeAttendanceReport = async (req, res) => {
//   const { location_id, date } = req.query;

//   try {
//     const [rows] = await db.query(`
//       SELECT 
//         e.employee_id,
//         e.full_name,
//         a.attendance_status,
//         TIME(a.check_in_time) AS check_in,
//         TIME(a.check_out_time) AS check_out
//       FROM attendance a
//       JOIN employee e ON a.employee_id = e.employee_id
//       WHERE a.location_id = ?
//       AND DATE(a.check_in_time) = ?
//     `, [location_id, date]);

//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to load office attendance report" });
//   }
// };

// // OFFICE MONTH SUMMARY
// exports.getMonthlyOfficeSummary = async (req, res) => {
//   const { location_id, month, year } = req.query;

//   try {
//     const [rows] = await db.query(`
//       SELECT 
//         attendance_status,
//         COUNT(*) AS count
//       FROM attendance
//       WHERE location_id = ?
//       AND MONTH(check_in_time) = ?
//       AND YEAR(check_in_time) = ?
//       GROUP BY attendance_status
//     `, [location_id, month, year]);

//     res.json(rows);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to load office summary" });
//   }
// };
