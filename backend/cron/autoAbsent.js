const cron = require("node-cron");
const db = require("../config/db");
const moment = require("moment");

cron.schedule("0 14 * * *", async () => {
  console.log("⏰ Running Auto Absent Job...");

  try {
    // 1️⃣ Get all active employees
    const [employees] = await db.query(
      `SELECT employee_id FROM employee WHERE status = 'active'`
    );

    for (let emp of employees) {
      // 2️⃣ Check if attendance exists today
      const [[attendance]] = await db.query(
        `SELECT attendance_id
         FROM attendance
         WHERE employee_id = ?
         AND DATE(check_in_time) = CURDATE()`,
        [emp.employee_id]
      );

      // 3️⃣ If no attendance → mark ABSENT
      if (!attendance) {
        await db.query(
          `INSERT INTO attendance
           (employee_id, check_in_time, attendance_status)
           VALUES (?, NOW(), 'ABSENT')`,
          [emp.employee_id]
        );

        console.log(`🚫 ABSENT marked for employee ${emp.employee_id}`);
      }
    }
  } catch (err) {
    console.error("Auto Absent Error:", err);
  }
});
