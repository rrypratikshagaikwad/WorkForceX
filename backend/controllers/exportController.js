const db = require("../config/db");
const ExcelJS = require("exceljs");

exports.exportAttendanceExcel = async (req, res) => {
  const { from, to } = req.query;

  const [rows] = await db.query(`
    SELECT 
      e.full_name,
      a.check_in_time,
      a.check_out_time,
      a.attendance_status
    FROM attendance a
    JOIN employee e ON a.employee_id = e.employee_id
    WHERE DATE(a.check_in_time) BETWEEN ? AND ?
    ORDER BY a.check_in_time DESC
  `, [from, to]);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Attendance Report");

  sheet.columns = [
    { header: "Employee Name", key: "full_name", width: 25 },
    { header: "Check In", key: "check_in_time", width: 20 },
    { header: "Check Out", key: "check_out_time", width: 20 },
    { header: "Status", key: "attendance_status", width: 15 }
  ];

  rows.forEach(row => sheet.addRow(row));

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=attendance.xlsx"
  );

  await workbook.xlsx.write(res);
  res.end();
};

const PDFDocument = require("pdfkit");

exports.exportAttendancePDF = async (req, res) => {
  const { from, to } = req.query;

  const [rows] = await db.query(`
    SELECT 
      e.full_name,
      a.check_in_time,
      a.check_out_time,
      a.attendance_status
    FROM attendance a
    JOIN employee e ON a.employee_id = e.employee_id
    WHERE DATE(a.check_in_time) BETWEEN ? AND ?
  `, [from, to]);

  const doc = new PDFDocument({ margin: 30, size: "A4" });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=attendance.pdf");

  doc.pipe(res);

  doc.fontSize(18).text("Attendance Report", { align: "center" });
  doc.moveDown();

  rows.forEach((r, i) => {
    doc
      .fontSize(10)
      .text(`${i + 1}. ${r.full_name} | ${r.attendance_status}`)
      .text(`In: ${r.check_in_time}`)
      .text(`Out: ${r.check_out_time || "-"}`);
    doc.moveDown(0.8);
  });

  doc.end();
};
