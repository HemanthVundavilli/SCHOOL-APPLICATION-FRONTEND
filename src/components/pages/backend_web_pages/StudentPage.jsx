import React, { useState, useEffect } from "react";
import api from "./../api/axios";
import Popup from "./Popup";
import "../stylesheets/StudentPage.css";
import { useNavigate } from 'react-router-dom';

const StudentPage = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [attendanceMap, setAttendanceMap] = useState({});

  const [createStudentMode, setCreateStudentMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialStudent = {
    name: "",
    admissionNumber: "",
    class: "",
    dateOfAdmission: "",
    demographics: {
      dob: "",
      gender: "",
      address: "",
      phone: "",
    },
    motherDetails: {
      name: "",
      phone: "",
      aadharNumber: "",
      bankAccountType: "", // "Savings" or "Current"
      accountNumber: "",
      bankName: "",
      branch: "",
      ifsc: "",
    },
    fatherDetails: {
      name: "",
      phone: "",
      aadharNumber: "",
    }
  };

  const [newStudent, setNewStudent] = useState({ ...initialStudent });
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [editStudent, setEditStudent] = useState({ ...initialStudent });

  const getYesterday = () => {
    const d = new Date();
    d.setDate(d.getDate() -1);
    return d.toISOString().slice(0,10);
  };
const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("/admins/students");
        const data = res.data || [];
        setStudents(data);

        // // Get unique classes, limit to 1-7, sorted
        const classesSet = new Set(
          data
            .map(s => s.class?.toString().trim())
            .filter(c => c && ["1","2","3","4","5","6","7"].includes(c))
        );
        setClasses(Array.from(classesSet).sort((a,b)=>a-b));

        // Initialize attendance map with yesterday info
        const attendanceInit = {};
        data.forEach(s => {
          attendanceInit[s._id] = false;
        });
        setAttendanceMap(attendanceInit);

      } catch {
        setPopupMessage("Failed to fetch students");
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = selectedClass
    ? students.filter(s => s.class?.toString().trim() === selectedClass)
    : students;

  const toggleAttendance = (id) => {
    setAttendanceMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const submitAttendance = async () => {
    try {
      const yesterday = getYesterday();
      const updates = Object.entries(attendanceMap).map(([id, present]) =>
        api.put(`/students/attendance/${id}`, { date: yesterday, present })
      );
      await Promise.all(updates);
      setPopupMessage("Attendance uploaded successfully");
    } catch {
      setPopupMessage("Error uploading attendance");
    }
  };

  // Generic nested update helper
  const handleChange = (setter, stateObj, section, key, value) => {
    if (section) {
      setter({
        ...stateObj,
        [section]: {
          ...stateObj[section],
          [key]: value
        }
      });
    } else {
      setter({
        ...stateObj,
        [key]: value
      });
    }
  };

  const createStudent = async (e) => {
    e.preventDefault();
    try {
      await api.post("/students", {
        email: newEmail,
        password: newPassword,
        details: newStudent
      });
      setPopupMessage("Student created successfully");
      setCreateStudentMode(false);
      setNewEmail("");
      setNewPassword("");
      setNewStudent({ ...initialStudent });
      const res = await api.get("/admins/students");
      setStudents(res.data);
    } catch (err) {
      setPopupMessage(err.response?.data?.error || "Error creating student");
    }
  };

  const handleEditClick = (student) => {
    setEditingId(student._id);
    setEditStudent({
      name: student.name || "",
      admissionNumber: student.admissionNumber || "",
      class: student.class || "",
      dateOfAdmission: student.dateOfAdmission ? student.dateOfAdmission.slice(0, 10) : "",
      demographics: {
        dob: student.demographics?.dob ? student.demographics.dob.slice(0,10) : "",
        gender: student.demographics?.gender || "",
        address: student.demographics?.address || "",
        phone: student.demographics?.phone || "",
      },
      motherDetails: {
        name: student.motherDetails?.name || "",
        phone: student.motherDetails?.phone || "",
        aadharNumber: student.motherDetails?.aadharNumber || "",
        bankAccountType: student.motherDetails?.bankAccountType || "",
        accountNumber: student.motherDetails?.accountNumber || "",
        bankName: student.motherDetails?.bankName || "",
        branch: student.motherDetails?.branch || "",
        ifsc: student.motherDetails?.ifsc || "",
      },
      fatherDetails: {
        name: student.fatherDetails?.name || "",
        phone: student.fatherDetails?.phone || "",
        aadharNumber: student.fatherDetails?.aadharNumber || "",
      }
    });
    setCreateStudentMode(false);
  };

  const submitUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/students/${editingId}`, editStudent);
      setPopupMessage("Student updated successfully");
      setEditingId(null);
      const res = await api.get("/admins/students");
      setStudents(res.data);
    } catch (err) {
      setPopupMessage("Error updating student");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

    // Utility to calculate attendance percentage
  const calculateAttendancePercentage = (attendance) => {
    if (!attendance || attendance.length === 0) return "0.00";
    const presentDays = attendance.filter((record) => record.present).length;
    return ((presentDays / attendance.length) * 100).toFixed(2);
  };

  return (
    <div className="page-container">
      <h1>Student Management</h1>

      <label>
        Filter by Class:{" "}
        <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
          <option value="">All</option>
          {classes.map(cls => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
      </label>

      <div className="forms-container">
        {(createStudentMode || editingId) && (
          <form onSubmit={editingId ? submitUpdate : createStudent} className="edit-form">
            <h3>{editingId ? "Update Student" : "Create Student"}</h3>

            {!editingId && (
              <>
                <label>Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  required
                />
                <label>Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                />
              </>
            )}

            <div className="form-row">
              <div>
                <label>Name</label>
                <input
                  type="text"
                  value={editingId ? editStudent.name : newStudent.name}
                  onChange={e => handleChange(editingId ? setEditStudent : setNewStudent, editingId ? editStudent : newStudent, null, "name", e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Admission Number</label>
                <input
                  type="text"
                  value={editingId ? editStudent.admissionNumber : newStudent.admissionNumber}
                  onChange={e => handleChange(editingId ? setEditStudent : setNewStudent, editingId ? editStudent : newStudent, null, "admissionNumber", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div>
                <label>Class</label>
                <input
                  type="text"
                  value={editingId ? editStudent.class : newStudent.class}
                  onChange={e => handleChange(editingId ? setEditStudent : setNewStudent, editingId ? editStudent : newStudent, null, "class", e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Admission Date</label>
                <input
                  type="date"
                  value={editingId ? editStudent.dateOfAdmission : newStudent.dateOfAdmission}
                  onChange={e => handleChange(editingId ? setEditStudent : setNewStudent, editingId ? editStudent : newStudent, null, "dateOfAdmission", e.target.value)}
                  required
                />
              </div>
            </div>

            <h4>Demographics</h4>

            <div className="form-row">
              <div>
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={editingId ? editStudent.demographics.dob : newStudent.demographics.dob}
                  onChange={e => handleChange(editingId ? setEditStudent : setNewStudent, editingId ? editStudent : newStudent, "demographics", "dob", e.target.value)}
                />
              </div>
              <div>
                <label>Gender</label>
                <select
                  type=""
                  value={editingId ? editStudent.demographics.gender : newStudent.demographics.gender}
                  onChange={e => handleChange(editingId ? setEditStudent : setNewStudent, editingId ? editStudent : newStudent, "demographics", "gender", e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Savings">Male</option>
                  <option value="Current">Female</option>

                </select>
              </div>
            </div>

            <div className="form-row">
              <div>
                <label>Address</label>
                <input
                  type="text"
                  value={editingId ? editStudent.demographics.address : newStudent.demographics.address}
                  onChange={e => handleChange(editingId ? setEditStudent : setNewStudent, editingId ? editStudent : newStudent, "demographics", "address", e.target.value)}
                />
              </div>
              <div>
                <label>Phone</label>
                <input
                  type="text"
                  value={editingId ? editStudent.demographics.phone : newStudent.demographics.phone}
                  onChange={e => handleChange(editingId ? setEditStudent : setNewStudent, editingId ? editStudent : newStudent, "demographics", "phone", e.target.value)}
                />
              </div>
            </div>

            <h4>Mother Details</h4>

            <div className="form-row">
              <div>
                <label>Name</label>
                <input
                  type="text"
                  value={editingId ? editStudent.motherDetails.name : newStudent.motherDetails.name}
                  onChange={e => handleChange(editingId ? setEditStudent : setNewStudent, editingId ? editStudent : newStudent, "motherDetails", "name", e.target.value)}
                />
              </div>
              <div>
                <label>Phone</label>
                <input
                  type="text"
                  value={editingId ? editStudent.motherDetails.phone : newStudent.motherDetails.phone}
                  onChange={e => handleChange(editingId ? setEditStudent : setNewStudent, editingId ? editStudent : newStudent, "motherDetails", "phone", e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div>
                <label>Aadhaar Number</label>
                <input
                  type="text"
                  value={editingId ? editStudent.motherDetails.aadharNumber : newStudent.motherDetails.aadharNumber}
                  onChange={e => handleChange(editingId ? setEditStudent : setNewStudent, editingId ? editStudent : newStudent, "motherDetails", "aadharNumber", e.target.value)}
                />
              </div>
              <div>
                <label>Account Type</label>
                <select
                  value={editingId ? editStudent.motherDetails.bankAccountType : newStudent.motherDetails.bankAccountType}
                  onChange={e => handleChange(editingId ? setEditStudent : setNewStudent, editingId ? editStudent : newStudent, "motherDetails", "bankAccountType", e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="Savings">Savings</option>
                  <option value="Current">Current</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div>
                <label>Account Number</label>
                <input
                  type="text"
                  value={editingId ? editStudent.motherDetails.accountNumber : newStudent.motherDetails.accountNumber}
                  onChange={e => handleChange(editingId ? setEditStudent : setNewStudent, editingId ? editStudent : newStudent, "motherDetails", "accountNumber", e.target.value)}
                />
              </div>
              <div>
                <label>Bank Name</label>
                <input
                  type="text"
                  value={editingId ? editStudent.motherDetails.bankName : newStudent.motherDetails.bankName}
                  onChange={e => handleChange(editingId ? setEditStudent : setNewStudent, editingId ? editStudent : newStudent, "motherDetails", "bankName", e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div>
                <label>Branch</label>
                <input
                  type="text"
                  value={editingId ? editStudent.motherDetails.branch : newStudent.motherDetails.branch}
                  onChange={e => handleChange(editingId ? setEditStudent : setNewStudent, editingId ? editStudent : newStudent, "motherDetails", "branch", e.target.value)}
                />
              </div>
              <div>
                <label>IFSC</label>
                <input
                  type="text"
                  value={editingId ? editStudent.motherDetails.ifsc : newStudent.motherDetails.ifsc}
                  onChange={e => handleChange(editingId ? setEditStudent : setNewStudent, editingId ? editStudent : newStudent, "motherDetails", "ifsc", e.target.value)}
                />
              </div>
            </div>

            <h4>Father Details</h4>

            <div className="form-row">
              <div>
                <label>Name</label>
                <input
                  type="text"
                  value={editingId ? editStudent.fatherDetails.name : newStudent.fatherDetails.name}
                  onChange={e => handleChange(editingId ? setEditStudent : setNewStudent, editingId ? editStudent : newStudent, "fatherDetails", "name", e.target.value)}
                />
              </div>
              <div>
                <label>Phone</label>
                <input
                  type="text"
                  value={editingId ? editStudent.fatherDetails.phone : newStudent.fatherDetails.phone}
                  onChange={e => handleChange(editingId ? setEditStudent : setNewStudent, editingId ? editStudent : newStudent, "fatherDetails", "phone", e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div>
                <label>Aadhaar Number</label>
                <input
                  type="text"
                  value={editingId ? editStudent.fatherDetails.aadharNumber : newStudent.fatherDetails.aadharNumber}
                  onChange={e => handleChange(editingId ? setEditStudent : setNewStudent, editingId ? editStudent : newStudent, "fatherDetails", "aadharNumber", e.target.value)}
                />
              </div>
            </div>

            <div className="form-row" style={{ gridColumn: "span 2", justifyContent: "flex-end" }}>
              <button type="submit">{editingId ? "Update" : "Create"}</button>
              <button
                type="button"
                onClick={editingId ? cancelEdit : () => setCreateStudentMode(false)}
                style={{ marginLeft: 12, backgroundColor: "#ccc", color: "#555" }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {!createStudentMode && !editingId && (
        <button onClick={() => setCreateStudentMode(true)} className="create-btn">
          Create New Student
        </button>
      )}

      <h2>Attendance Marking</h2>

      {filteredStudents.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Admission Number</th>
              <th>Class</th>
              <th>Present</th>
              <th>Attendance %</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.admissionNumber}</td>
                <td>{student.class || 'N/A'}</td>
                <td>
                  <label className="attendance-switch">
                    <input
                      type="checkbox"
                      checked={attendanceMap[student._id] ?? false}
                      onChange={() => toggleAttendance(student._id)}
                    />
                    <span className="attendance-slider">
                      {attendanceMap[student._id] ? "Present" : "Absent"}
                    </span>
                  </label>
                </td>
                <td>{calculateAttendancePercentage(student.attendance)}%</td>
                <td>
                  <button onClick={() => handleEditClick(student)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
          
        </table>
      )}

      {filteredStudents.length > 0 && (
        <button className="submit-btn" onClick={submitAttendance}>
          Submit Attendance
        </button>
        
      )}
      <button onClick={() => navigate('/marks-entry')} className="submit-btn">
      Enter/Edit Marks
      </button>

      <Popup message={popupMessage} onClose={() => setPopupMessage("")} />
    </div>
  );
};

export default StudentPage;



// import React, { useState, useEffect } from "react";
// import api from "./../api/axios";
// import Popup from "./Popup";
// import "../stylesheets/StudentPage.css";

// const StudentPage = () => {
//   const [students, setStudents] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [selectedClass, setSelectedClass] = useState("");
//   const [popupMessage, setPopupMessage] = useState("");
//   const [attendanceMap, setAttendanceMap] = useState({});

//   const [createStudentMode, setCreateStudentMode] = useState(false);
//   const [editingId, setEditingId] = useState(null);

//   const initialStudent = {
//     name: "",
//     admissionNumber: "",
//     class: "",
//     dateOfAdmission: "",
//     demographics: {
//       dob: "",
//       gender: "",
//       address: "",
//       phone: "",
//     },
//     motherDetails: {
//       name: "",
//       phone: "",
//       aadharNumber: "",
//       bankAccountType: "",
//       accountNumber: "",
//       bankName: "",
//       branch: "",
//       ifsc: "",
//     },
//     fatherDetails: {
//       name: "",
//       phone: "",
//       aadharNumber: "",
//     },
//   };

//   const [newStudent, setNewStudent] = useState({ ...initialStudent });
//   const [newEmail, setNewEmail] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [editStudent, setEditStudent] = useState({ ...initialStudent });

//   const getYesterday = () => {
//     const d = new Date();
//     d.setDate(d.getDate() - 1);
//     return d.toISOString().slice(0, 10);
//   };

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const res = await api.get("/admins/students");
//         const data = res.data || [];
//         setStudents(data);

//         // Unique classes between 1 and 7, sorted
//         const classesSet = new Set(
//           data
//             .map((s) => s.class?.toString().trim())
//             .filter((c) => c && ["1", "2", "3", "4", "5", "6", "7"].includes(c))
//         );
//         setClasses(Array.from(classesSet).sort((a, b) => a - b));

//         // Initialize attendance map for yesterday
//         const yesterday = getYesterday();
//         const attendanceInit = {};
//         data.forEach((s) => {
//           let present = false;
//           if (Array.isArray(s.attendance)) {
//             const d = s.attendance.find((a) => a.date?.toISOString().startsWith(yesterday));
//             present = d ? d.present : false;
//           }
//           attendanceInit[s._id] = present;
//         });
//         setAttendanceMap(attendanceInit);
//       } catch {
//         setPopupMessage("Failed to fetch students");
//       }
//     };
//     fetchStudents();
//   }, []);

//   const filteredStudents = selectedClass
//     ? students.filter((s) => s.class?.toString().trim() === selectedClass)
//     : students;

//   const toggleAttendance = (id) => {
//     setAttendanceMap((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   const submitAttendance = async () => {
//     try {
//       const yesterday = getYesterday();
//       const updates = Object.entries(attendanceMap).map(([id, present]) =>
//         api.put(`/students/${id}/attendance`, { date: yesterday, present })
//       );
//       await Promise.all(updates);
//       setPopupMessage("Attendance uploaded successfully");
//     } catch {
//       setPopupMessage("Error uploading attendance");
//     }
//   };

//   // Generic nested update helper
//   const handleChange = (setter, stateObj, section, key, value) => {
//     if (section) {
//       setter({
//         ...stateObj,
//         [section]: {
//           ...stateObj[section],
//           [key]: value,
//         },
//       });
//     } else {
//       setter({
//         ...stateObj,
//         [key]: value,
//       });
//     }
//   };

//   const createStudent = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post("/students", {
//         email: newEmail,
//         password: newPassword,
//         details: newStudent,
//       });
//       setPopupMessage("Student created successfully");
//       setCreateStudentMode(false);
//       setNewEmail("");
//       setNewPassword("");
//       setNewStudent({ ...initialStudent });
//       const res = await api.get("/admins/students");
//       setStudents(res.data);
//     } catch (err) {
//       setPopupMessage(err.response?.data?.error || "Error creating student");
//     }
//   };

//   const handleEditClick = (student) => {
//     setEditingId(student._id);
//     setEditStudent({
//       name: student.name || "",
//       admissionNumber: student.admissionNumber || "",
//       class: student.class || "",
//       dateOfAdmission: student.dateOfAdmission ? student.dateOfAdmission.slice(0, 10) : "",
//       demographics: {
//         dob: student.demographics?.dob ? student.demographics.dob.slice(0, 10) : "",
//         gender: student.demographics?.gender || "",
//         address: student.demographics?.address || "",
//         phone: student.demographics?.phone || "",
//       },
//       motherDetails: {
//         name: student.motherDetails?.name || "",
//         phone: student.motherDetails?.phone || "",
//         aadharNumber: student.motherDetails?.aadharNumber || "",
//         bankAccountType: student.motherDetails?.bankAccountType || "",
//         accountNumber: student.motherDetails?.accountNumber || "",
//         bankName: student.motherDetails?.bankName || "",
//         branch: student.motherDetails?.branch || "",
//         ifsc: student.motherDetails?.ifsc || "",
//       },
//       fatherDetails: {
//         name: student.fatherDetails?.name || "",
//         phone: student.fatherDetails?.phone || "",
//         aadharNumber: student.fatherDetails?.aadharNumber || "",
//       },
//     });
//     setCreateStudentMode(false);
//   };

//   const submitUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       await api.put(`/students/${editingId}`, editStudent);
//       setPopupMessage("Student updated successfully");
//       setEditingId(null);
//       const res = await api.get("/admins/students");
//       setStudents(res.data);
//     } catch (err) {
//       setPopupMessage("Error updating student");
//     }
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//   };

//   return (
//     <div className="page-container">
//       <h1>Student Management</h1>

//       <label>
//         Filter by Class:{" "}
//         <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
//           <option value="">All</option>
//           {classes.map((cls) => (
//             <option key={cls} value={cls}>
//               {cls}
//             </option>
//           ))}
//         </select>
//       </label>

//       <div className="forms-container">
//         {(createStudentMode || editingId) && (
//           <form onSubmit={editingId ? submitUpdate : createStudent} className="edit-form">
//             <h3>{editingId ? "Update Student" : "Create Student"}</h3>

//             {!editingId && (
//               <>
//                 <label>Email</label>
//                 <input
//                   type="email"
//                   value={newEmail}
//                   onChange={(e) => setNewEmail(e.target.value)}
//                   required
//                 />
//                 <label>Password</label>
//                 <input
//                   type="password"
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   required
//                 />
//               </>
//             )}

//             <div className="form-row">
//               <div>
//                 <label>Name</label>
//                 <input
//                   type="text"
//                   value={editingId ? editStudent.name : newStudent.name}
//                   onChange={(e) =>
//                     handleChange(
//                       editingId ? setEditStudent : setNewStudent,
//                       editingId ? editStudent : newStudent,
//                       null,
//                       "name",
//                       e.target.value
//                     )
//                   }
//                   required
//                 />
//               </div>
//               <div>
//                 <label>Admission Number</label>
//                 <input
//                   type="text"
//                   value={editingId ? editStudent.admissionNumber : newStudent.admissionNumber}
//                   onChange={(e) =>
//                     handleChange(
//                       editingId ? setEditStudent : setNewStudent,
//                       editingId ? editStudent : newStudent,
//                       null,
//                       "admissionNumber",
//                       e.target.value
//                     )
//                   }
//                   required
//                 />
//               </div>
//             </div>

//             <div className="form-row">
//               <div>
//                 <label>Class</label>
//                 <input
//                   type="text"
//                   value={editingId ? editStudent.class : newStudent.class}
//                   onChange={(e) =>
//                     handleChange(
//                       editingId ? setEditStudent : setNewStudent,
//                       editingId ? editStudent : newStudent,
//                       null,
//                       "class",
//                       e.target.value
//                     )
//                   }
//                   required
//                 />
//               </div>
//               <div>
//                 <label>Admission Date</label>
//                 <input
//                   type="date"
//                   value={editingId ? editStudent.dateOfAdmission : newStudent.dateOfAdmission}
//                   onChange={(e) =>
//                     handleChange(
//                       editingId ? setEditStudent : setNewStudent,
//                       editingId ? editStudent : newStudent,
//                       null,
//                       "dateOfAdmission",
//                       e.target.value
//                     )
//                   }
//                   required
//                 />
//               </div>
//             </div>

//             {/* Demographic and parent details (omit here for brevity) */}

//             <div className="form-row" style={{ gridColumn: "span 2", justifyContent: "flex-end" }}>
//               <button type="submit">{editingId ? "Update" : "Create"}</button>
//               <button
//                 type="button"
//                 onClick={editingId ? cancelEdit : () => setCreateStudentMode(false)}
//                 style={{ marginLeft: 12, backgroundColor: "#ccc", color: "#555" }}
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         )}
//       </div>

//       {!createStudentMode && !editingId && (
//         <button onClick={() => setCreateStudentMode(true)} className="create-btn">
//           Create New Student
//         </button>
//       )}

//       <h2>Attendance Marking</h2>

//       {filteredStudents.length === 0 ? (
//         <p>No students found.</p>
//       ) : (
//         <table className="attendance-table">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Admission Number</th>
//               <th>Class</th>
//               <th>Present</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredStudents.map((student) => (
//               <tr key={student._id}>
//                 <td>{student.name}</td>
//                 <td>{student.admissionNumber}</td>
//                 <td>{student.class || "N/A"}</td>
//                 <td>
//                   <label className="attendance-switch">
//                     <input
//                       type="checkbox"
//                       checked={attendanceMap[student._id] ?? true}
//                       onChange={() => toggleAttendance(student._id)}
//                     />
//                     <span className="attendance-slider">{attendanceMap[student._id] ? "Present" : "Absent"}</span>
//                   </label>
//                 </td>
//                 <td>
//                   <button onClick={() => handleEditClick(student)}>Edit</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {filteredStudents.length > 0 && (
//         <button className="submit-btn" onClick={submitAttendance}>
//           Submit Attendance
//         </button>
//       )}

//       <Popup message={popupMessage} onClose={() => setPopupMessage("")} />
//     </div>
//   );
// };

// export default StudentPage;
