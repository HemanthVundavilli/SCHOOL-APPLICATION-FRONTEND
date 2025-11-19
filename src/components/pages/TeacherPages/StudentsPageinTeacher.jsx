import React, { useState, useEffect } from "react";
import api from "./../api/axios";
import Popup from "./../CommonPages/Popup";
import "./../stylesheets/StudentsPageinTeacher.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./../CommonPages/Navbar";

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
  fees: { total: "", paid: "", balance: "", lastPaymentDate: "" },
};

const StudentPageinTeacher = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [viewVisible, setViewVisible] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newStudent, setNewStudent] = useState({ ...initialStudent });

  const navigate = useNavigate();

  // === FETCH STUDENTS ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/teachers/students");
        const data = res.data || [];
        setStudents(data);
        const classesSet = new Set(data.map((s) => s.class).filter(Boolean));
        setClasses([...classesSet]);
      } catch {
        setPopupMessage("Failed to load students");
      }
    };
    fetchData();
  }, []);

  const filteredStudents = selectedClass
    ? students.filter((s) => s.class === selectedClass)
    : students;

  // === FORM FIELD HANDLER ===
  const handleChange = (setter, section, key, value) => {
    if (section) {
      setter((prev) => ({
        ...prev,
        [section]: { ...prev[section], [key]: value },
      }));
    } else {
      setter((prev) => ({ ...prev, [key]: value }));
    }
  };

