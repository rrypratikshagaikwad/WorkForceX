const cron = require("node-cron");
const db = require("../config/db");
const moment = require("moment");

// Runs daily at 14:00 (2 PM)
cron.schedule("0 14 * * *", async () => {
  console.log("⏰ Auto Absent Job Started");

  const today = moment().format("YYYY-MM-DD");

  try {
    const [employees] = await db.query(`
      SELECT employee_id
      FROM employee
      WHERE status = 'active'
    `);

    for (const emp of employees) {

      // Skip if already attendance exists
      const [[att]] = await db.query(`
        SELECT attendance_id
        FROM attendance
        WHERE employee_id = ?
        AND attendance_date = ?
      `, [emp.employee_id, today]);

      if (att) continue;

      // Skip if approved leave
      const [[leave]] = await db.query(`
        SELECT leave_id
        FROM leave_request
        WHERE employee_id = ?
        AND status = 'approved'
        AND ? BETWEEN start_date AND end_date
      `, [emp.employee_id, today]);

      if (leave) continue;

      // Mark ABSENT
      await db.query(`
        INSERT INTO attendance
        (employee_id, attendance_date, attendance_status)
        VALUES (?, ?, 'ABSENT')
      `, [emp.employee_id, today]);

      console.log(`🚫 ABSENT marked: ${emp.employee_id}`);
    }

  } catch (err) {
    console.error("❌ Auto Absent Error:", err);
  }
});