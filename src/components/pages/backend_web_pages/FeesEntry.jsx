import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Popup from "./Popup";
import Navbar from "./Navbar";

const FeesEntry = () => {
  const [students, setStudents] = useState([]);
  const [classFilter, setClassFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [feesInput, setFeesInput] = useState({}); // total fee & due date per student
  const [paymentInput, setPaymentInput] = useState({}); // payment amount + mode per student
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
        const res = await api.get("/teachers/students");
        setStudents(res.data || []);
        setFeesInput(
          res.data.reduce((acc, s) => {
            const totalFee = s.totalFeeAmount || 0;
            const dueDate = s.feeDueDate ? s.feeDueDate.slice(0, 10) : "";
            acc[s._id] = { totalFee, dueDate };
            return acc;
          }, {})
        );
        setPaymentInput(
          res.data.reduce((acc, s) => {
            acc[s._id] = { amount: "", mode: "Cash" }; // default mode
            return acc;
          }, {})
        );
      } catch {
        triggerPopup("Failed to load students");
      }
    }
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((s) => {
    const nameMatch = s.name?.toLowerCase().includes(nameFilter.toLowerCase());
    const classMatch = classFilter
      ? s.class?.toLowerCase() === classFilter.toLowerCase()
      : true;
    return nameMatch && classMatch;
  });

  function getRemainingAmount(student) {
    const total = student.totalFeeAmount || 0;
    const payments = student.payments || [];
    const paidSum = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    return total - paidSum;
  }

  const handleFeeChange = (studentId, field, value) => {
    setFeesInput((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value },
    }));
  };

  const handlePaymentChange = (studentId, value) => {
    setPaymentInput((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], amount: value },
    }));
  };

  const handleModeChange = (studentId, mode) => {
    setPaymentInput((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], mode },
    }));
  };

  const saveFeesAndDueDate = async (student) => {
    const { totalFee, dueDate } = feesInput[student._id] || {};
    if (isNaN(Number(totalFee)) || Number(totalFee) < 0 || !dueDate) {
      triggerPopup("Please enter valid total fee and due date");
      return;
    }

    setSaving(true);
    try {
      await api.put(`/students/${student._id}/fees`, {
        totalFeeAmount: Number(totalFee),
        feeDueDate: dueDate,
      });
      triggerPopup("Fee details saved");
      setStudents((prev) =>
        prev.map((s) =>
          s._id === student._id
            ? { ...s, totalFeeAmount: Number(totalFee), feeDueDate: dueDate }
            : s
        )
      );
    } catch {
      triggerPopup("Failed to save fee details");
    } finally {
      setSaving(false);
    }
  };

  const addPayment = async (student) => {
    const payment = paymentInput[student._id] || {};
    const amount = Number(payment.amount);
    if (isNaN(amount) || amount <= 0) {
      triggerPopup("Enter a valid payment amount");
      return;
    }

    const remaining = getRemainingAmount(student);
    if (amount > remaining) {
      triggerPopup("Payment amount cannot exceed remaining due");
      return;
    }

    setSaving(true);
    try {
      await api.post(`/students/${student._id}/fees`, {
        amount,
        date: new Date().toISOString(),
        mode: payment.mode || "Cash",
      });

      triggerPopup("Payment added");
      setPaymentInput((prev) => ({
        ...prev,
        [student._id]: { amount: "", mode: "Cash" },
      }));

      const res = await api.get("/teachers/students");
      setStudents(res.data || []);
      setFeesInput(
        res.data.reduce((acc, s) => {
          acc[s._id] = {
            totalFee: s.totalFeeAmount || 0,
            dueDate: s.feeDueDate ? s.feeDueDate.slice(0, 10) : "",
          };
          return acc;
        }, {})
      );
    } catch {
      triggerPopup("Failed to add payment");
    } finally {
      setSaving(false);
    }
  };

  if (students.length === 0) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 900, margin: "auto", fontFamily: "Arial, sans-serif" }}>
        <h3>Fee Management</h3>

        <div style={{ marginBottom: 15 }}>
          <label>
            Filter by Class:&nbsp;
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              disabled={saving}
            >
              <option value="">All</option>
              {[...new Set(students.map((s) => s.class))].sort().map((c) => (
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
            style={{ marginLeft: 20, padding: 6, width: 250 }}
            disabled={saving}
          />
        </div>

        {filteredStudents.length === 0 ? (
          <p>No students found.</p>
        ) : (
          filteredStudents.map((student) => {
            const remaining = getRemainingAmount(student);
            const payment = paymentInput[student._id] || {};
            return (
              <div
                key={student._id}
                style={{ border: "1px solid #ddd", padding: 12, marginBottom: 20, borderRadius: 6 }}
              >
                <div style={{ fontWeight: "bold", marginBottom: 8 }}>
                  {student.name} | Class: {student.class} | Admission No: {student.admissionNumber}
                </div>

                <div>
                  <label>Total Fees:</label>
                  <input
                    type="number"
                    disabled={saving}
                    value={feesInput[student._id]?.totalFee || ""}
                    onChange={(e) => handleFeeChange(student._id, "totalFee", e.target.value)}
                    style={{ marginLeft: 12, width: 120 }}
                  />
                </div>

                <div style={{ marginTop: 8 }}>
                  <label>Due Date:</label>
                  <input
                    type="date"
                    disabled={saving}
                    value={feesInput[student._id]?.dueDate || ""}
                    onChange={(e) => handleFeeChange(student._id, "dueDate", e.target.value)}
                    style={{ marginLeft: 12 }}
                  />
                </div>

                <button onClick={() => saveFeesAndDueDate(student)} disabled={saving} style={{ marginTop: 8 }}>
                  Save Fee Details
                </button>

                <hr style={{ margin: "15px 0" }} />

                <div>
                  <div>Remaining Due: ₹{remaining}</div>
                  <input
                    type="number"
                    placeholder="Payment amount"
                    disabled={saving}
                    value={payment.amount || ""}
                    onChange={(e) => handlePaymentChange(student._id, e.target.value)}
                    style={{ width: 150, marginTop: 8 }}
                    min="1"
                    max={remaining}
                  />
                  <select
                    value={payment.mode || "Cash"}
                    onChange={(e) => handleModeChange(student._id, e.target.value)}
                    disabled={saving}
                    style={{ marginLeft: 8 }}
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Netbanking">Netbanking</option>
                  </select>
                  <button
                    onClick={() => addPayment(student)}
                    disabled={saving || !payment.amount}
                    style={{ marginLeft: 8 }}
                  >
                    Add Payment
                  </button>
                </div>
              </div>
            );
          })
        )}

        {showPopup && (
          <Popup
            message={popupMessage}
            onClose={() => setShowPopup(false)}
          />
        )}
      </div>
    </>
  );
};

export default FeesEntry;