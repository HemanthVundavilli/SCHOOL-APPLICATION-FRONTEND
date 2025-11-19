import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Popup from "../CommonPages/Popup";
import Navbar from "../CommonPages/Navbar";
import "./../stylesheets/MarksEntry.css";
import { useNavigate } from "react-router-dom";
const subjects = ["Telugu", "Hindi", "English", "Maths", "Science", "Social"];
const assessmentTypes = ["FA1", "FA2", "FA3", "SA1", "SA2", "FE"];

const popupMessages = {
  saveSuccess: "Marks saved successfully!",
  saveError: "Failed to save marks. Please try again.",
  invalidInput: "Please enter valid marks (0-100).",
};


const MarksEntry = () => {
  const [students, setStudents] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [studentMarks, setStudentMarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const triggerPopup = (msg) => {
    setPopupMessage(msg);
    setShowPopup(true);
  };

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await api.get("/teachers/students");
        setStudents(res.data);
      } catch {
        setError("Failed to load students.");
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  const classes = Array.from(
    new Set(students.map((s) => s.class?.trim()).filter(Boolean))
  ).sort();

  const filteredStudents = students.filter((student) => {
    const name = student.name?.toLowerCase() || "";
    const clazz = student.class?.toLowerCase() || "";
    const matchesName = name.includes(nameFilter.toLowerCase());
    const matchesClass = classFilter ? clazz === classFilter.toLowerCase() : true;
    return matchesName && matchesClass;
  });

  const handleEditClick = (student) => {
    setEditingStudentId(student._id);
    setStudentMarks((prev) => ({
      ...prev,
      [student._id]:
        student.marks && student.marks.length > 0
          ? student.marks.map((m) => ({
              subject: m.subject,
              assessments: Object.fromEntries(
                Object.entries(m.assessments).map(([k, v]) => [
                  k,
                  v === null ? "" : String(v),
                ])
              ),
            }))
          : subjects.map((sub) => ({
              subject: sub,
              assessments: assessmentTypes.reduce(
                (acc, a) => ({ ...acc, [a]: "" }),
                {}
              ),
            })),
    }));
  };

  const handleCancelClick = () => setEditingStudentId(null);

  const handleInputChange = (studentId, subject, assessment, value) => {
    if (value === "" || /^\d{0,3}$/.test(value)) {
      setStudentMarks((prev) => {
        const marks =
          prev[studentId]?.map((m) =>
            m.subject === subject
              ? { subject, assessments: { ...m.assessments, [assessment]: value } }
              : m
          ) || [];
        return { ...prev, [studentId]: marks };
      });
    }
  };

  const getMarkValue = (studentId, subject, assessment) => {
    const val = studentMarks[studentId]?.find(
      (m) => m.subject === subject
    )?.assessments?.[assessment];
    return val !== null && val !== undefined ? String(val) : "";
  };

  const calculateTotalForAssessmentRow = (studentId, assessment) => {
    const marksArray = studentMarks[studentId];
    if (!marksArray) return 0;
    let total = 0;
    marksArray.forEach((m) => {
      const val = m.assessments[assessment];
      const n = Number(val);
      if (!isNaN(n)) total += n;
    });
    return total;
  };

  const handleSaveClick = async (student) => {
    if (!studentMarks[student._id]) return;
    for (const m of studentMarks[student._id]) {
      for (const val of Object.values(m.assessments)) {
        if (val !== "" && (isNaN(val) || Number(val) < 0 || Number(val) > 100)) {
          triggerPopup(popupMessages.invalidInput);
          return;
        }
      }
    }
    setSaving(true);
    try {
      const marksToSave = studentMarks[student._id].map((m) => ({
        subject: m.subject,
        assessments: Object.fromEntries(
          Object.entries(m.assessments).map(([k, v]) => [
            k,
            v === "" ? null : Number(v),
          ])
        ),
      }));

      await api.put(`/marks/${student._id}`, { marks: marksToSave });

      triggerPopup(popupMessages.saveSuccess);
      setStudents((prev) =>
        prev.map((s) =>
          s._id === student._id ? { ...s, marks: marksToSave } : s
        )
      );
      setEditingStudentId(null);
    } catch (err) {
      triggerPopup(
        `${popupMessages.saveError}: ${
          err.response?.data?.error || err.message
        }`
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading students...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar />
      <div className="marks-entry-container">
        <h3>Marks Entry</h3>
                  <button
                  className="back-btn"
                  onClick={() => {
                    const role = localStorage.getItem("role");

                    if (role === "teacher") {
                      navigate("/teacher-dashboard", { replace: true });
                    } else if (role === "admin") {
                      navigate("/admin", { replace: true });
                    } else {
                      navigate("/", { replace: true }); // fallback
                    }
                  }}
                >
                  Back
                </button>
        <div className="filter-group">
          <label>
            Filter by Class:
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              disabled={saving}
            >
              <option value="">All</option>
              {classes.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <input
            type="text"
            placeholder="Filter by Name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            disabled={saving}
          />
        </div>

        {filteredStudents.length === 0 ? (
          <p>No students match the filter.</p>
        ) : (
          filteredStudents.map((student) => (
            <div key={student._id} className="student-card">
              <div className="student-card-header">
                {student.name} | Class: {student.class || "N/A"} | Admission No:{" "}
                {student.admissionNumber || "N/A"}
              </div>

              {editingStudentId === student._id ? (
                <>
                  <table className="marks-table">
                    <thead>
                      <tr>
                        <th>Assessment Type</th>
                        {subjects.map((subject) => (
                          <th key={subject}>{subject}</th>
                        ))}
                        <th>Total per Assessment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assessmentTypes.map((at) => (
                        <tr key={at}>
                          <td>{at}</td>
                          {subjects.map((subject) => (
                            <td key={subject + "_" + at}>
                              <input
                                type="number"
                                maxLength={3}
                                disabled={saving}
                                value={getMarkValue(
                                  student._id,
                                  subject,
                                  at
                                )}
                                onChange={(e) =>
                                  handleInputChange(
                                    student._id,
                                    subject,
                                    at,
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                          ))}
                          <td>{calculateTotalForAssessmentRow(editingStudentId, at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="marks-table-actions">
                    <button
                      className="save-btn"
                      onClick={() => handleSaveClick(student)}
                      disabled={saving}
                    >
                      {student.marks && student.marks.length > 0
                        ? "Update"
                        : "Submit"}
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={handleCancelClick}
                      disabled={saving}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <button
                  className="edit-btn"
                  onClick={() => handleEditClick(student)}
                  disabled={saving}
                >
                  {student.marks && student.marks.length > 0
                    ? "Edit Marks"
                    : "Enter Marks"}
                </button>
              )}
            </div>
          ))
        )}

        {showPopup && (
          <Popup message={popupMessage} onClose={() => setShowPopup(false)} />
        )}
      </div>
    </>
  );
};

export default MarksEntry;