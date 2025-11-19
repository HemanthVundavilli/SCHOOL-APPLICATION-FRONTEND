import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./../stylesheets/AdminPage.css"; // Reuse same layout styles
import "bootstrap/dist/css/bootstrap.min.css";
import ReactApexChart from "react-apexcharts";

// Optional teacher icons
import dash1 from "../../assets/img/dash/dash-1.png"; 
import dash2 from "../../assets/img/dash/dash-2.png";
import dash3 from "../../assets/img/dash/dash-3.png";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [teacherRes, attendanceRes, studentsRes] = await Promise.all([
          api.get("/teachers/me"),
          api.get("/teachers/attendance"),
          api.get("/teachers/students"),
        ]);
        setTeacher(teacherRes.data);
        setAttendance(attendanceRes.data);
        setStudents(studentsRes.data);
      } catch {
        setMessage("Failed to load teacher dashboard data");
      }
    }
    fetchData();
  }, []);

  const attendancePercentage =
    attendance.length === 0
      ? 0
      : Math.round(
          (attendance.filter((a) => a.present).length * 100) / attendance.length
        );

  const handleSidebarClick = (path) => {
    setSidebarOpen(true);
    navigate(path);
  };

  return (
    <div className={`admin-layout ${sidebarOpen ? "sidebar-open" : ""}`}>
      {/* === HEADER === */}
      <header className="admin-header shadow-sm bg-white">
        <div className="menubutton">
          <button
            className={`menu-toggle-btn ${sidebarOpen ? "open" : ""}`}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>

        <div className="d-flex align-items-center gap-3">
          <h4 className="fw-bold text-primary m-2">Teacher Dashboard</h4>
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.clear();
              navigate("/", { replace: true });
            }}
          >
            <i className="fa fa-sign-out me-2"></i> Logout
          </button>
        </div>
      </header>

      {/* === SIDEBAR === */}
      <aside
        className={`sidebar shadow-sm ${sidebarOpen ? "expanded" : "collapsed"}`}
      >
        <div className="sidebar-top">
          <div className="sidebar-logo">
            <i className="fa fa-user-tie me-2"></i>
            {sidebarOpen && <span>Teacher Panel</span>}
          </div>
        </div>

        <nav className="sidebar-menu">
          <ul>
            <li onClick={() => handleSidebarClick("/teacher-dashboard")}>
              <i className="fa fa-home"></i>
              {sidebarOpen && <span>Dashboard</span>}
            </li>
            <li onClick={() => handleSidebarClick("/teacher/studentsmanagement")}>
              <i className="fa fa-users"></i>
              {sidebarOpen && <span>Manage Students</span>}
            </li>
            <li onClick={() => handleSidebarClick("/teacher/attendance")}>
              <i className="fa fa-calendar-check"></i>
              {sidebarOpen && <span>Mark Attendance</span>}
            </li>
            <li onClick={() => handleSidebarClick("/teacher/marks-entry")}>
              <i className="fa fa-pencil-alt"></i>
              {sidebarOpen && <span>Enter Marks</span>}
            </li>
                        <li onClick={() => handleSidebarClick("/teacher/fees-entry")}>
              <i className="fa fa-inr"></i>
              {sidebarOpen && <span>Enter Fees</span>}
            </li>
          </ul>
        </nav>
      </aside>

      {/* === MAIN CONTENT === */}
      <main className="admin-main">
        <div className="container-fluid py-4">
          <div className="page-header mb-4">
            <h3 className="page-title mb-0">
              Welcome, {teacher ? teacher.name : "Teacher"}
            </h3>
            <p className="text-muted">Quick summary of your teaching activity</p>
          </div>

          {message && (
            <div className="alert alert-warning text-center">{message}</div>
          )}

          {/* === INFO CARDS === */}
          <div className="row g-4">
            {[
              {
                label: "Your Students",
                count: students.length,
                img: dash1,
              },
              {
                label: "Attendance %",
                count: `${attendancePercentage}%`,
                img: dash2,
              },
              {
                label: "Subjects",
                count: teacher?.subjects?.length || 0,
                img: dash3,
              },
            ].map((item, i) => (
              <div className="col-xl-4 col-md-6" key={i}>
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div>
                      <p className="text-muted mb-1 fw-semibold">{item.label}</p>
                      <h4 className="fw-bold text-dark">{item.count}</h4>
                    </div>
                    <img src={item.img} alt={item.label} width="60" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* === ATTENDANCE CHART === */}
          <div className="row mt-4">
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-0">
                  <h5 className="m-0">Attendance Overview</h5>
                </div>
                <div className="card-body">
                  <ReactApexChart
                    options={{
                      chart: { type: "pie" },
                      labels: ["Present", "Absent"],
                      colors: ["#1cc88a", "#e74a3b"],
                      legend: { position: "bottom" },
                    }}
                    series={[
                      attendance.filter((a) => a.present).length,
                      attendance.filter((a) => !a.present).length,
                    ]}
                    type="pie"
                    height={300}
                  />
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-0">
                  <h5 className="m-0">Recent Attendance</h5>
                </div>
                <div className="card-body table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.slice(-5).map((a, index) => (
                        <tr key={index}>
                          <td>{new Date(a.date).toLocaleDateString()}</td>
                          <td
                            style={{
                              color: a.present ? "#1cc88a" : "#e74a3b",
                              fontWeight: "bold",
                            }}
                          >
                            {a.present ? "Present" : "Absent"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* === STUDENT LIST TABLE === */}
          <div className="card mt-4 border-0 shadow-sm">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
              <h5 className="m-0">Students in Your Classes</h5>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => navigate("/teacher/studentsmanagement")}
              >
                View All
              </button>
            </div>
            <div className="card-body table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Class</th>
                    <th>Father Mobile</th>
                    <th>Admission No</th>
                  </tr>
                </thead>
                <tbody>
                  {students.slice(0, 5).map((s) => (
                    <tr key={s._id}>
                      <td className="fw-semibold">{s.name}</td>
                      <td>{s.class}</td>
                      <td>{s?.fatherDetails?.phone || "N/A"}</td>
                      <td>{s.admissionNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}