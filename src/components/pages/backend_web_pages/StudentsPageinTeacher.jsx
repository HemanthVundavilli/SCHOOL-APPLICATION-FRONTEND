import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../stylesheets/StudentsPageinTeacher.css";
import Popup from "./Popup";
import MarksEntry from "./../backend_web_pages/MarksEntry";

{/* import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../stylesheets/StudentsPageinTeacher.css";
import Popup from "./Popup";
import MarksEntry from "./../backend_web_pages/MarksEntry";

const StudentPageinTeacher = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filterClass, setFilterClass] = useState("");
  const [attendanceMap, setAttendanceMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [attendanceSubmitted, setAttendanceSubmitted] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editStudent, setEditStudent] = useState(null);

  const [createStudentMode, setCreateStudentMode] = useState(false);

  const initialStudent = {
    name: "",
    admissionNumber: "",
    class: "",
    dateOfAdmission: "",
    demographics: { dob: "", gender: "", address: "", phone: "" },
    motherDetails: { name: "", phone: "", aadharNumber: "", bankAccountType: "", accountNumber: "", bankName: "", branch: "", ifsc: "" },
    fatherDetails: { name: "", phone: "", aadharNumber: "" },
  };

  const [newStudent, setNewStudent] = useState({ ...initialStudent });
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const showPopup = (msg) => {
    setPopupMessage(msg);
    setPopupVisible(true);
  };

  async function fetchStudents() {
    try {
      const res = await api.get("/teachers/students");
      const data = Array.isArray(res.data) ? res.data : [];
      setStudents(data);
      const unique = Array.from(new Set(data.map(s => s.class).filter(Boolean))).sort();
      setClasses(unique);

      const attendanceInit = {};
      const today = new Date().toISOString().slice(0, 10);
      data.forEach(student => {
        const att = student.attendance?.find(a => a.date?.startsWith(today));
        attendanceInit[student._id] = att ? att.present : false;
      });
      setAttendanceMap(attendanceInit);
      setLoading(false);
    } catch {
      setError("Failed to load students");
      setLoading(false);
    }
  }

  const filteredStudents = filterClass ? students.filter(s => s.class === filterClass) : students;

  const toggleAttendance = (id) => {
    setAttendanceMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  async function submitAttendance() {
    try {
      const currentDateTime = new Date().toISOString();
      const updates = Object.entries(attendanceMap).map(([id, present]) =>
        api.put(`/students/attendance/${id}`, { date: currentDateTime, present })
      );
      await Promise.all(updates);
      showPopup("Attendance updated successfully");
      setAttendanceSubmitted(true);
    } catch {
      showPopup("Failed to update attendance");
    }
  }

  const startEdit = (student) => {
    const studentCopy = JSON.parse(JSON.stringify(student));
    studentCopy.fatherDetails = studentCopy.fatherDetails || { name: "", phone: "", aadharNumber: "" };
    studentCopy.motherDetails = studentCopy.motherDetails || { name: "", phone: "", aadharNumber: "", bankAccountType: "", accountNumber: "", bankName: "", branch: "", ifsc: "" };
    studentCopy.demographics = studentCopy.demographics || { dob: "", gender: "", address: "", phone: "" };
    setEditingId(student._id);
    setEditStudent(studentCopy);
    setCreateStudentMode(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditStudent(null);
  };

  function handleChange(setter, stateObj, section, key, value) {
    if (!section) {
      setter({ ...stateObj, [key]: value });
    } else {
      setter({ ...stateObj, [section]: { ...stateObj[section], [key]: value } });
    }
  }

  async function submitEdit(e) {
    e.preventDefault();
    try {
      await api.put(`/students/${editingId}`, editStudent);
      showPopup("Student updated successfully");
      cancelEdit();
      fetchStudents();
    } catch (error) {
      showPopup(error.response?.data?.error || "Failed to update student");
    }
  }

  const startCreate = () => {
    setCreateStudentMode(true);
    setEditingId(null);
    setEditStudent(null);
    setNewStudent({ ...initialStudent });
    setNewEmail("");
    setNewPassword("");
  };

  async function submitCreate(e) {
    e.preventDefault();
    try {
      await api.post("/students", { email: newEmail, password: newPassword, details: newStudent });
      showPopup("Student created successfully");
      setCreateStudentMode(false);
      fetchStudents();
      setNewEmail("");
      setNewPassword("");
      setNewStudent({ ...initialStudent });
    } catch (e) {
      showPopup(e.response?.data?.error || "Error creating student");
    }
  }

  const cancelCreate = () => {
    setCreateStudentMode(false);
  };

  if (loading) return <div>Loading students...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="page-container">
      <h1>Student Management</h1>

      <label>
        Filter by Class:
        <select value={filterClass} onChange={e => setFilterClass(e.target.value)}>
          <option value="">All</option>
          {classes.map(cls => <option key={cls} value={cls}>{cls}</option>)}
        </select>
      </label>

      <div className="forms-container">
        {(createStudentMode || editStudent) && (
          <form onSubmit={editStudent ? submitEdit : submitCreate} className="form">
            {!editStudent && <>
              <label>Email
                <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} required />
              </label>
              <label>Password
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
              </label>
            </>}

            <label>Name
              <input type="text" value={editStudent ? editStudent.name : newStudent.name} onChange={e => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, null, "name", e.target.value)} required />
            </label>

            <label>Admission Number
              <input type="text" value={editStudent ? editStudent.admissionNumber : newStudent.admissionNumber} onChange={e => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, null, "admissionNumber", e.target.value)} required />
            </label>

            <label>Class
              <input type="text" value={editStudent ? editStudent.class : newStudent.class} onChange={e => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, null, "class", e.target.value)} required />
            </label>

            <label>Admission Date
              <input type="date" value={editStudent ? editStudent.dateOfAdmission?.slice(0, 10) : newStudent.dateOfAdmission} onChange={e => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, null, "dateOfAdmission", e.target.value)} required />
            </label>

            <h4>Demographics</h4>
            <label>DOB
              <input type="date" value={editStudent ? editStudent.demographics.dob?.slice(0, 10) : newStudent.demographics.dob} onChange={e => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, "demographics", "dob", e.target.value)} />
            </label>
            <label>Gender
              <input type="text" value={editStudent ? editStudent.demographics.gender : newStudent.demographics.gender} onChange={e => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, "demographics", "gender", e.target.value)} />
            </label>
            <label>Address
              <input type="text" value={editStudent ? editStudent.demographics.address : newStudent.demographics.address} onChange={e => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, "demographics", "address", e.target.value)} />
            </label>
            <label>Phone
              <input type="text" value={editStudent ? editStudent.demographics.phone : newStudent.demographics.phone} onChange={e => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, "demographics", "phone", e.target.value)} />
            </label>

            <h4>Mother Details</h4>
            <label>Name
              <input type="text" value={editStudent ? editStudent.motherDetails.name : newStudent.motherDetails.name} onChange={e => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, "motherDetails", "name", e.target.value)} />
            </label>
            <label>Phone
              <input type="text" value={editStudent ? editStudent.motherDetails.phone : newStudent.motherDetails.phone} onChange={e => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, "motherDetails", "phone", e.target.value)} />
            </label>
            <label>Aadhaar Number
              <input type="text" value={editStudent ? editStudent.motherDetails.aadharNumber : newStudent.motherDetails.aadharNumber} onChange={e => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, "motherDetails", "aadharNumber", e.target.value)} />
            </label>
            <label>Bank Account Type
              <select value={editStudent ? editStudent.motherDetails.bankAccountType : newStudent.motherDetails.bankAccountType} onChange={e => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, "motherDetails", "bankAccountType", e.target.value)}>
                <option value="">Select</option>
                <option value="Savings">Savings</option>
                <option value="Current">Current</option>
              </select>
            </label>
            <label>Account Number
              <input type="text" value={editStudent ? editStudent.motherDetails.accountNumber : newStudent.motherDetails.accountNumber} onChange={e => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, "motherDetails", "accountNumber", e.target.value)} />
            </label>
            <label>Bank Name
              <input type="text" value={editStudent ? editStudent.motherDetails.bankName : newStudent.motherDetails.bankName} onChange={e => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, "motherDetails", "bankName", e.target.value)} />
            </label>
            <label>Branch
              <input type="text" value={editStudent ? editStudent.motherDetails.branch : newStudent.motherDetails.branch} onChange={e => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, "motherDetails", "branch", e.target.value)} />
            </label>
            <label>IFSC
              <input type="text" value={editStudent ? editStudent.motherDetails.ifsc : newStudent.motherDetails.ifsc} onChange={e => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, "motherDetails", "ifsc", e.target.value)} />
            </label>

            <h4>Father Details</h4>
            <label>Name
              <input type="text" value={editStudent ? editStudent.fatherDetails.name : newStudent.fatherDetails.name} onChange={e => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, "fatherDetails", "name", e.target.value)} />
            </label>
            <label>Phone
              <input type="text" value={editStudent ? editStudent.fatherDetails.phone : newStudent.fatherDetails.phone} onChange={e => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, "fatherDetails", "phone", e.target.value)} />
            </label>
            <label>Aadhaar Number
              <input type="text" value={editStudent ? editStudent.fatherDetails.aadharNumber : newStudent.fatherDetails.aadharNumber} onChange={e => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, "fatherDetails", "aadharNumber", e.target.value)} />
            </label>

            <MarksEntry marks={editStudent ? editStudent.marks : newStudent.marks} />

            <button type="submit" >{editStudent ? "Update" : "Create"}</button>
            <button type="button" onClick={editStudent ? cancelEdit : cancelCreate} style={{ marginLeft: 10 }}>Cancel</button>
          </form>
        )}
      </div>

      {!createStudentMode && !editStudent && (
        <>
          <button className="create-btn">Create New Student</button>

          <h2>Students List</h2>

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
                          
                        />
                        <span className="attendance-slider">{attendanceMap[student._id] ? "Present" : "Absent"}</span>
                      </label>
                    </td>
                    <td><button>Edit</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <button onClick={submitAttendance} className="submit-btn" >
            {attendanceSubmitted ? "Update Attendance" : "Submit Attendance"}
          </button>

          <button onClick={() => navigate('/marks-entry')}>
            Enter/Edit Marks
          </button>
        </>
      )}

      {popupVisible && <Popup message={popupMessage} onClose={() => setPopupVisible(false)} />}
    </div>
  );
};

export default StudentPageinTeacher;
*/}


