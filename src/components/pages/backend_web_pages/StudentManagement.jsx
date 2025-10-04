import React, { useState, useEffect } from "react";
import api from './../api/axios';
import Popup from './Popup';
import MarksEntry from "./MarksEntry";
import '../stylesheets/StudentManagement.css';

const emptyStudent = {
  email: "",
  password: "",
  name: "",
  admissionNumber: "",
  class: "",
  marks: [],
  dateOfAdmission: "",
  demographics: { dob: "", gender: "", address: "", phone: "" },
  motherDetails: {
    name: "",
    phone: "",
    aadharNumber: "",
    bankAccountType: "",
    accountNumber: "",
    bankName: "",
    branch: "",
    ifsc: ""
  },
  fatherDetails: { name: "", phone: "", aadharNumber: "" }
};

const StudentManagement = ({ onClose }) => {
  const [students, setStudents] = useState([]);
  const [filterClass, setFilterClass] = useState("");
  const [classes, setClasses] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [studentForm, setStudentForm] = useState(emptyStudent);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [createMode, setCreateMode] = useState(false);

  const getYesterday = () => {
    let d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString();
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await api.get('/teachers/students');
        setStudents(res.data);
        const clsSet = new Set(res.data.map(s => s.class?.trim()).filter(c => c));
        setClasses([...clsSet].sort());

        const attMap = {};
        const yest = getYesterday().slice(0, 10);
        res.data.forEach(s => {
          const att = s.attendance?.find(a => a.date?.startsWith(yest));
          attMap[s._id] = att ? att.present : false;
        });
        setAttendanceMap(attMap);
      } catch {
        setMessage("Failed to load students");
      }
    }
    fetchStudents();
  }, []);

  const filteredStudents = filterClass ? students.filter(s => s.class?.trim() === filterClass) : students;

  const toggleAttendance = (id) => {
    setAttendanceMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const submitAttendance = async () => {
    setSubmitting(true);
    try {
      const nowISO = new Date().toISOString();
      const updates = Object.entries(attendanceMap).map(([id, present]) =>
        api.put(`/students/${id}/attendance`, { date: nowISO, present })
      );
      await Promise.all(updates);
      setMessage("Attendance updated successfully.");
    } catch {
      setMessage("Failed to update attendance.");
    }
    setSubmitting(false);
  };

  const openCreate = () => {
    setEditId(null);
    setStudentForm(emptyStudent);
    setCreateMode(true);
  };

  const openEdit = (student) => {
    const copy = JSON.parse(JSON.stringify(student));
    copy.demographics = copy.demographics || emptyStudent.demographics;
    copy.motherDetails = copy.motherDetails || emptyStudent.motherDetails;
    copy.fatherDetails = copy.fatherDetails || emptyStudent.fatherDetails;
    if (copy.dateOfAdmission) copy.dateOfAdmission = new Date(copy.dateOfAdmission).toISOString().slice(0, 10);
    setEditId(student._id);
    setStudentForm(copy);
    setCreateMode(false);
  };

  const cancelEdit = () => {
    setEditId(null);
    setStudentForm(emptyStudent);
  };

  const cancelCreate = () => {
    setCreateMode(false);
    setStudentForm(emptyStudent);
  };

  const handleChange = (section, field, value) => {
    if (section) {
      setStudentForm(form => ({
        ...form,
        [section]: {
          ...form[section],
          [field]: value
        }
      }));
    } else {
      setStudentForm(form => ({
        ...form,
        [field]: value
      }));
    }
  };

  const handleMarksChange = (updatedMarks) => {
    setStudentForm(form => ({
      ...form,
      marks: updatedMarks
    }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (!editId && (!studentForm.email || !studentForm.password)) {
        setMessage("Email and password are required");
        setSubmitting(false);
        return;
      }

      let payload = { ...studentForm };
      if (editId) {
        delete payload.email;
        delete payload.password;
        await api.put(`/students/${editId}`, payload);
        setMessage("Student updated successfully.");
      } else {
        await api.post("/students", {
          email: studentForm.email,
          password: studentForm.password,
          details: payload
        });
        setMessage("Student created successfully.");
        setCreateMode(false);
      }

      const res = await api.get("/teachers/students");
      setStudents(res.data);
      setStudentForm(emptyStudent);
      setEditId(null);

    } catch (err) {
      setMessage(err.response?.data?.error || "Submission failed.");
    }
    setSubmitting(false);
  };

  if (!students) return <p>Loading students...</p>;

  return (
    <div>
      <button onClick={onClose}>Back to Dashboard</button>
      <h1>Student Management</h1>

      {/* Uncomment to filter by class */}
      {/* <label>Filter by Class:
        <select value={filterClass} onChange={e => setFilterClass(e.target.value)}>
          <option value="">All</option>
          {classes.map(cls => <option key={cls} value={cls}>{cls}</option>)}
        </select>
      </label> */}

      {(editId !== null || createMode) && (
        <form onSubmit={submitForm}>
          {!editId && <>
            <label>Email
              <input type="email" value={studentForm.email} onChange={e => handleChange(null, 'email', e.target.value)} required disabled={submitting} />
            </label>
            <label>Password
              <input type="password" value={studentForm.password} onChange={e => handleChange(null, 'password', e.target.value)} required disabled={submitting} />
            </label>
          </>}
          <label>Name
            <input type="text" value={studentForm.name} onChange={e => handleChange(null, 'name', e.target.value)} required disabled={submitting} />
          </label>
          <label>Admission Number
            <input type="text" value={studentForm.admissionNumber} onChange={e => handleChange(null, 'admissionNumber', e.target.value)} required disabled={submitting} />
          </label>
          <label>Class
            <input type="text" value={studentForm.class} onChange={e => handleChange(null, 'class', e.target.value)} required disabled={submitting} />
          </label>
          <label>Date of Admission
            <input type="date" value={studentForm.dateOfAdmission} onChange={e => handleChange(null, 'dateOfAdmission', e.target.value)} required disabled={submitting} />
          </label>

          <h3>Demographics</h3>
          <label>DOB
            <input type="date" value={studentForm.demographics.dob} onChange={e => handleChange('demographics', 'dob', e.target.value)} disabled={submitting} />
          </label>
          <label>Gender
            <input type="text" value={studentForm.demographics.gender} onChange={e => handleChange('demographics', 'gender', e.target.value)} disabled={submitting} />
          </label>
          <label>Address
            <input type="text" value={studentForm.demographics.address} onChange={e => handleChange('demographics', 'address', e.target.value)} disabled={submitting} />
          </label>
          <label>Phone
            <input type="text" value={studentForm.demographics.phone} onChange={e => handleChange('demographics', 'phone', e.target.value)} disabled={submitting} />
          </label>

          <h3>Mother Details</h3>
          <label>Name
            <input type="text" value={studentForm.motherDetails.name} onChange={e => handleChange('motherDetails', 'name', e.target.value)} disabled={submitting} />
          </label>
          <label>Phone
            <input type="text" value={studentForm.motherDetails.phone} onChange={e => handleChange('motherDetails', 'phone', e.target.value)} disabled={submitting} />
          </label>
          <label>Aadhaar Number
            <input type="text" value={studentForm.motherDetails.aadharNumber} onChange={e => handleChange('motherDetails', 'aadharNumber', e.target.value)} disabled={submitting} />
          </label>
          <label>Bank Account Type
            <select value={studentForm.motherDetails.bankAccountType} onChange={e => handleChange('motherDetails', 'bankAccountType', e.target.value)} disabled={submitting}>
              <option value="">Select</option>
              <option value="Savings">Savings</option>
              <option value="Current">Current</option>
            </select>
          </label>
          <label>Account Number
            <input type="text" value={studentForm.motherDetails.accountNumber} onChange={e => handleChange('motherDetails', 'accountNumber', e.target.value)} disabled={submitting} />
          </label>
          <label>Bank Name
            <input type="text" value={studentForm.motherDetails.bankName} onChange={e => handleChange('motherDetails', 'bankName', e.target.value)} disabled={submitting} />
          </label>
          <label>Branch
            <input type="text" value={studentForm.motherDetails.branch} onChange={e => handleChange('motherDetails', 'branch', e.target.value)} disabled={submitting} />
          </label>
          <label>IFSC
            <input type="text" value={studentForm.motherDetails.ifsc} onChange={e => handleChange('motherDetails', 'ifsc', e.target.value)} disabled={submitting} />
          </label>

          <h3>Father Details</h3>
          <label>Name
            <input type="text" value={studentForm.fatherDetails.name} onChange={e => handleChange('fatherDetails', 'name', e.target.value)} disabled={submitting} />
          </label>
          <label>Phone
            <input type="text" value={studentForm.fatherDetails.phone} onChange={e => handleChange('fatherDetails', 'phone', e.target.value)} disabled={submitting} />
          </label>
          <label>Aadhaar Number
            <input type="text" value={studentForm.fatherDetails.aadharNumber} onChange={e => handleChange('fatherDetails', 'aadharNumber', e.target.value)} disabled={submitting} />
          </label>

          <MarksEntry marks={studentForm.marks} onChange={handleMarksChange} disabled={submitting} />

          <button type="submit" disabled={submitting}>{editId ? "Update" : "Create"}</button>
          <button type="button" onClick={editId ? cancelEdit : cancelCreate} disabled={submitting} style={{ marginLeft: 10 }}>Cancel</button>
        </form>
      )}

      {!editId && !createMode && (
        <>
          <button onClick={openCreate} className="create-btn">Create New Student</button>

          {filteredStudents.length === 0 ? (
            <p>No students found.</p>
          ) : (
            <>
              <table className="student-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Admission No.</th>
                    <th>Class</th>
                    <th>Present</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map(student => {
                    const totalDays = student.attendance?.length || 0;
                    const presentDays = student.attendance?.filter(a => a.present).length || 0;
                    const attendancePercent = totalDays ? Math.round((presentDays / totalDays) * 100) : 0;
                    return (
                      <tr key={student._id}>
                        <td>{student.name || '-'}</td>
                        <td>{student.admissionNumber || '-'}</td>
                        <td>{student.class || 'N/A'}</td>
                        <td>
                          <label className="attendance-switch">
                            <input
                              type="checkbox"
                              checked={attendanceMap[student._id] ?? false}
                              onChange={() => toggleAttendance(student._id)}
                              disabled={submitting}
                            />
                            <span className="attendance-slider">{attendanceMap[student._id] ? "Present" : "Absent"}</span>
                          </label>
                        </td>
                        <td><button onClick={() => openEdit(student)} disabled={submitting}>Edit</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <button onClick={submitAttendance} disabled={submitting}>Submit Attendance</button>
            </>
          )}
        </>
      )}

      <Popup message={message} onClose={() => setMessage('')} />
    </div>
  );
};

export default StudentManagement;
