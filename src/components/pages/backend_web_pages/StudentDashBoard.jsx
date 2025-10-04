import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Popup from "./Popup";
import LogoutButton from "./../backend_web_pages/LogoutButton";
import './../stylesheets/StudentDashBoard.css';
import { bottom } from "@popperjs/core";
const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [attendanceFilter, setAttendanceFilter] = useState("");
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    async function fetchStudentData() {
      try {
        const res = await api.get("/students/me"); // Adjust API if needed
        setStudentData(res.data);
        setFilteredAttendance(res.data.attendance || []);
      } catch {
        setPopupMessage("Failed to load data");
        setPopupVisible(true);
      }
    }
    fetchStudentData();
  }, []);

  const calcAttendancePercent = () => {
    if (!studentData?.attendance) return 0;
    const total = studentData.attendance.length;
    if (total === 0) return 0;
    const presentCount = studentData.attendance.filter((a) => a.present).length;
    return Math.round((presentCount / total) * 100);
  };

  useEffect(() => {
    if (!attendanceFilter || !studentData?.attendance) {
      setFilteredAttendance(studentData?.attendance || []);
    } else {
      setFilteredAttendance(
        studentData.attendance.filter((a) =>
          a.date ? a.date.startsWith(attendanceFilter) : false
        )
      );
    }
  }, [attendanceFilter, studentData]);

  if (!studentData) return <p>Loading your data...</p>;

  return (
    <div className="dashboard-container">
      <h1>Welcome <strong>{studentData.name}</strong></h1>
        <span> <LogoutButton /> </span>  
      <section>
        <h2>Personal Information</h2>
        <p>
          <strong>Name:</strong> {studentData.name || "-"}
        </p>
        <p>
          <strong>Admission Number:</strong> {studentData.admissionNumber || "-"}
        </p>
        <p>
          <strong>Class:</strong> {studentData.class || "-"}
        </p>

        <h2>Demographics</h2>
        <p><strong>DOB: </strong>{studentData?.demographics?.dob || "-"}</p>
        <p><strong>Gender: </strong>{studentData?.demographics?.gender || "-"}</p>
        <p><strong>Address: </strong>{studentData?.demographics?.address || "-"}</p>
        <p><strong>Phone: </strong>{studentData?.demographics?.phone || "-"}</p>

        <h2>Mother's Details</h2>
        <p><strong>Name: </strong>{studentData?.motherDetails?.name || "-"}</p>
        <p><strong>Phone: </strong>{studentData?.motherDetails?.phone || "-"}</p>
        <p><strong>Aadhaar: </strong>{studentData?.motherDetails?.aadhaarNumber || "-"}</p>
        <p><strong>Account Type: </strong>{studentData?.motherDetails?.bankAccountType || "-"}</p>
        <p><strong>Account Number: </strong>{studentData?.motherDetails?.accountNumber || "-"}</p>
        <p><strong>Bank Name: </strong>{studentData?.motherDetails?.bankName || "-"}</p>
        <p><strong>Branch: </strong>{studentData?.motherDetails?.branch || "-"}</p>
        <p><strong>IFSC Code: </strong>{studentData?.motherDetails?.ifsc || "-"}</p>



        <h2>Father's Details</h2>
        <p><strong>Name: </strong>{studentData?.fatherDetails?.name || "-"}</p>
        <p><strong>Phone: </strong>{studentData?.fatherDetails?.phone || "-"}</p>
        <p><strong>Aadhaar: </strong>{studentData?.fatherDetails?.aadhaarNumber || "-"}</p>
      </section>

      <section>
        <h2>Attendance Summary</h2>
        <p>Attendance Percentage: {calcAttendancePercent()}%</p>

        <label>
          Filter Attendance by Date:
          <input
            type="date"
            value={attendanceFilter}
            onChange={(e) => setAttendanceFilter(e.target.value)}
          />
        </label>
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance && filteredAttendance.length > 0 ? (
              filteredAttendance.map((att) => (
                <tr key={att.date}>
                  <td>{att.date || "-"}</td>
                  <td>{att.present ? "Present" : "Absent"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" style={{ textAlign: "center" }}>
                  No attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

        <section>
        <h2>Marks</h2>
        {studentData?.marks && studentData.marks.length > 0 ? (
            <table className="marks-table">
            <thead>
                <tr>
                <th>Subject</th>
                <th>FA1</th>
                <th>FA2</th>
                <th>FA3</th>
                <th>SA1</th>
                <th>SA2</th>
                <th>FE</th>
                </tr>
            </thead>
            <tbody>
                {studentData.marks.map((subject) => (
                <tr key={subject.subject}>
                    <td>{subject.subject || "-"}</td>
                    {["FA1", "FA2", "FA3", "SA1", "SA2", "FE"].map((type) => (
                    <td key={type}>
                        {subject.assessments && subject.assessments[type] != null
                        ? subject.assessments[type]
                        : "-"}
                    </td>
                    ))}
                </tr>
                ))}
                <tr style={{ fontWeight: 'bold', backgroundColor: '#eee' }}>
                <td>Total</td>
                {["FA1", "FA2", "FA3", "SA1", "SA2", "FE"].map((type) => {
                    const totalForAssessment = studentData.marks.reduce((sum, subj) => {
                    const val = subj.assessments?.[type];
                    return sum + (val != null ? val : 0);
                    }, 0);
                    return <td key={type}>{totalForAssessment}</td>;
                })}
                </tr>
            </tbody>
            </table>
        ) : (
            <p>No marks available.</p>
        )}
        </section>



      {popupVisible && (
        <Popup message={popupMessage} onClose={() => setPopupVisible(false)} />
      )}
    </div>
  );
};

export default StudentDashboard;