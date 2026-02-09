const express = require("express");
const app = express();
require("dotenv").config();

/* =======================
   FORCE CORS (HOSTINGER)
   ======================= */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://workforcex.tech");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.header("Access-Control-Allow-Credentials", "true");

  // IMPORTANT: handle preflight
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});
/* ======================= */

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

/* ===== ROUTES ===== */
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const attendanceRoutes = require("./routes/attendanceRoutes");
app.use("/api/attendance", attendanceRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);

const exportRoutes = require("./routes/exportRoutes");
app.use("/api/export", exportRoutes);

/* ===== CRON ===== */
require("./cron/autoAbsent");

/* ===== SERVER ===== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
