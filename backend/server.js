const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes)

const attendanceRoutes = require("./routes/attendanceRoutes");
app.use("/attendance", attendanceRoutes);

const adminRoutes = require("./routes/adminRoutes");
app.use("/admin", adminRoutes);

const exportRoutes = require("./routes/exportRoutes");
app.use("/export", exportRoutes);

require("./cron/autoAbsent");

app.listen(5000, () => {
    console.log("Backend running on http://localhost:5000");
});
