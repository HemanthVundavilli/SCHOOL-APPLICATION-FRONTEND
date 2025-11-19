import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Popup from "../CommonPages/Popup";
import "./../stylesheets/TeacherPage.css";
import Navbar from "../CommonPages/Navbar";
import { useNavigate } from "react-router-dom";

const TeacherPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [popupMessage, setPopupMessage] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState(null);

  const allClasses = ["1", "2", "3", "4", "5", "6", "7"];

  const initialTeacherData = {
    name: "",
    email: "",
    phone: "",
    subject: "",
    classes: [],
    demographicDetails: {
      dob: "",
      gender: "",
      address: "",
    },
  };

  const [newTeacher, setNewTeacher] = useState({ ...initialTeacherData });
  const [editTeacher, setEditTeacher] = useState({ ...initialTeacherData });
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ================= VALIDATORS =================
  const isAlpha = (v) => /^[A-Za-z ]+$/.test(v);
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isPhone = (v) => /^[1-9][0-9]{9}$/.test(v);
  const isPassword = (v) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/.test(v);
  const isValidDate = (v) => v && new Date(v) <= new Date();

  // ================= FETCH TEACHERS =================
  async function fetchTeachers() {
    try {
      const res = await api.get("/admins/teachers");
      setTeachers(res.data || []);
    } catch {
      setPopupMessage("Failed to load teachers");
    }
  }

  useEffect(() => {
    fetchTeachers();
  }, []);

  // ================= HANDLERS =================
  const handleChange = (setter, data, section, key, value) => {
    if (section) {
      setter({ ...data, [section]: { ...data[section], [key]: value } });
    } else {
      setter({ ...data, [key]: value });
    }
  };

  const handleClassToggle = (setter, data, cls) => {
    const updated = data.classes.includes(cls)
      ? data.classes.filter((c) => c !== cls)
      : [...data.classes, cls];
    setter({ ...data, classes: updated });
  };

  // ================ VALIDATE FORM BEFORE SUBMIT ================
  const validateTeacher = (t, isEdit) => {
    if (!t.name.trim() || !isAlpha(t.name) || t.name.length < 3)
      return "Name must be alphabets only and at least 3 characters";

    if (!isEdit && !isEmail(t.email))
      return "Enter a valid email";

    if (!isPhone(t.phone))
      return "Phone must be 10 digits and cannot start with 0";

    // if (!t.subject.trim() || !isAlpha(t.subject))
    //   return "Subject must contain only alphabets";

    if (!t.classes.length)
      return "Select at least one class";

    const d = t.demographicDetails;

    if (!isValidDate(d.dob))
      return "Invalid Date of Birth";

    if (!d.gender)
      return "Gender is required";

    if (!d.address.trim() || d.address.length < 5)
      return "Address must be minimum 5 characters";

    return null;
  };

  // ================= CREATE TEACHER =================
  async function submitNewTeacher(e) {
    e.preventDefault();

    const err = validateTeacher(newTeacher, false);
    if (err) return setPopupMessage(err);

    if (!isPassword(password))
      return setPopupMessage(
        "Password must be min 6 chars with 1 uppercase, 1 number, 1 special char"
      );

    try {
      await api.post("/admins/register", {
        email: newTeacher.email,
        password,
        role: "teacher",
        details: newTeacher,
      });

      setPopupMessage("Teacher created successfully");
      setNewTeacher({ ...initialTeacherData });
      setPassword("");
      setFormVisible(false);
      fetchTeachers();
    } catch (error) {
      setPopupMessage(error.response?.data?.error || "Error creating teacher");
    }
  }

  // ================= UPDATE TEACHER =================
  async function submitEditTeacher(e) {
  e.preventDefault();

  const err = validateTeacher(editTeacher, true);
  if (err) return setPopupMessage(err);

  if (editTeacher.password && !isPassword(editTeacher.password)) {
    return setPopupMessage(
      "Password must be min 6 chars with 1 uppercase, 1 number, 1 special char"
    );
  }

  try {
    await api.put(`/admins/teacher/${editingTeacherId}`, {
      ...editTeacher,
      password: editTeacher.password || undefined,
    });

    setPopupMessage("Teacher updated successfully");
    setEditTeacher({ ...initialTeacherData });
    setPassword("");
    setEditingTeacherId(null);
    setFormVisible(false);
    fetchTeachers();
  } catch (error) {
    setPopupMessage(error.response?.data?.error || "Error updating teacher");
  }
}

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?"))
      return;

    try {
      await api.delete(`/teachers/${id}`);
      setTeachers((prev) => prev.filter((t) => t._id !== id));
      setPopupMessage("Teacher deleted successfully");
    } catch {
      setPopupMessage("Error deleting teacher");
    }
  };

  // ================= START EDIT =================
  const startEditing = (teacher) => {
    setEditTeacher({
      ...teacher,
      password: "",
      demographicDetails: {
        dob: teacher.demographicDetails?.dob
          ? teacher.demographicDetails.dob.slice(0, 10)
          : "",
        gender: teacher.demographicDetails?.gender || "",
        address: teacher.demographicDetails?.address || "",
      },
    });

    setEditingTeacherId(teacher._id);
    setEditMode(true);
    setFormVisible(true);
  };

  // ================= UI =================
  return (
    <>
      <Navbar />

      <div className="page-container">
        <h1>Teacher Management</h1>

        <button className="back-btn" onClick={() => navigate("/admin")}>
          Back
        </button>

        <button
          className="create-btn"
          onClick={() => {
            setEditMode(false);
            setFormVisible(true);
          }}
        >
          Create New Teacher
        </button>

        {/* ================= FORM POPUP ================= */}
        {formVisible && (
          <div className="form-overlay">
            <div className="form-popup">
              <button
                className="popup-close"
                onClick={() => setFormVisible(false)}
              >
                ✕
              </button>

              <form
                onSubmit={editMode ? submitEditTeacher : submitNewTeacher}
                className="edit-form"
              >
                <h3>{editMode ? "Update Teacher" : "Create New Teacher"}</h3>

                {/* NAME */}
                <label>Name</label>
                <input
                  type="text"
                  value={editMode ? editTeacher.name : newTeacher.name}
                  onChange={(e) =>
                    editMode
                      ? setEditTeacher({ ...editTeacher, name: e.target.value })
                      : setNewTeacher({ ...newTeacher, name: e.target.value })
                  }
                  required
                />

                {/* EMAIL */}
                {!editMode && (
                  <>
                    <label>Email</label>
                    <input
                      type="email"
                      value={newTeacher.email}
                      onChange={(e) =>
                        setNewTeacher({ ...newTeacher, email: e.target.value })
                      }
                      required
                    />
                  </>
                )}

                {/* PASSWORD */}
                <label>Password</label>
                <input
                  type="password"
                  placeholder={editMode ? "Leave blank to keep existing" : ""}
                  value={editMode ? editTeacher.password : password}
                  onChange={(e) =>
                    editMode
                      ? setEditTeacher({
                          ...editTeacher,
                          password: e.target.value,
                        })
                      : setPassword(e.target.value)
                  }
                  required={!editMode}
                />

                {/* PHONE */}
                <label>Phone</label>
                <input
                  type="text"
                  value={editMode ? editTeacher.phone : newTeacher.phone}
                  onChange={(e) =>
                    editMode
                      ? handleChange(
                          setEditTeacher,
                          editTeacher,
                          null,
                          "phone",
                          e.target.value
                        )
                      : handleChange(
                          setNewTeacher,
                          newTeacher,
                          null,
                          "phone",
                          e.target.value
                        )
                  }
                  required
                />

                {/* SUBJECT */}
                <label>Subject</label>
                <input
                  type="text"
                  value={editMode ? editTeacher.subject : newTeacher.subject}
                  onChange={(e) =>
                    editMode
                      ? handleChange(
                          setEditTeacher,
                          editTeacher,
                          null,
                          "subject",
                          e.target.value
                        )
                      : handleChange(
                          setNewTeacher,
                          newTeacher,
                          null,
                          "subject",
                          e.target.value
                        )
                  }
                  required
                />

                {/* CLASSES */}
                <label>Classes Assigned</label>
                <div className="class-checkbox-group">
                  {allClasses.map((cls) => {
                    const isSelected = editMode
                      ? editTeacher.classes.includes(cls)
                      : newTeacher.classes.includes(cls);

                    return (
                      <label key={cls} className="class-checkbox">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() =>
                            editMode
                              ? handleClassToggle(
                                  setEditTeacher,
                                  editTeacher,
                                  cls
                                )
                              : handleClassToggle(
                                  setNewTeacher,
                                  newTeacher,
                                  cls
                                )
                          }
                        />
                        <span>Class {cls}</span>
                      </label>
                    );
                  })}
                </div>

                {/* DEMOGRAPHIC DETAILS */}
                <h4>Demographic Details</h4>

                {/* DOB */}
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={
                    editMode
                      ? editTeacher.demographicDetails.dob
                      : newTeacher.demographicDetails.dob
                  }
                  onChange={(e) =>
                    editMode
                      ? handleChange(
                          setEditTeacher,
                          editTeacher,
                          "demographicDetails",
                          "dob",
                          e.target.value
                        )
                      : handleChange(
                          setNewTeacher,
                          newTeacher,
                          "demographicDetails",
                          "dob",
                          e.target.value
                        )
                  }
                  required
                />

                {/* GENDER */}
                <label>Gender</label>
                <select
                  value={
                    editMode
                      ? editTeacher.demographicDetails.gender
                      : newTeacher.demographicDetails.gender
                  }
                  onChange={(e) =>
                    editMode
                      ? handleChange(
                          setEditTeacher,
                          editTeacher,
                          "demographicDetails",
                          "gender",
                          e.target.value
                        )
                      : handleChange(
                          setNewTeacher,
                          newTeacher,
                          "demographicDetails",
                          "gender",
                          e.target.value
                        )
                  }
                  required
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>

                {/* ADDRESS */}
                <label>Address</label>
                <input
                  type="text"
                  value={
                    editMode
                      ? editTeacher.demographicDetails.address
                      : newTeacher.demographicDetails.address
                  }
                  onChange={(e) =>
                    editMode
                      ? handleChange(
                          setEditTeacher,
                          editTeacher,
                          "demographicDetails",
                          "address",
                          e.target.value
                        )
                      : handleChange(
                          setNewTeacher,
                          newTeacher,
                          "demographicDetails",
                          "address",
                          e.target.value
                        )
                  }
                  required
                />

                {/* BUTTONS */}
                <div className="form-row" style={{ justifyContent: "flex-end" }}>
                  <button type="submit">
                    {editMode ? "Update" : "Create"}
                  </button>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => setFormVisible(false)}
                    style={{
                      marginLeft: 12,
                      backgroundColor: "#ccc",
                      color: "#555",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= TEACHERS TABLE ================= */}
        <h2>Teachers List</h2>

        <table className="attendance-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Classes</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {teachers.length === 0 ? (
              <tr>
                <td colSpan="5">No teachers available.</td>
              </tr>
            ) : (
              teachers.map((teacher) => (
                <tr key={teacher._id}>
                  <td>{teacher.name}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.subject}</td>
                  <td>
                    {teacher.classes?.length
                      ? teacher.classes.join(", ")
                      : "N/A"}
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => startEditing(teacher)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(teacher._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <Popup message={popupMessage} onClose={() => setPopupMessage("")} />
      </div>
    </>
  );
};

export default TeacherPage;