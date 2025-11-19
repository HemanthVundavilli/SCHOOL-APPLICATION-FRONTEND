import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Navbar from "./Navbar";
import Popup from "./Popup";
import "./../stylesheets/AttendancePage.css";
import { Navigate, useNavigate } from "react-router-dom";
export default function AttendancePage({ role = "admin" }) {
  const [records, setRecords] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [popupMessage, setPopupMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("students");
  const [selectedClass, setSelectedClass] = useState("");   // NEW — class filter
  const [alreadySubmitted, setAlreadySubmitted] = useState(false); // NEW
  const [confirmVisible, setConfirmVisible] = useState(false); // NEW

  useEffect(() => {
    fetchData();
  }, [role, mode, selectedDate, selectedClass]);


  async function fetchData(currentToggles = {}) {
    // restrict teacher from viewing teacher attendance
    if (role === "teacher" && mode === "teachers") {
      setRecords([]);
      setPopupMessage("You don’t have access to view teachers’ attendance.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      let endpoint = "";
      if (role === "teacher") endpoint = "/students";
      else if (role === "admin" && mode === "students") endpoint = "/admins/students";
      else if (role === "admin" && mode === "teachers") endpoint = "/admins/teachers";

      const res = await api.get(endpoint);
      let data = Array.isArray(res.data) ? res.data : [];

      // --- Apply class filter only for students ---
      if (mode === "students" && selectedClass !== "") {
        data = data.filter((s) => s.class?.toString() === selectedClass);
      }

      setRecords(data);

      // Initialize attendance for selected date
const tempMap = {};

let submittedFlag = true;
data.forEach((r) => {
  const att = r.attendance?.find(a => a.date?.slice(0, 10) === selectedDate);
  // Use current toggle if present; otherwise backend value
  tempMap[r._id] = attendanceMap[r._id] !== undefined ? attendanceMap[r._id] : (att ? att.present : false);
});
setAttendanceMap(tempMap);


      setAttendanceMap(tempMap);
      setAlreadySubmitted(submittedFlag); // NEW
    } catch {
      setPopupMessage("Failed to load data");
    } finally {
      setLoading(false);
    }
  }


  const toggleAttendance = (id) => {
    setAttendanceMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };


  // === CONFIRMED SUBMISSION ===
  const handleConfirmedSubmit = async () => {
    try {
      let base = "";

      if (role === "teacher") {
        base = "/students/attendance";
      } else if (role === "admin") {
        base = mode === "students" ? "/students/attendance" : "/teachers/attendance";
      }

      await Promise.all(
        records.map((r) =>
          api.put(`${base}/${r._id}`, {
            date: selectedDate,
            present: attendanceMap[r._id],
          })
        )
      );

      setPopupMessage("Attendance submitted successfully");
      setConfirmVisible(false);
      setTimeout(async () => {
      await fetchData();
      setAttendanceMap({}); // clear toggles now after fetch
    }, 300);         // <-- add this line to avoid UI mismatch after submit
    } catch {
      setPopupMessage("Error submitting attendance");
      setConfirmVisible(false);
    }
  };


  // === SUBMIT BUTTON CLICK ===
  const submitAttendance = async () => {
    if (alreadySubmitted) {
      setConfirmVisible(true);
      return;
    }
    handleConfirmedSubmit();
  };


  const calculateAttendancePercentage = (attendance) => {
    if (!attendance || attendance.length === 0) return "0.00";
    const presentDays = attendance.filter((r) => r.present).length;
    return ((presentDays / attendance.length) * 100).toFixed(2);
  };


  const getTodayStatus = (attendance, date) => {
    const record = attendance?.find((a) => {
    const d = a.date ? a.date.slice(0, 10) : "";
    return d === date;
  });

    if (!record) return "Yet to Update";
    return record.present ? "Present" : "Absent";
  };

const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div className="page-container">

        <h1>{role === "admin" ? "Admin Attendance Panel" : "Student Attendance"}</h1>
        <button
                  className="back-btn"
                  onClick={() => {
                    const role = localStorage.getItem("role");

                    if (role === "teacher") {
                      navigate("/teacher-dashboard", { replace: true });
                    } else if (role === "admin") {
                      navigate("/admin", { replace: true });
                    } else {
                      navigate("/", { replace: true }); // fallback
                    }
                  }}
                >
                  Back
                </button>

        {/* === Mode Switch (ADMIN) === */}
        {role === "admin" && (
          <div className="mode-toggle">
            <label>
              View:{" "}
              <select value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value="students">Students</option>
                <option value="teachers">Teachers</option>
              </select>
            </label>
          </div>
        )}

        {/* === Mode Switch (TEACHER WITH RESTRICTION) === */}
        {role === "teacher" && (
          <div className="mode-toggle">
            <label>
              View:{" "}
              <select
                value={mode}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "teachers") {
                    setPopupMessage("You don’t have access to view teachers’ attendance.");
                    setMode("students");
                  } else setMode(v);
                }}
              >
                <option value="students">Students</option>
                <option value="teachers">Teachers</option>
              </select>
            </label>
          </div>
        )}

        {/* === Class Filter (ONLY FOR STUDENTS) === */}
        {mode === "students" && (
          <div className="filter-row">
            <label>
              Filter by Class:{" "}
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">All</option>
                {[1, 2, 3, 4, 5, 6, 7].map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        {/* === DATE SELECT === */}
        <div className="date-select">
          <label>Select Date: </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {/* === TABLE === */}
        {loading ? (
          <p>Loading...</p>
        ) : records.length === 0 ? (
          <p>No records found.</p>
        ) : (
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Name</th>
                {mode === "students" && <th>Admission Number</th>}
                <th>Class</th>
                <th>Mark Attendance</th>
                <th>Attendance %</th>
                <th>Status Today</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => {
                const present = attendanceMap[r._id] ?? false;

                return (
                  <tr key={r._id}>
                    <td>{r.name}</td>

                    {mode === "students" && <td>{r.admissionNumber || "N/A"}</td>}

                    <td>
                      {mode === "teachers"
                        ? (r.classes?.length ? r.classes.join(", ") : "N/A")
                        : (r.class || "N/A")}
                    </td>

                    {/* Attendance Toggle */}
                    <td>
                      <label className="attendance-switch">
                        <input
                          type="checkbox"
                          checked={present}
                          onChange={() => toggleAttendance(r._id)}
                        />
                        <span className="attendance-slider">
                          {present ? "Present" : "Absent"}
                        </span>
                      </label>
                    </td>

                    {/* Attendance Percentage */}
                    <td>{calculateAttendancePercentage(r.attendance)}%</td>

                    {/* Status Today */}
                    <td>
                {(selectedDate === new Date().toISOString().slice(0,10) && r._id in attendanceMap)
                  ? (attendanceMap[r._id] ? "Present" : "Absent")
                  : getTodayStatus(r.attendance, selectedDate)}
              </td>

                  </tr>
                );
              })}

            </tbody>
          </table>
        )}

        {/* === SUBMIT BUTTON === */}
        {records.length > 0 && (
          <button className="submit-btn" onClick={submitAttendance}>
            Submit Attendance
          </button>
        )}

        {/* === CONFIRM POPUP === */}
        {confirmVisible && (
          <div className="confirm-overlay">
            <div className="confirm-box">
              <p>Attendance already submitted. Do you want to submit again?</p>
              <div className="confirm-actions">
                <button onClick={handleConfirmedSubmit}>Yes</button>
                <button
                  onClick={() => setConfirmVisible(false)}
                  style={{ backgroundColor: "#ccc", color: "#333" }}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        <Popup message={popupMessage} onClose={() => setPopupMessage("")} />
      </div>
    </>
  );
}