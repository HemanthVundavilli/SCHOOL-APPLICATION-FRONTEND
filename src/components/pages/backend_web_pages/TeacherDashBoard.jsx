import React, { useState, useEffect } from "react";
import api from './../api/axios';
import Popup from './Popup';
import LogoutButton from './../backend_web_pages/LogoutButton';
import StudentManagement from "./StudentManagement";
import { useNavigate } from 'react-router-dom';
import '../stylesheets/TeacherDashBoard.css';
import Navbar from './Navbar';

const TeacherDashboard = () => {
  const [teacher, setTeacher] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [showStudents, setShowStudents] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const Popup = ({ message, onClose }) => {
    if (!message) return null;
    return (
      <div className="popup-message" onClick={onClose}>
        {message}
      </div>
    );
  };
const navigate = useNavigate();

  useEffect(() => {
    
    async function fetchData() {
      try {
        const resTeacher = await api.get('/teachers/me');
        setTeacher(resTeacher.data);

        const resAttendance = await api.get('/teachers/attendance');
        setAttendance(resAttendance.data);
      } catch (e) {
        setPopupMessage("Error loading teacher data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

if (loading) return <div>Loading...</div>;
if (!loading && !teacher) return <div>Teacher data unavailable.</div>;

  const attendancePercentage = attendance.length === 0 ? 0 :
    Math.round(attendance.filter(a => a.present).length * 100 / attendance.length);

  return (
    <>
    <Navbar />
  
    <div className="dashboard-container">

  
      <h1>Welcome, {teacher.name}</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'right' }}>
          < LogoutButton />
      </div>
      <p>Email: {teacher.email}</p>
      <p>Phone: {teacher.phone || 'N/A'}</p>
      <p>Subjects: {teacher.subjects?.length ? teacher.subjects.join(", ") : teacher.subject || 'N/A'}</p>
      <p>Classes: {teacher.classes?.length ? teacher.classes.join(", ") : 'N/A'}</p>

      <section className="attendance-section">
        <h2>Your Attendance</h2>
        <p>Attendance Percentage: {attendancePercentage}%</p>
        <table>
          <thead>
            <tr><th>Date</th><th>Status</th></tr>
          </thead>
          <tbody>
            {attendance.map(({ _id, date, present }) => (
              <tr key={_id}>
                <td>{new Date(date).toLocaleDateString()}</td>
                <td style={{ color: present ? 'green' : 'red' }}>{present ? "Present" : "Absent"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <button onClick={() => navigate('/teacher/studentsmanagement')}>Manage Students</button>
      {showStudents && <StudentManagement onClose={() => setShowStudents(false)} />}



      <Popup message={popupMessage} onClose={() => setPopupMessage("")} />
    </div>
    </>
  );
};

export default TeacherDashboard;