const StudentPageinTeacher = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filterClass, setFilterClass] = useState("");
  const [attendanceMap, setAttendanceMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [attendanceSubmitted, setAttendanceSubmitted] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editStudent, setEditStudent] = useState(null);

  // State to track MarksEntry visibility inside form
  const [showMarksEntry, setShowMarksEntry] = useState(false);

  const [createStudentMode, setCreateStudentMode] = useState(false);

  const initialStudent = {
    name: "",
    admissionNumber: "",
    class: "",
    dateAdmission: "",
    demographics: { dob: "", gender: "", address: "", phone: "" },
    motherDetails: {
      name: "",
      phone: "",
      aadharNumber: "",
      bankAccountType: "",
      accountNumber: "",
      bankName: "",
      branch: "",
      ifsc: "",
    },
    fatherDetails: { name: "", phone: "", aadharNumber: "" },
    marks: [],
  };

  const [newStudent, setNewStudent] = useState({ ...initialStudent });
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const showPopup = (msg) => {
    setPopupMessage(msg);
    setPopupVisible(true);
  };

  async function fetchStudents() {
    try {
      const res = await api.get("/teachers/students");
      const data = Array.isArray(res.data) ? res.data : [];
      setStudents(data);
      const unique = Array.from(new Set(data.map((s) => s.class).filter(Boolean))).sort();
      setClasses(unique);

      const attendanceInit = {};
      const today = new Date().toISOString().slice(0, 10);
      data.forEach((student) => {
        const att = student.attendance?.find((a) => a.date?.startsWith(today));
        attendanceInit[student._id] = att ? att.present : false;
      });
      setAttendanceMap(attendanceInit);
      setLoading(false);
    } catch {
      setError("Failed to load students");
      setLoading(false);
    }
  }

  const filteredStudents = filterClass ? students.filter((s) => s.class === filterClass) : students;

  const toggleAttendance = (id) => {
    setAttendanceMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  async function submitAttendance() {
    try {
      const now = new Date().toISOString();
      const updates = Object.entries(attendanceMap).map(([id, present]) =>
        api.put(`/students/attendance/${id}`, { date: now, present })
      );
      await Promise.all(updates);
      showPopup("Attendance updated successfully");
      setAttendanceSubmitted(true);
    } catch {
      showPopup("Failed to update attendance");
    }
  }

  const openCreate = () => {
    setEditingId(null);
    setEditStudent(null);
    setCreateStudentMode(true);
    setShowMarksEntry(false);
    setNewStudent({ ...initialStudent });
    setNewEmail("");
    setNewPassword("");
  };

  const openEdit = (student) => {
    const copy = JSON.parse(JSON.stringify(student));
    copy.marks = copy.marks || [];
    copy.demographics = copy.demographics || initialStudent.demographics;
    copy.motherDetails = copy.motherDetails || initialStudent.motherDetails;
    copy.fatherDetails = copy.fatherDetails || initialStudent.fatherDetails;
    if (copy.dateAdmission) copy.dateAdmission = copy.dateAdmission.slice(0, 10);

    setEditingId(student._id);
    setEditStudent(copy);
    setCreateStudentMode(false);
    setShowMarksEntry(true); // Show marks editing when editing a student
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditStudent(null);
    setShowMarksEntry(false);
  };

  const cancelCreate = () => {
    setCreateStudentMode(false);
    setShowMarksEntry(false);
  };

  function handleChange(setter, stateObj, section, key, value) {
    if (!section) {
      setter({ ...stateObj, [key]: value });
    } else {
      setter({ ...stateObj, [section]: { ...stateObj[section], [key]: value } });
    }
  }

  const handleMarksChange = (updatedMarks) => {
    if (editStudent) {
      setEditStudent((prev) => ({ ...prev, marks: updatedMarks }));
    } else {
      setNewStudent((prev) => ({ ...prev, marks: updatedMarks }));
    }
  };

  async function submitEdit(e) {
    e.preventDefault();
    try {
      await api.put(`/students/${editingId}`, editStudent);
      showPopup("Student updated successfully");
      cancelEdit();
      fetchStudents();
    } catch (error) {
      showPopup(error.response?.data?.error || "Failed to update student");
    }
  }

  async function submitCreate(e) {
    e.preventDefault();
    try {
      await api.post("/students", { email: newEmail, password: newPassword, details: newStudent });
      showPopup("Student created successfully");
      setCreateStudentMode(false);
      fetchStudents();
      setNewEmail("");
      setNewPassword("");
      setNewStudent({ ...initialStudent });
    } catch (e) {
      showPopup(e.response?.data?.error || "Error creating student");
    }
  }

  return (
    <div className="page-container">
      <h1>Student Management</h1>

      <label>
        Filter by Class:
        <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
          <option value="">All</option>
          {classes.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>
      </label>

      <div className="forms-container">
        {(createStudentMode || editStudent) && (
          <form onSubmit={editStudent ? submitEdit : submitCreate} className="form">
            {!editStudent && (
              <>
                <label>Email
                  <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
                </label>
                <label>Password
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                </label>
              </>
            )}

            <label>Name
              <input type="text" value={editStudent ? editStudent.name : newStudent.name} onChange={(e) => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, null, "name", e.target.value)} required />
            </label>

            <label>Admission Number
              <input type="text" value={editStudent ? editStudent.admissionNumber : newStudent.admissionNumber} onChange={(e) => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, null, "admissionNumber", e.target.value)} required />
            </label>

            <label>Class
              <input type="text" value={editStudent ? editStudent.class : newStudent.class} onChange={(e) => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, null, "class", e.target.value)} required />
            </label>

            <label>Date of Admission
              <input type="date" value={editStudent ? editStudent.dateAdmission : newStudent.dateAdmission} onChange={(e) => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, null, "dateAdmission", e.target.value)} required />
            </label>

            <h4>Demographics</h4>

            <label>DOB
              <input type="date" value={editStudent ? editStudent.demographics.dob : newStudent.demographics.dob} onChange={(e) => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, "demographics", "dob", e.target.value)} />
            </label>

            <label>Gender
              <input type="text" value={editStudent ? editStudent.demographics.gender : newStudent.demographics.gender} onChange={(e) => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, "demographics", "gender", e.target.value)} />
            </label>

            <label>Address
              <input type="text" value={editStudent ? editStudent.demographics.address : newStudent.demographics.address} onChange={(e) => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, "demographics", "address", e.target.value)} />
            </label>

            <label>Phone
              <input type="text" value={editStudent ? editStudent.demographics.phone : newStudent.demographics.phone} onChange={(e) => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, "demographics", "phone", e.target.value)} />
            </label>

            <h4>Mother's Details</h4>

            <label>Name
              <input type="text" value={editStudent ? editStudent.motherDetails.name : newStudent.motherDetails.name} onChange={(e) => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, "motherDetails", "name", e.target.value)} />
            </label>

            <label>Phone
              <input type="text" value={editStudent ? editStudent.motherDetails.phone : newStudent.motherDetails.phone} onChange={(e) => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, "motherDetails", "phone", e.target.value)} />
            </label>

            <label>Aadhaar Number
              <input type="text" value={editStudent ? editStudent.motherDetails.aadharNumber : newStudent.motherDetails.aadharNumber} onChange={(e) => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, "motherDetails", "aadharNumber", e.target.value)} />
            </label>

            <label>Bank Account Type
              <select value={editStudent ? editStudent.motherDetails.bankAccountType : newStudent.motherDetails.bankAccountType} onChange={(e) => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, "motherDetails", "bankAccountType", e.target.value)}>
                <option value="">Select</option>
                <option value="Savings">Savings</option>
                <option value="Current">Current</option>
              </select>
            </label>

            <label>Account Number
              <input type="text" value={editStudent ? editStudent.motherDetails.accountNumber : newStudent.motherDetails.accountNumber} onChange={(e) => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, "motherDetails", "accountNumber", e.target.value)} />
            </label>

            <label>Bank Name
              <input type="text" value={editStudent ? editStudent.motherDetails.bankName : newStudent.motherDetails.bankName} onChange={(e) => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, "motherDetails", "bankName", e.target.value)} />
            </label>

            <label>Branch
              <input type="text" value={editStudent ? editStudent.motherDetails.branch : newStudent.motherDetails.branch} onChange={(e) => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, "motherDetails", "branch", e.target.value)} />
            </label>

            <label>IFSC
              <input type="text" value={editStudent ? editStudent.motherDetails.ifsc : newStudent.motherDetails.ifsc} onChange={(e) => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, "motherDetails", "ifsc", e.target.value)} />
            </label>

            <h4>Father's Details</h4>

            <label>Name
              <input type="text" value={editStudent ? editStudent.fatherDetails.name : newStudent.fatherDetails.name} onChange={(e) => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, "fatherDetails", "name", e.target.value)} />
            </label>

            <label>Phone
              <input type="text" value={editStudent ? editStudent.fatherDetails.phone : newStudent.fatherDetails.phone} onChange={(e) => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, "fatherDetails", "phone", e.target.value)} />
            </label>

            <label>Aadhaar Number
              <input type="text" value={editStudent ? editStudent.fatherDetails.aadharNumber : newStudent.fatherDetails.aadharNumber} onChange={(e) => handleChange(editStudent ? setEditStudent : setNewStudent, editStudent ? editStudent : newStudent, "fatherDetails", "aadharNumber", e.target.value)} />
            </label>

            <MarksEntry
              marks={editStudent ? editStudent.marks : newStudent.marks}
              onChange={handleMarksChange}
              disabled={submitting}
            />

            <button type="submit" disabled={submitting}>
              {editStudent ? "Update" : "Create"}
            </button>
            <button type="button" onClick={editStudent ? cancelEdit : cancelCreate} disabled={submitting} style={{ marginLeft: 10 }}>
              Cancel
            </button>
          </form>
        )}

      {!createStudentMode && !editStudent && (
        <>
          <button onClick={openCreate} className="create-btn">
            Create New Student
          </button>

          <h2>Student List</h2>

          <table className="student-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Admission Number</th>
                <th>Class</th>
                <th>Present</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const totalDays = student.attendance?.length || 0;
                  const presentDays = student.attendance?.filter((a) => a.present).length || 0;
                  const attendancePercent = totalDays ? Math.round((presentDays / totalDays) * 100) : 0;
                  return (
                    <tr key={student._id}>
                      <td>{student.name || "-"}</td>
                      <td>{student.admissionNumber || "-"}</td>
                      <td>{student.class || "-"}</td>
                      <td style={{ textAlign: "center" }}>{attendancePercent}%</td>
                      <td>
                        <label className="attendance-switch">
                          <input
                            type="checkbox"
                            checked={attendanceMap[student._id] ?? false}
                            onChange={() => toggleAttendance(student._id)}
                          />
                          <span className="attendance-slider">{attendanceMap[student._id] ? "Present" : "Absent"}</span>
                        </label>
                      </td>
                      <td>
                        <button onClick={() => openEdit(student)}>Edit</button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <button onClick={submitAttendance} disabled={submitting} className="submit-btn">
            {attendanceSubmitted ? "Update Attendance" : "Submit Attendance"}
          </button>

          <button onClick={() => navigate("/marks-entry")}>Enter/Edit Marks</button>
        </>
      )}

      {popupVisible && <Popup message={popupMessage} onClose={() => setPopupVisible(false)} />}
    </div>
  );
};

export default StudentPageinTeacher;
