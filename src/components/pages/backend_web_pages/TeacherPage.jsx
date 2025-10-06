import React, { useState, useEffect } from 'react';
import api from './../api/axios';
import Popup from './Popup';
import '../stylesheets/TeacherPage.css';
import Navbar from './Navbar';

const TeacherPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [popupMessage, setPopupMessage] = useState('');
  const [attendanceMap, setAttendanceMap] = useState({});
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().substring(0, 10));

  const [createMode, setCreateMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState(null);

  const initialTeacherData = {
    name: '',
    email: '',
    phone: '',
    subject: '',
  };

  const [newTeacher, setNewTeacher] = useState({ ...initialTeacherData });
  const [editTeacher, setEditTeacher] = useState({ ...initialTeacherData });
  const [password, setPassword] = useState('');

  useEffect(() => {
    fetchTeachers();
  }, []);

  async function fetchTeachers() {
    try {
      const res = await api.get('/admins/teachers');
      setTeachers(res.data || []);
    } catch {
      setPopupMessage('Failed to load teachers');
    }
  }

  const toggleAttendance = (teacherId) => {
    setAttendanceMap((prev) => ({ ...prev, [teacherId]: !prev[teacherId] }));
  };

  async function submitAttendance() {
    try {
      const promises = Object.entries(attendanceMap).map(([id, present]) =>
        api.put(`/admins/teachers/attendance/${id}`, {
          date: attendanceDate,
          present,
        })
      );
      await Promise.all(promises);
      setPopupMessage('Teacher attendance uploaded successfully');
      setAttendanceMap({});
    } catch {
      setPopupMessage('Error uploading teacher attendance');
    }
  }

  function handleInputChange(setter, data, field, value) {
    setter({ ...data, [field]: value });
  }

  async function submitNewTeacher(e) {
    e.preventDefault();

    if (!newTeacher.email || newTeacher.email.trim() === '') {
      setPopupMessage('Email is required');
      return;
    }
    if (!password) {
      setPopupMessage('Password is required');
      return;
    }

    try {
      await api.post('/admins/register', {
        email: newTeacher.email,
        password,
        role: 'teacher',
        details: { ...newTeacher },
      });
      setPopupMessage('Teacher created successfully');
      setNewTeacher({ ...initialTeacherData });
      setPassword('');
      setCreateMode(false);
      fetchTeachers();
    } catch (error) {
      console.error('Error creating teacher:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Unknown error';
      setPopupMessage('Error creating teacher: ' + errorMsg);
    }
  }

  function startEditing(teacher) {
    setEditTeacher({
      name: teacher.name || '',
      email: teacher.email || '',
      phone: teacher.phone || '',
      subject: teacher.subject || '',
    });
    setEditingTeacherId(teacher._id);
    setEditMode(true);
    setCreateMode(false);
  }

  async function submitEditTeacher(e) {
    e.preventDefault();
    try {
      await api.put(`/admins/teacher/${editingTeacherId}`, editTeacher);
      setPopupMessage('Teacher updated successfully');
      setEditTeacher({ ...initialTeacherData });
      setEditingTeacherId(null);
      setEditMode(false);
      fetchTeachers();
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.error || error.message || 'Unknown error';
      setPopupMessage('Error updating teacher: ' + errorMsg);
    }
  }

  function cancelEdit() {
    setEditMode(false);
    setEditingTeacherId(null);
  }

  function calculateAttendancePercentage(attendance) {
    if (!attendance || attendance.length === 0) return "0.00";
    const presentDays = attendance.filter((record) => record.present).length;
    return ((presentDays / attendance.length) * 100).toFixed(2);
  }

  return (
    <>
      <Navbar />
      
    <div className="page-container">
      <h1>Teacher Management</h1>

      <label>
        Attendance Date:
        <input type="date" value={attendanceDate} onChange={(e) => setAttendanceDate(e.target.value)} />
      </label>

      {(createMode || editMode) && (
        <form onSubmit={editMode ? submitEditTeacher : submitNewTeacher} className="edit-form">
          <h3>{editMode ? 'Update Teacher' : 'Create New Teacher'}</h3>

          <label>Name</label>
          <input
            type="text"
            value={editMode ? editTeacher.name : newTeacher.name}
            onChange={(e) =>
              editMode ? setEditTeacher({ ...editTeacher, name: e.target.value }) : setNewTeacher({ ...newTeacher, name: e.target.value })
            }
            required
          />

          {!editMode && (
            <>
              <label>Email</label>
              <input type="email" value={newTeacher.email} onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })} required />

              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </>
          )}

          {editMode && (
            <>
              <label>Email</label>
              <input type="email" value={editTeacher.email} onChange={(e) => setEditTeacher({ ...editTeacher, email: e.target.value })} required />
            </>
          )}

          <label>Phone</label>
          <input
            type="text"
            value={editMode ? editTeacher.phone : newTeacher.phone}
            onChange={(e) =>
              editMode ? setEditTeacher({ ...editTeacher, phone: e.target.value }) : setNewTeacher({ ...newTeacher, phone: e.target.value })
            }
          />

          <label>Subject</label>
          <input
            type="text"
            value={editMode ? editTeacher.subject : newTeacher.subject}
            onChange={(e) =>
              editMode ? setEditTeacher({ ...editTeacher, subject: e.target.value }) : setNewTeacher({ ...newTeacher, subject: e.target.value })
            }
          />

          <div className="edit-form-buttons">
            <button type="submit">{editMode ? 'Update' : 'Create'}</button>
            <button type="button" onClick={() => (editMode ? cancelEdit() : setCreateMode(false))}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {!createMode && !editMode && (
        <button className="create-btn" onClick={() => setCreateMode(true)}>
          Create New Teacher
        </button>
      )}

      <h2>Mark Attendance</h2>
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Attendance</th>
            <th>Status</th>
            <th>Attendance %</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {teachers.length === 0 ? (
            <tr>
              <td colSpan="5">No teachers available.</td>
            </tr>
          ) : (
            teachers.map((teacher) => {
              const present = attendanceMap[teacher._id] ?? false;
              return (
                <tr key={teacher._id}>
                  <td>{teacher.name}</td>
                  <td>
                    <label className="attendance-switch">
                      <input type="checkbox" checked={present} onChange={() => toggleAttendance(teacher._id)} />
                      <span className="attendance-slider">{present ? 'Present' : 'Absent'}</span>
                    </label>
                  </td>
                  <td>{present ? 'Present' : 'Absent'}</td>
                  <td>{calculateAttendancePercentage(teacher.attendance)}%</td>
                  <td>
                    <button onClick={() => startEditing(teacher)}>Edit</button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {teachers.length > 0 && <button onClick={submitAttendance}>Submit Attendance</button>}

      {popupMessage && <Popup message={popupMessage} onClose={() => setPopupMessage('')} />}
    </div>
    </>
  );
};

export default TeacherPage;
