const db = require("../config/db");
const bcrypt = require("bcrypt");

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
    shift_hours
  } = req.body;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // ❗ Check duplicate email
    const [[existing]] = await connection.query(
      "SELECT user_id FROM user WHERE email = ?",
      [email]
    );

    if (existing) {
      await connection.rollback();
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 1️⃣ User insert
    const [userResult] = await connection.query(
      `INSERT INTO user (name, email, password, phone, role)
       VALUES (?, ?, ?, ?, 'employee')`,
      [full_name, email, hashedPassword, phone]
    );

    const userId = userResult.insertId;

    // 2️⃣ Employee insert
    await connection.query(
      `INSERT INTO employee
       (user_id, full_name, designation, department, phone, work_location,
        joining_date, status, employee_type, shift_hours)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)`,
      [
        userId,
        full_name,
        designation,
        department,
        phone,
        work_location,
        joining_date,
        employee_type,
        shift_hours
      ]
    );

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
      `
      SELECT 
        e.employee_id,
        e.full_name,
        e.designation,
        e.department,
        e.phone,
        e.work_location,
        e.employee_type,
        e.status
      FROM employee e
      WHERE e.employee_id = ?
      `,
      [id]
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
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
    status
  } = req.body;

  try {
    await db.query(
      `
      UPDATE employee
      SET 
        full_name = ?,
        designation = ?,
        department = ?,
        phone = ?,
        work_location = ?,
        employee_type = ?,
        status = ?
      WHERE employee_id = ?
      `,
      [
        full_name,
        designation,
        department,
        phone,
        work_location,
        employee_type,
        status,
        id
      ]
    );

    res.json({ message: "Employee updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update employee" });
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
exports.getKPIs = async (req, res) => {
  try {
    const [[total]] = await db.query(
      "SELECT COUNT(*) AS total FROM employee"
    );

    const [[present]] = await db.query(
      "SELECT COUNT(DISTINCT employee_id) AS present FROM attendance WHERE DATE(check_in_time) = CURDATE()"
    );

    const [[onLeave]] = await db.query(
      `SELECT COUNT(*) AS onLeave
       FROM leave_request
       WHERE status = 'approved'
       AND CURDATE() BETWEEN start_date AND end_date`
    );

    res.json({
      totalEmployees: total.total,
      presentToday: present.present,
      absentToday: total.total - present.present - onLeave.onLeave,
      onLeave: onLeave.onLeave
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to load KPI data" });
  }
};


// WEEKLY LINE CHART
exports.getWeeklyAttendance = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        DAYNAME(check_in_time) AS day,
        COUNT(DISTINCT employee_id) AS present
      FROM attendance
      WHERE check_in_time >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
      GROUP BY DATE(check_in_time)
      ORDER BY DATE(check_in_time)
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to load weekly attendance" });
  }
};


// TODAY PIE CHART
exports.getTodayStatus = async (req, res) => {
  try {
    const [[present]] = await db.query(
      "SELECT COUNT(DISTINCT employee_id) AS value FROM attendance WHERE DATE(check_in_time) = CURDATE()"
    );

    const [[absent]] = await db.query(
      `SELECT COUNT(*) AS value
       FROM employee
       WHERE employee_id NOT IN (
         SELECT employee_id FROM attendance WHERE DATE(check_in_time) = CURDATE()
       )`
    );

    const [[leave]] = await db.query(
      `SELECT COUNT(*) AS value
       FROM leave_request
       WHERE status='approved'
       AND CURDATE() BETWEEN start_date AND end_date`
    );

    res.json([
      { name: "Present", value: present.value },
      { name: "Absent", value: absent.value },
      { name: "On Leave", value: leave.value }
    ]);
  } catch (err) {
    res.status(500).json({ message: "Failed to load today status" });
  }
};


// BAR CHART
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
      l.start_date,
       l.end_date,
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






