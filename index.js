const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
var cors = require("cors");
const db = require("./Helper/Connect");

const Comman = require("./Routes/Comman");
const Admin = require("./Routes/Admin");
const School = require("./Routes/school");
const Coaching = require("./Routes/Coaching");
const College = require("./Routes/College");
const Student = require("./Routes/Student");
const Parent = require("./Routes/Parent");
const Guest = require("./Routes/Guest");
const AttendanceStudent = require("./Routes/Attendance");
const Test = require("./Routes/Test");
const clientVerify = require("./Routes/ClientVerify");
const Reports = require("./Routes/report");
const EmployeeAttendance = require('./Routes/EmployeeAttendance');
// to run migrations run command - --------  npm run migrate ---------------------

app.use(cors());
app.options("*", cors());
app.use(express.static(__dirname + "/Documentation"));
app.use(express.json({ limit: "50mb" }));

app.get("/test", (req, res) => {
  res.send("<h2>working api's</h2>");
});

app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/Documentation/index.html");
});
app.use("*/images", express.static("public/upload"));
app.use("/api/admin", Admin);
app.use("/api/school", School);
app.use("/api/coaching", Coaching);
app.use("/api/college", College);
app.use("/api/comman", Comman);
app.use("/api/student", Student);
app.use("/api/parent", Parent);
app.use("/api/guest", Guest);
app.use("/api/attendanceatudent", AttendanceStudent);
app.use("/api/test", Test);
app.use("/api/clientVerify", clientVerify);
app.use("/api/report", Reports);
app.use("/api/EmployeeAttendance", EmployeeAttendance);
app.use("*", (req, res) => {
  return res.status(404).json({
    status: false,
    msg: "No Route Found!!",
  });
});

db.sync({ sync: true }).then((req) => {
  app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
  });
});
