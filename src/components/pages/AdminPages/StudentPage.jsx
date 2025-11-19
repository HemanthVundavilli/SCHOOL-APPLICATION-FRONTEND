import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Popup from "../CommonPages/Popup";
import "./../stylesheets/StudentPage.css";
import Navbar from "../CommonPages/Navbar";
import { useNavigate } from "react-router-dom";

const StudentPage = () => {
  const [students, setStudents] = useState([]);
  const [popupMessage, setPopupMessage] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [showPassword, setShowPassword] = useState(false);

  const initialStudent = {
    name: "",
    admissionNumber: "",
    class: "",
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
      ifsc: "",
    },
    fatherDetails: { name: "", phone: "", aadharNumber: "" },
  };

  const [newStudent, setNewStudent] = useState({ ...initialStudent });
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [editStudent, setEditStudent] = useState({ ...initialStudent });

  const navigate = useNavigate();

  // ------------------- VALIDATORS -------------------
  const validateText = (v) => /^[A-Za-z ]*$/.test(v);
  const validateNumber = (v) => /^[0-9]*$/.test(v);
  const validatePassword = (pwd) =>
    pwd && pwd.length >= 6 && /[0-9]/.test(pwd);

  // ------------------- FETCH STUDENTS -------------------
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await api.get("/admins/students");
      setStudents(res.data);
    } catch {
      setPopupMessage("Failed to load students");
    }
  };

  // ------------------- OPEN CREATE -------------------
  const handleCreateNew = () => {
    setEditingId(null);
    setNewStudent({ ...initialStudent });
    setNewEmail("");
    setNewPassword("");
    setFormVisible(true);
  };

  // ------------------- OPEN EDIT -------------------
  const handleEditClick = (student) => {
    setEditingId(student._id);

    setEditStudent({
      name: student.name,
      admissionNumber: student.admissionNumber,
      class: student.class,
      dateOfAdmission: student.dateOfAdmission?.slice(0, 10) || "",
      email: student.email,
      password: "",
      demographics: {
        dob: student.demographics?.dob?.slice(0, 10) || "",
        gender: student.demographics?.gender || "",
        address: student.demographics?.address || "",
        phone: student.demographics?.phone || "",
      },
      motherDetails: { ...student.motherDetails },
      fatherDetails: { ...student.fatherDetails },
    });

    setFormVisible(true);
  };

  const cancelForm = () => {
    setEditingId(null);
    setFormVisible(false);
  };

  // ------------------- CREATE STUDENT -------------------
  const createStudent = async (e) => {
    e.preventDefault();

    if (!validatePassword(newPassword)) {
      setPopupMessage("Password must be minimum 6 characters and contain a number");
      return;
    }

    try {
      await api.post("/students", {
        email: newEmail.trim(),
        password: newPassword,
        details: newStudent,
      });
      setFormVisible(false);
      setPopupMessage("Student created successfully");
      fetchStudents();
    } catch (err) {
      setPopupMessage(err.response?.data?.error || "Error creating student");
    }
  };

  // ------------------- UPDATE STUDENT -------------------
  const updateStudent = async (e) => {
    e.preventDefault();

    const payload = { ...editStudent };
    if (!payload.password) delete payload.password;

    if (payload.password && !validatePassword(payload.password)) {
      setPopupMessage("Password must be minimum 6 characters and contain a number");
      return;
    }

    try {
      await api.put(`/admin-edit/${editingId}`, payload);
      setFormVisible(false);
      setPopupMessage("Student updated successfully");
      fetchStudents();
      setEditingId(null);
    } catch {
      setPopupMessage("Error updating student");
    }
  };

  // ------------------- DELETE STUDENT -------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      await api.delete(`/students/${id}`);
      setStudents((prev) => prev.filter((s) => s._id !== id));
      setPopupMessage("Student deleted successfully");
    } catch {
      setPopupMessage("Error deleting student");
    }
  };

  // ------------------- GENERIC UPDATE -------------------
  const handleChange = (setter, obj, section, key, value) => {
    setter(
      section
        ? { ...obj, [section]: { ...obj[section], [key]: value } }
        : { ...obj, [key]: value }
    );
  };

  const active = editingId ? editStudent : newStudent;

  // ------------------- UI -------------------
  return (
    <>
      <Navbar />

      <div className="page-container">
        <h1>Student Management</h1>
        <button className="back-btn" onClick={() => navigate("/admin", { replace: true })}>
          Back
        </button>
        <button className="create-btn" onClick={handleCreateNew}>
          Create New Student
        </button>

        {/* ------------------- POPUP FORM ------------------- */}
        {formVisible && (
          <div className="form-overlay">
            <div className="form-popup">
              <button className="popup-close" onClick={cancelForm}>✕</button>

              <form onSubmit={editingId ? updateStudent : createStudent} className="edit-form">
                <h3>{editingId ? "Update Student" : "Create Student"}</h3>

                {/* ---------------- EMAIL ONLY FOR CREATE ---------------- */}
                {!editingId && (
                  <>
                    <label>Email</label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      required
                    />
                  </>
                )}

                {/* ---------------- PASSWORD FIELD ---------------- */}
                <label>Password</label>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={editingId ? "Leave blank to keep existing" : "Enter new password"}
                    value={editingId ? editStudent.password : newPassword}
                    onChange={(e) =>
                      editingId
                        ? setEditStudent({ ...editStudent, password: e.target.value })
                        : setNewPassword(e.target.value)
                    }
                    required={!editingId}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ marginLeft: 8 }}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {/* ---------------- NAME + ADMISSION NUMBER ---------------- */}
                <div className="form-row">
                  <div>
                    <label>Name</label>
                    <input
                      type="text"
                      value={active.name}
                      onChange={(e) => {
                        if (!validateText(e.target.value)) return;
                        handleChange(editingId ? setEditStudent : setNewStudent, active, null, "name", e.target.value);
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label>Admission Number</label>
                    <input
                      type="text"
                      value={active.admissionNumber}
                      onChange={(e) => {
                        if (!validateNumber(e.target.value)) return;
                        handleChange(editingId ? setEditStudent : setNewStudent, active, null, "admissionNumber", e.target.value);
                      }}
                      required
                    />
                  </div>
                </div>

                {/* ---------------- CLASS + ADMISSION DATE ---------------- */}
                <div className="form-row">
                  <div>
                    <label>Class</label>
                    <input
                      type="text"
                      value={active.class}
                      onChange={(e) =>
                        handleChange(editingId ? setEditStudent : setNewStudent, active, null, "class", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div>
                    <label>Admission Date</label>
                    <input
                      type="date"
                      value={active.dateOfAdmission}
                      onChange={(e) =>
                        handleChange(editingId ? setEditStudent : setNewStudent, active, null, "dateOfAdmission", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                {/* ---------------- DEMOGRAPHICS ---------------- */}
                <h4>Demographics</h4>
                <div className="form-row">
                  <div>
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      value={active.demographics.dob}
                      onChange={(e) =>
                        handleChange(editingId ? setEditStudent : setNewStudent, active, "demographics", "dob", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label>Gender</label>
                    <select
                      value={active.demographics.gender}
                      onChange={(e) =>
                        handleChange(editingId ? setEditStudent : setNewStudent, active, "demographics", "gender", e.target.value)
                      }
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div>
                    <label>Address</label>
                    <input
                      type="text"
                      value={active.demographics.address}
                      onChange={(e) =>
                        handleChange(editingId ? setEditStudent : setNewStudent, active, "demographics", "address", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label>Phone</label>
                    <input
                      type="text"
                      value={active.demographics.phone}
                      onChange={(e) => {
                        if (!validateNumber(e.target.value)) return;
                        handleChange(editingId ? setEditStudent : setNewStudent, active, "demographics", "phone", e.target.value);
                      }}
                      maxLength={10}
                    />
                  </div>
                </div>

                {/* ---------------- MOTHER DETAILS ---------------- */}
                <h4>Mother Details</h4>
                <div className="form-row">
                  <div>
                    <label>Name</label>
                    <input
                      type="text"
                      value={active.motherDetails.name}
                      onChange={(e) => {
                        if (!validateText(e.target.value)) return;
                        handleChange(editingId ? setEditStudent : setNewStudent, active, "motherDetails", "name", e.target.value);
                      }}
                    />
                  </div>

                  <div>
                    <label>Phone</label>
                    <input
                      type="text"
                      value={active.motherDetails.phone}
                      onChange={(e) => {
                        if (!validateNumber(e.target.value)) return;
                        handleChange(editingId ? setEditStudent : setNewStudent, active, "motherDetails", "phone", e.target.value);
                      }}
                      maxLength={10}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div>
                    <label>Aadhar Number</label>
                    <input
                      type="text"
                      value={active.motherDetails.aadharNumber}
                      onChange={(e) => {
                        if (!validateNumber(e.target.value)) return;
                        handleChange(editingId ? setEditStudent : setNewStudent, active, "motherDetails", "aadharNumber", e.target.value);
                      }}
                      maxLength={12}
                    />
                  </div>

                  <div>
                    <label>Account Type</label>
                    <select
                      value={active.motherDetails.bankAccountType}
                      onChange={(e) =>
                        handleChange(editingId ? setEditStudent : setNewStudent, active, "motherDetails", "bankAccountType", e.target.value)
                      }
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
                      value={active.motherDetails.accountNumber}
                      onChange={(e) => {
                        if (!validateNumber(e.target.value)) return;
                        handleChange(editingId ? setEditStudent : setNewStudent, active, "motherDetails", "accountNumber", e.target.value);
                      }}
                    />
                  </div>

                  <div>
                    <label>Bank Name</label>
                    <input
                      type="text"
                      value={active.motherDetails.bankName}
                      onChange={(e) =>
                        handleChange(editingId ? setEditStudent : setNewStudent, active, "motherDetails", "bankName", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div>
                    <label>Branch</label>
                    <input
                      type="text"
                      value={active.motherDetails.branch}
                      onChange={(e) =>
                        handleChange(editingId ? setEditStudent : setNewStudent, active, "motherDetails", "branch", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label>IFSC</label>
                    <input
                      type="text"
                      value={active.motherDetails.ifsc}
                      onChange={(e) =>
                        handleChange(editingId ? setEditStudent : setNewStudent, active, "motherDetails", "ifsc", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* ---------------- FATHER DETAILS ---------------- */}
                <h4>Father Details</h4>
                <div className="form-row">
                  <div>
                    <label>Name</label>
                    <input
                      type="text"
                      value={active.fatherDetails.name}
                      onChange={(e) => {
                        if (!validateText(e.target.value)) return;
                        handleChange(editingId ? setEditStudent : setNewStudent, active, "fatherDetails", "name", e.target.value);
                      }}
                    />
                  </div>

                  <div>
                    <label>Phone</label>
                    <input
                      type="text"
                      value={active.fatherDetails.phone}
                      onChange={(e) => {
                        if (!validateNumber(e.target.value)) return;
                        handleChange(editingId ? setEditStudent : setNewStudent, active, "fatherDetails", "phone", e.target.value);
                      }}
                      maxLength={10}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div>
                    <label>Aadhar Number</label>
                    <input
                      type="text"
                      value={active.fatherDetails.aadharNumber}
                      onChange={(e) => {
                        if (!validateNumber(e.target.value)) return;
                        handleChange(editingId ? setEditStudent : setNewStudent, active, "fatherDetails", "aadharNumber", e.target.value);
                      }}
                      maxLength={12}
                    />
                  </div>
                </div>

                {/* ---------------- BUTTONS ---------------- */}
                <div className="form-row" style={{ justifyContent: "flex-end" }}>
                  <button type="submit">{editingId ? "Update" : "Create"}</button>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={cancelForm}
                    style={{ marginLeft: 12 }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ------------------- STUDENT TABLE ------------------- */}
        <table className="student-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Class</th>
              <th>Admission No</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s) => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.class}</td>
                <td>{s.admissionNumber}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEditClick(s)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(s._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Popup message={popupMessage} onClose={() => setPopupMessage("")} />
      </div>
    </>
  );
};

export default StudentPage;