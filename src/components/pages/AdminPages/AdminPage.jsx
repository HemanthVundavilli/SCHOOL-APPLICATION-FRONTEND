import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import ReactApexChart from "react-apexcharts";
import "bootstrap/dist/css/bootstrap.min.css";
import "./../stylesheets/AdminPage.css";
// import '../stylesheets/SideBarToggle.css';
// import '../../assets/css/style.css';
// Dashboard icons
import dash1 from "../../assets/img/dash/dash-1.png";
import dash2 from "../../assets/img/dash/dash-2.png";
import dash3 from "../../assets/img/dash/dash-3.png";
import dash4 from "../../assets/img/dash/dash-4.png";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [parents, setParents] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [studentsRes, teachersRes] = await Promise.all([
          api.get("/admins/students"),
          api.get("/admins/teachers"),
        ]);
        setStudents(studentsRes.data);
        setTeachers(teachersRes.data);
        // Calculate total earnings from all students
        let total = 0;

        studentsRes.data.forEach((s) => {
          if (s.payments && Array.isArray(s.payments)) {
            total += s.payments.reduce((sum, p) => sum + (p.amount || 0), 0);
          }
        });

        setEarnings(total);
        setParents([]);
      } catch {
        setMessage("Failed to load dashboard data");
      }
    }
    fetchData();
  }, []);

  // === CRUD HANDLERS ===
  const handleEditStudent = (student) =>
    navigate("/admin/studentsmanagement", { state: { student } });

  const handleDeleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await api.delete(`/admins/student/${id}`);
      setStudents((prev) => prev.filter((s) => s._id !== id));
    } catch {
      alert("Failed to delete student");
    }
  };

  const handleEditTeacher = (teacher) =>
    navigate("/admin/teachersmanagement", { state: { teacher } });

  const handleDeleteTeacher = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;
    try {
      await api.delete(`/admins/${id}`);
      setTeachers((prev) => prev.filter((t) => t._id !== id));
    } catch {
      alert("Failed to delete teacher");
    }
  };

  // === CHART CONFIGS ===
  const studentClassCount = Object.values(
    students.reduce((acc, s) => {
      const c = s.class || "N/A";
      acc[c] = (acc[c] || 0) + 1;
      return acc;
    }, {})
  );

  const classLabels = [...new Set(students.map((s) => s.class).filter(Boolean))];

  const teacherClassCount = Object.values(
    teachers.reduce((acc, t) => {
      (t.classes || []).forEach((cls) => (acc[cls] = (acc[cls] || 0) + 1));
      return acc;
    }, {})
  );

  // === SIDEBAR CLICK HANDLER ===
  const handleSidebarClick = (path) => {
    setSidebarOpen(true); // expands sidebar
    navigate(path);
  };

  return (
    <div className={`admin-layout ${sidebarOpen ? "sidebar-open" : ""}`}>
      
      {/* === HEADER === */}
      <header className="admin-header shadow-sm bg-white">
            <div className="menubutton"><button
      className={`menu-toggle-btn ${sidebarOpen ? "open" : ""}`}
      onClick={() => setSidebarOpen(!sidebarOpen)}
    >
      <span className="bar"></span>
      <span className="bar"></span>
      <span className="bar"></span>
    </button>
    </div>
        {/* Hamburger button INSIDE sidebar */}

        <div className="d-flex align-items-center gap-3">
          <h4 className="fw-bold text-success m-2">School Admin Dashboard</h4>
              {/* Logout button */}
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
<aside className={`sidebar shadow-sm ${sidebarOpen ? "expanded" : "collapsed"}`}>
  <div className="sidebar-top">
    <div className="sidebar-logo">
      <i className="fa fa-graduation-cap me-2"></i>
      {sidebarOpen && <span>My School</span>}
      
    </div>

    
  </div>

  <nav className="sidebar-menu">
    <ul>
      <li onClick={() => handleSidebarClick("/admin")}>
        <i className="fa fa-home"></i>
        {sidebarOpen && <span>Dashboard</span>}
      </li>
      <li onClick={() => handleSidebarClick("/admin/teachersmanagement")}>
        <i className="fa fa-user"></i>
        {sidebarOpen && <span>Teachers Management</span>}
      </li>
      <li onClick={() => handleSidebarClick("/admin/studentsmanagement")}>
        <i className="fa fa-users"></i>
        {sidebarOpen && <span>Students Management</span>}
      </li>
            <li onClick={() => handleSidebarClick("/admin/attendance")}>
        <i className="fa fa-calendar-check"></i>
        {sidebarOpen && <span>Teachers & Student Attendance</span>}
      </li>

      <li onClick={() => handleSidebarClick("/admin/marks-entry")}>
        <i className="fa fa-pencil-alt"></i>
        {sidebarOpen && <span>Marks Entry</span>}
      </li>

      <li onClick={() => handleSidebarClick("/admin/fees-entry")}>
        <i className="fa fa-inr"></i>
        {sidebarOpen && <span>Fees Entry</span>}
      </li>
      <li onClick={() => handleSidebarClick("/admin/events")}>
        <i className="fa fa-calendar"></i>
        {sidebarOpen && <span>Events</span>}
      </li>
      <li onClick={() => handleSidebarClick("/admin/settings")}>
        <i className="fa fa-cog"></i>
        {sidebarOpen && <span>Settings</span>}
      </li>

    </ul>
  </nav>
</aside>

      {/* === MAIN CONTENT === */}
      <main className="admin-main">
        <div className="container-fluid py-4">
          <div className="page-header mb-4">
            <h3 className="page-title mb-0">Dashboard Overview</h3>
            <p className="text-muted">Quick summary of school activities</p>
          </div>

          {message && <div className="alert alert-warning text-center">{message}</div>}

          {/* === WIDGETS === */}
          <div className="row g-4">
            {[
              { label: "Students", count: students.length, img: dash1 },
              { label: "Teachers", count: teachers.length, img: dash2 },
              { label: "Parents", count: parents.length, img: dash3 },
              { label: "Earnings", count: `₹${earnings.toLocaleString()}`, img: dash4 },
            ].map((item, i) => (
              <div className="col-xl-3 col-md-6" key={i}>
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

          {/* === CHARTS === */}
          <div className="row mt-4">
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-0">
                  <h5 className="m-0">Class Distribution</h5>
                </div>
                <div className="card-body">
                  <ReactApexChart
                    options={{
                      chart: { type: "bar" },
                      colors: ["#4e73df", "#1cc88a"],
                      xaxis: { categories: classLabels },
                      legend: { position: "top" },
                    }}
                    series={[
                      { name: "Students", data: studentClassCount },
                      { name: "Teachers", data: teacherClassCount },
                    ]}
                    type="bar"
                    height={300}
                  />
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-0">
                  <h5 className="m-0">Institution Overview</h5>
                </div>
                <div className="card-body d-flex justify-content-center align-items-center">
                  <ReactApexChart
                    options={{
                      chart: { type: "donut" },
                      colors: ["#4e73df", "#1cc88a"],
                      labels: ["Students", "Teachers"],
                      legend: { position: "bottom" },
                      plotOptions: {
                        pie: {
                          donut: {
                            size: "70%",
                            labels: {
                              show: true,
                              total: {
                                show: true,
                                label: "Total",
                                formatter: () => students.length + teachers.length,
                              },
                            },
                          },
                        },
                      },
                    }}
                    series={[students.length, teachers.length]}
                    type="donut"
                    height={300}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* === STUDENT TABLE === */}
          <div className="card mt-4 border-0 shadow-sm">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
              <h5 className="m-0">All Students</h5>
              <button className="btn btn-outline-primary btn-sm" onClick={() => navigate("/admin/studentsmanagement")}>View All</button>
            </div>
            <div className="card-body table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Class</th>
                    <th>Father Mobile</th>
                    <th>Admission No</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.slice(0, 5).map((s) => (
                    <tr key={s._id}>
                      <td className="fw-semibold">{s.name}</td>
                      <td>{s.class}</td>
                      <td>{s?.fatherDetails?.phone || "N/A"}</td>
                      <td>{s.admissionNumber}</td>
                      <td>
                        <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditStudent(s)}>
                          <i className="fa fa-edit"></i>
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteStudent(s._id)}>
                          <i className="fa fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* === TEACHER TABLE === */}
          <div className="card mt-4 border-0 shadow-sm">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
              <h5 className="m-0">All Teachers</h5>
              <button className="btn btn-outline-primary btn-sm" onClick={() => navigate("/admin/teachersmanagement")}>View All</button>
            </div>
            <div className="card-body table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Subject</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.slice(0, 5).map((t) => (
                    <tr key={t._id}>
                      <td className="fw-semibold">{t.name}</td>
                      <td>{t.subject || "N/A"}</td>
                      <td>{t.phone || "N/A"}</td>
                      <td>
                        <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditTeacher(t)}>
                          <i className="fa fa-edit"></i>
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteTeacher(t._id)}>
                          <i className="fa fa-trash"></i>
                        </button>
                      </td>
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
