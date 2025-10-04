import React, { useState, useEffect } from 'react';
import api from './../api/axios';
import Popup from './Popup';

const CommonAttendancePage = ({ userRole }) => {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [teacherAttendance, setTeacherAttendance] = useState({});
  const [studentAttendance, setStudentAttendance] = useState({});
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().substring(0,10));
  const [popupMessage, setPopupMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(userRole === 'admin' ? 'teachers' : 'students');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (userRole === 'admin') {
          const [teachRes, studRes] = await Promise.all([
            api.get('/admins/teachers'),
            api.get('/admins/students')
          ]);
          setTeachers(teachRes.data || []);
          setStudents(studRes.data || []);
          initAttendance(teachRes.data, setTeacherAttendance);
          initAttendance(studRes.data, setStudentAttendance);
        } else if (userRole === 'teacher') {
          const studRes = await api.get('/teachers/students');
          setStudents(studRes.data || []);
          initAttendance(studRes.data, setStudentAttendance);
        }
      } catch {
        setPopupMessage('Error loading attendance data');
      } finally {
        setLoading(false);
      }
    };

    const initAttendance = (list, setter) => {
      const map = {};
      list.forEach(item => {
        const att = (item.attendance || []).find(a => a.date && a.date.startsWith(attendanceDate));
        map[item._id] = att ? att.present : false;
      });
      setter(map);
    };

    fetchData();
  }, [attendanceDate, userRole]);

  const toggleTeacher = (id) => setTeacherAttendance(prev => ({...prev, [id]: !prev[id]}));
  const toggleStudent = (id) => setStudentAttendance(prev => ({...prev, [id]: !prev[id]}));

  const submitTeacherAttendance = async () => {
    try {
      await Promise.all(Object.entries(teacherAttendance).map(([id, present]) =>
        api.put(`/teachers/${id}/attendance`, { date: attendanceDate, present })
      ));
      setPopupMessage('Teacher attendance updated');
    } catch {
      setPopupMessage('Failed to update teacher attendance');
    }
  };

  const submitStudentAttendance = async () => {
    try {
      await Promise.all(Object.entries(studentAttendance).map(([id, present]) =>
        api.put(`/students/${id}/attendance`, { date: attendanceDate, present })
      ));
      setPopupMessage('Student attendance updated');
    } catch {
      setPopupMessage('Failed to update student attendance');
    }
  };

  if (loading) return <div>Loading attendance...</div>;

  return (
    <div className="attendance-container">
      <h1>Attendance Marking</h1>
      <label>
        Attendance Date: 
        <input 
          type="date"
          value={attendanceDate}
          onChange={e => setAttendanceDate(e.target.value)}
        />
      </label>

      {userRole === 'admin' && (
        <div className="tabs">
          <button onClick={() => setActiveTab('teachers')} disabled={activeTab === 'teachers'}>Teachers</button>
          <button onClick={() => setActiveTab('students')} disabled={activeTab === 'students'}>Students</button>
        </div>
      )}

      {activeTab === 'teachers' && userRole === 'admin' && (
        <>
          <h2>Teachers Attendance</h2>
          {teachers.length === 0 ? <p>No teachers found.</p> : (
            <table>
              <thead><tr><th>Name</th><th>Present</th></tr></thead>
              <tbody>
                {teachers.map(t => (
                  <tr key={t._id}>
                    <td>{t.name}</td>
                    <td>
                      <input type="checkbox" checked={teacherAttendance[t._id] || false} onChange={() => toggleTeacher(t._id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button onClick={submitTeacherAttendance}>Submit Teacher Attendance</button>
        </>
      )}

      {activeTab === 'students' && (
        <>
          <h2>Students Attendance</h2>
          {students.length === 0 ? <p>No students found.</p> : (
            <table>
              <thead><tr><th>Name</th><th>Present</th></tr></thead>
              <tbody>
                {students.map(s => (
                  <tr key={s._id}>
                    <td>{s.name}</td>
                    <td>
                      <input type="checkbox" checked={studentAttendance[s._id] || false} onChange={() => toggleStudent(s._id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button onClick={submitStudentAttendance}>Submit Student Attendance</button>
        </>
      )}

      <Popup message={popupMessage} onClose={() => setPopupMessage('')} />
    </div>
  );
};

export default CommonAttendancePage;