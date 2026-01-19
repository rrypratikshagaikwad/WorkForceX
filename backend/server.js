const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));


const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes)

const attendanceRoutes = require("./routes/attendanceRoutes");
app.use("/attendance", attendanceRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/admin", adminRoutes);

const exportRoutes = require("./routes/exportRoutes");
app.use("/export", exportRoutes);

require("./cron/autoAbsent");


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});