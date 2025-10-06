import React, { useState, useEffect } from "react";
import api from '../api/axios';
import Popup from "./Popup";
import Navbar from "./Navbar";

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
  const [studentMarks, setStudentMarks] = useState({}); // {studentId: marksArray}
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const triggerPopup = (msg) => {
    setPopupMessage(msg);
    setShowPopup(true);
  };

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await api.get('/teachers/students');
        setStudents(res.data);
      } catch (err) {
        setError("Failed to load students.");
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  const classes = Array.from(new Set(students.map(s => s.class?.trim()).filter(Boolean))).sort();

  const filteredStudents = students.filter(student => {
    const name = student.name?.toLowerCase() || "";
    const clazz = student.class?.toLowerCase() || "";
    const matchesName = name.includes(nameFilter.toLowerCase());
    const matchesClass = classFilter ? clazz === classFilter.toLowerCase() : true;
    return matchesName && matchesClass;
  });

  const handleEditClick = (student) => {
    setEditingStudentId(student._id);
    setStudentMarks(prev => ({
      ...prev,
      [student._id]: (student.marks && student.marks.length > 0)
        ? student.marks.map(m => ({
            subject: m.subject,
            assessments: Object.fromEntries(
              Object.entries(m.assessments).map(([k, v]) => [k, v === null ? "" : String(v)])
            )
          }))
        : subjects.map(sub => ({
            subject: sub,
            assessments: assessmentTypes.reduce((acc, a) => ({ ...acc, [a]: "" }), {})
          }))
    }));
  };

  const handleCancelClick = () => {
    setEditingStudentId(null);
  };

  const handleInputChange = (studentId, subject, assessment, value) => {
    if (value === "" || /^\d{0,3}$/.test(value)) {
      setStudentMarks(prev => {
        const marks = prev[studentId]?.map(m =>
          m.subject === subject
            ? { subject, assessments: { ...m.assessments, [assessment]: value } }
            : m
        ) || [];
        return { ...prev, [studentId]: marks };
      });
    }
  };

  const getMarkValue = (studentId, subject, assessment) => {
    const val = studentMarks[studentId]?.find(m => m.subject === subject)?.assessments?.[assessment];
    return val !== null && val !== undefined ? String(val) : "";
  };

  // Calculate horizontal total for an assessment type (sum across all subjects)
  const calculateTotalForAssessmentRow = (studentId, assessment) => {
    const marksArray = studentMarks[studentId];
    if (!marksArray) return 0;
    let total = 0;
    marksArray.forEach(m => {
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
      const marksToSave = studentMarks[student._id].map(m => ({
        subject: m.subject,
        assessments: Object.fromEntries(
          Object.entries(m.assessments).map(([k, v]) => [k, v === "" ? null : Number(v)])
        )
      }));

      await api.put(`/marks/${student._id}`, { marks: marksToSave });

      triggerPopup(popupMessages.saveSuccess);
      setStudents(prev =>
        prev.map(s =>
          s._id === student._id ? { ...s, marks: marksToSave } : s
        )
      );
      setEditingStudentId(null);
    } catch (err) {
      triggerPopup(`${popupMessages.saveError}: ${(err.response?.data?.error || err.message)}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading students...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
    <Navbar />
    <div style={{ maxWidth: '900px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h3>Marks Entry</h3>

      <div style={{ marginBottom: '15px' }}>
        <label>
          Filter by Class:{" "}
          <select value={classFilter} onChange={e => setClassFilter(e.target.value)} disabled={saving}>
            <option value="">All</option>
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <input
          type="text"
          placeholder="Filter by Name"
          value={nameFilter}
          onChange={e => setNameFilter(e.target.value)}
          style={{ marginLeft: '20px', padding: '6px', width: '250px' }}
          disabled={saving}
        />
      </div>

      {filteredStudents.length === 0 ? (
        <p>No students match the filter.</p>
      ) : (
        filteredStudents.map(student => (
          <div key={student._id} style={{ border: '1px solid #ddd', padding: '12px', marginBottom: '15px', borderRadius: '6px' }}>
            <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>
              {student.name} | Class: {student.class || 'N/A'} | Admission No: {student.admissionNumber || 'N/A'}
            </div>
            {editingStudentId === student._id ? (
              <>
                <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: '10px' }}>
                  <thead>
                    <tr>
                      <th style={{ border: '1px solid #ccc', padding: '6px' }}>Assessment Type</th>
                      {subjects.map(subject => (
                        <th key={subject} style={{ border: '1px solid #ccc', padding: '6px' }}>{subject}</th>
                      ))}
                      <th style={{ border: '1px solid #0c0', padding: '6px', color: '#127545' }}>Total per Assessment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assessmentTypes.map(at => (
                      <tr key={at}>
                        <td style={{ border: '1px solid #ccc', padding: '6px' }}>{at}</td>
                        {subjects.map(subject => (
                          <td key={subject + '_' + at} style={{ border: '1px solid #ccc', padding: '6px' }}>
                            <input
                              type="number"
                              maxLength={3}
                              disabled={saving}
                              value={getMarkValue(student._id, subject, at)}
                              onChange={e => handleInputChange(student._id, subject, at, e.target.value)}
                              style={{ width: '60px', padding: '4px' }}
                            />
                          </td>
                        ))}
                        {/* Total per assessment (row total, last column) */}
                        <td style={{ border: '1px solid #0c0', padding: '6px', fontWeight: 'bold', color: '#127545' }}>
                          {calculateTotalForAssessmentRow(editingStudentId, at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button onClick={() => handleSaveClick(student)} disabled={saving} style={{ marginRight: '10px' }}>
                  {student.marks && student.marks.length > 0 ? "Update" : "Submit"}
                </button>
                <button onClick={handleCancelClick} disabled={saving}>
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={() => handleEditClick(student)} disabled={saving}>
                {student.marks && student.marks.length > 0 ? "Edit Marks" : "Enter Marks"}
              </button>
            )}
          </div>
        ))
      )}
      {showPopup && <Popup message={popupMessage} onClose={() => setShowPopup(false)} />}
    </div>
    </>
  );
};

export default MarksEntry;