const handleCreateStudent = async (e) => {
  e.preventDefault();

  // === BASIC REQUIRED FIELDS ===
  if (
    !newStudent.name.trim() ||
    !newStudent.admissionNumber.trim() ||
    !newStudent.class.trim() ||
    !newStudent.dateOfAdmission ||
    !newStudent.demographics.dob ||
    !newStudent.demographics.gender ||
    !newStudent.demographics.address.trim() ||
    !newStudent.demographics.phone ||
    !newStudent.motherDetails.name.trim() ||
    !newStudent.motherDetails.phone ||
    !newStudent.motherDetails.aadharNumber ||
    !newStudent.motherDetails.bankAccountType ||
    !newStudent.motherDetails.accountNumber ||
    !newStudent.motherDetails.bankName.trim() ||
    !newStudent.motherDetails.branch.trim() ||
    !newStudent.motherDetails.ifsc.trim() ||
    !newStudent.fatherDetails.name.trim() ||
    !newStudent.fatherDetails.phone ||
    !newStudent.fatherDetails.aadharNumber ||
    !newEmail.trim() ||
    !newPassword.trim()
  ) {
    return setPopupMessage("All fields are mandatory");
  }

  // === NAME VALIDATION ===
  if (!onlyText(newStudent.name))
    return setPopupMessage("Student name must contain only alphabets and spaces");

  if (!onlyText(newStudent.motherDetails.name))
    return setPopupMessage("Mother name must contain only alphabets and spaces");

  if (!onlyText(newStudent.fatherDetails.name))
    return setPopupMessage("Father name must contain only alphabets and spaces");

  // === EMAIL ===
  if (!emailValid(newEmail))
    return setPopupMessage("Invalid email format");

  // === PASSWORD ===
  if (!passwordValid(newPassword))
    return setPopupMessage(
      "Password must be at least 6 characters and include 1 uppercase, 1 number, and 1 special character"
    );

  // === PHONE NUMBERS ===
  if (!phoneValid(newStudent.demographics.phone))
    return setPopupMessage("Student phone must be 10 digits and cannot start with 0");

  if (!phoneValid(newStudent.motherDetails.phone))
    return setPopupMessage("Mother phone must be 10 digits and cannot start with 0");

  if (!phoneValid(newStudent.fatherDetails.phone))
    return setPopupMessage("Father phone must be 10 digits and cannot start with 0");

  // === AADHAAR ===
  if (!aadhaarValid(newStudent.motherDetails.aadharNumber))
    return setPopupMessage("Mother Aadhaar must be exactly 12 digits");

  if (!aadhaarValid(newStudent.fatherDetails.aadharNumber))
    return setPopupMessage("Father Aadhaar must be exactly 12 digits");

  // === ACCOUNT NO ===
  if (!accountValid(newStudent.motherDetails.accountNumber))
    return setPopupMessage("Account number must be between 9–18 digits");

  // === IFSC ===
  if (!ifscValid(newStudent.motherDetails.ifsc))
    return setPopupMessage("Invalid IFSC format (e.g. SBIN0123456)");

    try {
      await api.post("/students", {
        email: newEmail,
        password: newPassword,
        details: newStudent,
      });
      setPopupMessage("Student created successfully");
      setFormVisible(false);
      setNewStudent({ ...initialStudent });
      setNewEmail("");
      setNewPassword("");
      const resp = await api.get("/teachers/students");
      setStudents(resp.data);
    } catch {
      setPopupMessage("Error creating student");
    }
  };

  // === EDIT STUDENT ===
  const handleEditClick = (student) => {
    setEditingId(student._id);
    setNewEmail("");
    setNewPassword("");
    setNewStudent({
      ...student,
      dateOfAdmission: student.dateOfAdmission
        ? student.dateOfAdmission.slice(0, 10)
        : "",
      demographics: {
        dob: student.demographics?.dob
          ? student.demographics.dob.slice(0, 10)
          : "",
        gender: student.demographics?.gender || "",
        address: student.demographics?.address || "",
        phone: student.demographics?.phone || "",
      },
      motherDetails: student.motherDetails || {},
      fatherDetails: student.fatherDetails || {},
      fees: student.fees || {},
    });
    setFormVisible(true);
  };

  // === UPDATE STUDENT ===
  const handleUpdateStudent = async (e) => {
    e.preventDefault();

    if (
    !newStudent.name.trim() ||
    !newStudent.admissionNumber.trim() ||
    !newStudent.class.trim() ||
    !newStudent.dateOfAdmission ||
    !newStudent.demographics.dob ||
    !newStudent.demographics.gender ||
    !newStudent.demographics.address.trim() ||
    !newStudent.demographics.phone ||
    !newStudent.motherDetails.name.trim() ||
    !newStudent.motherDetails.phone ||
    !newStudent.motherDetails.aadharNumber ||
    !newStudent.motherDetails.bankAccountType ||
    !newStudent.motherDetails.accountNumber ||
    !newStudent.motherDetails.bankName.trim() ||
    !newStudent.motherDetails.branch.trim() ||
    !newStudent.motherDetails.ifsc.trim() ||
    !newStudent.fatherDetails.name.trim() ||
    !newStudent.fatherDetails.phone ||
    !newStudent.fatherDetails.aadharNumber
  ) {
    return setPopupMessage("All fields are mandatory");
  }

  // NAME
  if (!onlyText(newStudent.name))
    return setPopupMessage("Student name must contain only alphabets");

  if (!onlyText(newStudent.motherDetails.name))
    return setPopupMessage("Mother name must contain only alphabets");

  if (!onlyText(newStudent.fatherDetails.name))
    return setPopupMessage("Father name must contain only alphabets");

  // PHONE
  if (!phoneValid(newStudent.demographics.phone))
    return setPopupMessage("Student phone invalid");

  if (!phoneValid(newStudent.motherDetails.phone))
    return setPopupMessage("Mother phone invalid");

  if (!phoneValid(newStudent.fatherDetails.phone))
    return setPopupMessage("Father phone invalid");

  // AADHAAR
  if (!aadhaarValid(newStudent.motherDetails.aadharNumber))
    return setPopupMessage("Mother Aadhaar invalid");

  if (!aadhaarValid(newStudent.fatherDetails.aadharNumber))
    return setPopupMessage("Father Aadhaar invalid");

  // BANK
  if (!accountValid(newStudent.motherDetails.accountNumber))
    return setPopupMessage("Account number must be 9–18 digits");

  if (!ifscValid(newStudent.motherDetails.ifsc))
    return setPopupMessage("Invalid IFSC code");

    try {
      await api.put(`/admin-edit/${editingId}`, newStudent);
      setPopupMessage("Student updated successfully");
      setEditingId(null);
      setFormVisible(false);
      setNewStudent({ ...initialStudent });
      const resp = await api.get("/teachers/students");
      setStudents(resp.data);
    } catch {
      setPopupMessage("Error updating student");
    }
  };

  // === DELETE STUDENT ===
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

  // === VIEW STUDENT DETAILS ===
  const handleViewDetails = (student) => {
    setViewStudent(student);
    setViewVisible(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormVisible(false);
  };

  // VALIDATION HELPERS
const onlyText = (v) => /^[A-Za-z ]+$/.test(v);
const emailValid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const phoneValid = (v) => /^[1-9][0-9]{9}$/.test(v);
const aadhaarValid = (v) => /^[0-9]{12}$/.test(v);
const accountValid = (v) => /^[0-9]{9,18}$/.test(v);
const ifscValid = (v) => /^[A-Z]{4}0[0-9]{6}$/.test(v);
const passwordValid = (v) => /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/.test(v);

  return (
    <>
      <Navbar />
      <div className="page-container">
        <h1>Student Management</h1>
        <button className="back-btn" onClick={() => navigate(-1)}>
          Back
        </button>

        <div className="top-row">
          <label>
            Filter by Class:
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">All</option>
              {classes.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </label>

          <button
            onClick={() => {
              setNewStudent({ ...initialStudent });
              setEditingId(null);
              setFormVisible(true);
              setNewEmail("");
              setNewPassword("");
            }}
            className="create-btn"
          >
            Create New Student
          </button>
        </div>

        {/* === VIEW POPUP === */}
        {viewVisible && viewStudent && (
          <div className="form-overlay">
            <div className="view-popup">
              <button
                className="popup-close"
                onClick={() => setViewVisible(false)}
              >
                ✕
              </button>
              <h2>{viewStudent.name}'s Details</h2>

              <div className="view-content">
                <div className="view-section">
                  <h4>Basic Information</h4>
                  <p><strong>Admission No:</strong> {viewStudent.admissionNumber}</p>
                  <p><strong>Class:</strong> {viewStudent.class}</p>
                  <p><strong>Date of Admission:</strong> {viewStudent.dateOfAdmission?.slice(0,10) || "N/A"}</p>
                </div>

                <div className="view-section">
                  <h4>Demographics</h4>
                  <p><strong>DOB:</strong> {viewStudent.demographics?.dob?.slice(0,10) || "N/A"}</p>
                  <p><strong>Gender:</strong> {viewStudent.demographics?.gender || "N/A"}</p>
                  <p><strong>Address:</strong> {viewStudent.demographics?.address || "N/A"}</p>
                  <p><strong>Phone:</strong> {viewStudent.demographics?.phone || "N/A"}</p>
                </div>

                <div className="view-section">
                  <h4>Mother Details</h4>
                  <p><strong>Name:</strong> {viewStudent.motherDetails?.name || "N/A"}</p>
                  <p><strong>Phone:</strong> {viewStudent.motherDetails?.phone || "N/A"}</p>
                  <p><strong>Aadhaar:</strong> {viewStudent.motherDetails?.aadharNumber || "N/A"}</p>
                  <p><strong>Bank:</strong> {viewStudent.motherDetails?.bankName || "N/A"} ({viewStudent.motherDetails?.bankAccountType || "-"})</p>
                </div>

                <div className="view-section">
                  <h4>Father Details</h4>
                  <p><strong>Name:</strong> {viewStudent.fatherDetails?.name || "N/A"}</p>
                  <p><strong>Phone:</strong> {viewStudent.fatherDetails?.phone || "N/A"}</p>
                  <p><strong>Aadhaar:</strong> {viewStudent.fatherDetails?.aadharNumber || "N/A"}</p>
                </div>

                <div className="view-section">
                  <h4>Fees Details</h4>
                  {(() => {
                    const totalFeeAmount =
                      viewStudent?.totalFeeAmount ||
                      viewStudent?.fees?.total ||
                      0;
                    const totalPaid =
                      viewStudent?.payments?.reduce(
                        (sum, p) => sum + (p.amount || 0),
                        0
                      ) || viewStudent?.fees?.paid || 0;
                    const dueAmount =
                      totalFeeAmount - totalPaid >= 0
                        ? totalFeeAmount - totalPaid
                        : 0;

                    return (
                      <>
                        <p><strong>Total Fees:</strong> ₹{totalFeeAmount}</p>
                        <p><strong>Paid:</strong> ₹{totalPaid}</p>
                        <p><strong>Balance:</strong> ₹{dueAmount}</p>

                        {viewStudent?.payments?.length > 0 ? (
                          <>
                            <h5>Payment History</h5>
                            <table className="payment-table">
                              <thead>
                                <tr>
                                  <th>Date</th>
                                  <th>Amount</th>
                                  <th>Mode</th>
                                  <th>Receipt No.</th>
                                </tr>
                              </thead>
                              <tbody>
                                {viewStudent.payments.map((p, idx) => (
                                  <tr key={idx}>
                                    <td>{p.date ? p.date.slice(0, 10) : "N/A"}</td>
                                    <td>₹{p.amount || "0"}</td>
                                    <td>{p.mode || "N/A"}</td>
                                    <td>{p.receiptNo || "N/A"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </>
                        ) : (
                          <p>No payment records found.</p>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === CREATE / EDIT POPUP === */}
        {formVisible && (
          <div className="form-overlay">
            <div className="form-popup">

              <button className="popup-close" onClick={cancelEdit}>✕</button>

              <form
                onSubmit={editingId ? handleUpdateStudent : handleCreateStudent}
                className="edit-form"
              >
                <h2>{editingId ? "Edit Student" : "Create New Student"}</h2>

                {/* EMAIL & PASSWORD ONLY IN CREATE MODE */}
                {!editingId && (
                  <>
                    <label>Email</label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      required
                    />

                    <label>Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </>
                )}

                {/* BASIC INFO */}
                <div className="form-row">
                  <div>
                    <label>Name</label>
                    <input
                      type="text"
                      value={newStudent.name}
                      onChange={(e) =>
                        handleChange(setNewStudent, null, "name", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div>
                    <label>Admission Number</label>
                    <input
                      type="text"
                      value={newStudent.admissionNumber}
                      onChange={(e) =>
                        handleChange(setNewStudent, null, "admissionNumber", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div>
                    <label>Class</label>
                    <input
                      type="text"
                      value={newStudent.class}
                      onChange={(e) =>
                        handleChange(setNewStudent, null, "class", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div>
                    <label>Date of Admission</label>
                    <input
                      type="date"
                      value={newStudent.dateOfAdmission}
                      onChange={(e) =>
                        handleChange(setNewStudent, null, "dateOfAdmission", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                {/* === DEMOGRAPHICS === */}
                <h3>Demographics</h3>

                <div className="form-row">
                  <div>
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      value={newStudent.demographics.dob}
                      onChange={(e) =>
                        handleChange(setNewStudent, "demographics", "dob", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label>Gender</label>
                    <select
                      value={newStudent.demographics.gender}
                      onChange={(e) =>
                        handleChange(setNewStudent, "demographics", "gender", e.target.value)
                      }
                    >
                      <option value="">Select</option>
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
                      value={newStudent.demographics.address}
                      onChange={(e) =>
                        handleChange(setNewStudent, "demographics", "address", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label>Phone</label>
                    <input
                      type="text"
                      value={newStudent.demographics.phone}
                      onChange={(e) =>
                        handleChange(setNewStudent, "demographics", "phone", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* === MOTHER DETAILS === */}
                <h4>Mother Details</h4>

                <div className="form-row">
                  <div>
                    <label>Name</label>
                    <input
                      type="text"
                      placeholder="Enter Mother Name"
                      value={newStudent.motherDetails.name}
                      onChange={(e) =>
                        handleChange(setNewStudent, "motherDetails", "name", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label>Phone</label>
                    <input
                      type="text"
                      placeholder="Enter Mother Mobile"
                      value={newStudent.motherDetails.phone}
                      onChange={(e) =>
                        handleChange(setNewStudent, "motherDetails", "phone", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div>
                    <label>Aadhaar Number</label>
                    <input
                      type="text"
                      placeholder="Enter Mother Aadhaar"
                      value={newStudent.motherDetails.aadharNumber}
                      onChange={(e) =>
                        handleChange(
                          setNewStudent,
                          "motherDetails",
                          "aadharNumber",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>Account Type</label>
                    <select
                      value={newStudent.motherDetails.bankAccountType}
                      onChange={(e) =>
                        handleChange(
                          setNewStudent,
                          "motherDetails",
                          "bankAccountType",
                          e.target.value
                        )
                      }
                    >
                      <option value="">Select Account Type</option>
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
                      placeholder="Enter Account Number"
                      value={newStudent.motherDetails.accountNumber}
                      onChange={(e) =>
                        handleChange(
                          setNewStudent,
                          "motherDetails",
                          "accountNumber",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label>Bank Name</label>
                    <input
                      type="text"
                      placeholder="Enter Bank Name"
                      value={newStudent.motherDetails.bankName}
                      onChange={(e) =>
                        handleChange(setNewStudent, "motherDetails", "bankName", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div>
                    <label>Branch</label>
                    <input
                      type="text"
                      placeholder="Enter Bank Branch"
                      value={newStudent.motherDetails.branch}
                      onChange={(e) =>
                        handleChange(setNewStudent, "motherDetails", "branch", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label>IFSC</label>
                    <input
                      type="text"
                      placeholder="Enter IFSC"
                      value={newStudent.motherDetails.ifsc}
                      onChange={(e) =>
                        handleChange(setNewStudent, "motherDetails", "ifsc", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* === FATHER DETAILS === */}
                <h4>Father Details</h4>

                <div className="form-row">
                  <div>
                    <label>Name</label>
                    <input
                      type="text"
                      placeholder="Enter Father Name"
                      value={newStudent.fatherDetails.name}
                      onChange={(e) =>
                        handleChange(setNewStudent, "fatherDetails", "name", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label>Phone</label>
                    <input
                      type="text"
                      placeholder="Enter Father Mobile"
                      value={newStudent.fatherDetails.phone}
                      onChange={(e) =>
                        handleChange(setNewStudent, "fatherDetails", "phone", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div>
                    <label>Aadhaar Number</label>
                    <input
                      type="text"
                      placeholder="Enter Father Aadhaar"
                      value={newStudent.fatherDetails.aadharNumber}
                      onChange={(e) =>
                        handleChange(
                          setNewStudent,
                          "fatherDetails",
                          "aadharNumber",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>

                {/* BUTTONS */}
                <div className="form-row" style={{ justifyContent: "flex-end" }}>
                  <button type="submit" className="edit-btn">
                    {editingId ? "Update" : "Create"}
                  </button>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={cancelEdit}
                    style={{ background: "#ccc", marginLeft: 12 }}
                  >
                    Cancel
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}



        {/* === STUDENT LIST === */}
        {filteredStudents.length === 0 ? (
          <p>No students found.</p>
        ) : (
          <table className="student-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Admission Number</th>
                <th>Class</th>
                <th>Father Phone</th>
                <th>Mother Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.admissionNumber}</td>
                  <td>{student.class || "N/A"}</td>
                  <td>{student.fatherDetails?.phone || "N/A"}</td>
                  <td>{student.motherDetails?.phone || "N/A"}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="view-btn"
                        onClick={() => handleViewDetails(student)}
                      >
                        View
                      </button>
                      <button
                        className="edit-btn"
                        onClick={() => handleEditClick(student)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(student._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <Popup message={popupMessage} onClose={() => setPopupMessage("")} />
      </div>
    </>
  );
};

export default StudentPageinTeacher;


