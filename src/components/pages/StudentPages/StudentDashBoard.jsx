import React, { useState, useEffect } from "react";
import api from "../api/axios";
import Popup from "../CommonPages/Popup";
import LogoutButton from "../CommonPages/LogoutButton";
import './../stylesheets/StudentDashBoard.css';
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"; // ✅ Import these

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [attendanceFilter, setAttendanceFilter] = useState("");
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    async function fetchStudentData() {
      try {
        const res = await api.get("/students/me");
        setStudentData(res.data);
        setFilteredAttendance(res.data.attendance || []);
      } catch {
        setPopupMessage("Failed to load data");
        setPopupVisible(true);
      }
    }
    fetchStudentData();
  }, []);

  const calcAttendancePercent = () => {
    if (!studentData?.attendance) return 0;
    const total = studentData.attendance.length;
    if (total === 0) return 0;
    const presentCount = studentData.attendance.filter((a) => a.present).length;
    return Math.round((presentCount / total) * 100);
  };

  useEffect(() => {
    if (!attendanceFilter || !studentData?.attendance) {
      setFilteredAttendance(studentData?.attendance || []);
    } else {
      setFilteredAttendance(
        studentData.attendance.filter((a) =>
          a.date ? a.date.startsWith(attendanceFilter) : false
        )
      );
    }
  }, [attendanceFilter, studentData]);

  // ✅ Generate and download PDF Receipt
  const generateReceiptPDF = async (student, payment) => {
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const borderColor = rgb(0.8, 0.8, 0.8);

    // 1️⃣ Load logo from public/images folder
    const logoUrl = `${window.location.origin}/images/Pratibha-logo.png`;
    const logoBytes = await fetch(logoUrl).then((res) => res.arrayBuffer());
    const logoImage = await pdfDoc.embedPng(logoBytes);

    const logoWidth = 80;
    const logoHeight = 70;
    const logoX = 40;
    const logoY = height - 100;
    page.drawImage(logoImage, { x: logoX, y: logoY, width: logoWidth, height: logoHeight });

    // School Name and Address (aligned beside logo)
    const schoolName = "Sri Pratibha U.P. School";
    const schoolAddress = "Vadisaleru, Andhra Pradesh";
    const fontSizeName = 20;
    const fontSizeAddress = 12;
    const centerY = logoY + logoHeight / 2 - 10;

// Move school name and address more to the right
const rightOffset = 70; // adjust this value as needed

page.drawText(schoolName, {
  x: logoX + logoWidth + rightOffset,
  y: centerY,
  size: fontSizeName,
  font,
  color: rgb(0.3, 0.3, 0.3),
});

page.drawText(schoolAddress, {
  x: logoX + logoWidth + 100,
  y: centerY - 18,
  size: fontSizeAddress,
  font,
  color: rgb(0.3, 0.3, 0.3),
});

const headerBottomY = logoY - 20;


    // Horizontal line below header
    page.drawLine({
      start: { x: 40, y: headerBottomY },
      end: { x: width - 40, y: headerBottomY },
      thickness: 1,
      color: borderColor,
    });

    // Receipt title
    page.drawText("FEE PAYMENT RECEIPT", {
      x: 210,
      y: headerBottomY - 30,
      size: 16,
      font,
      color: rgb(0, 0, 0),
    });

    // Payment details (official table layout)
    const dueDate = student.dueDate || student.feeDueDate || null;
    const totalPaid = (student.payments || []).reduce((sum, p) => sum + (p.amount || 0), 0);
    const remaining = student.totalFeeAmount - totalPaid;

    const studentName = student.name || student.fullName || "N/A";
const studentClass = student.className || student.class || "N/A";
const admissionNo = student.admissionNumber || "N/A";


const details = [
  ['Student Name', String(studentName)],
  ['Class', String(studentClass)],
  ['Admission No', String(admissionNo)],
  ['Amount Paid', `INR ${String(payment.amount || '0')}`],
  ['Date', payment.date ? new Date(payment.date).toLocaleDateString() : '-'],
  ['Payment Mode', String(payment.mode || 'Cash')],
  ['Total Fee', `INR ${String(student.totalFeeAmount || '0')}`], // ✅ INR added
  ['Remaining Due', `INR ${String(
    (student.totalFeeAmount || 0) -
    (student.payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0)
  )}`],
  ['Due Date', dueDate ? new Date(dueDate).toLocaleDateString() : '-'],
];


const startX = 80;
let startY = headerBottomY - 70;
const rowHeight = 30;
const labelWidth = 160;
const valueWidth = 300;

// Darker gray for alternating rows
const darkBackground = rgb(0.85, 0.85, 0.85); // slightly darker than before
const lightBackground = rgb(0.97, 0.97, 0.97);

details.forEach(([label, value], index) => {
  const isAlternate = index % 2 === 0;

  // Alternating row background
  page.drawRectangle({
    x: startX - 10,
    y: startY - 8,
    width: labelWidth + valueWidth + 20,
    height: rowHeight - 2,
    color: isAlternate ? darkBackground : lightBackground,
  });

  // Label
  page.drawText(label, {
    x: startX,
    y: startY,
    size: 11,
    font,
    color: rgb(0.1, 0.1, 0.1),
  });

  // Value vertical separator
  page.drawLine({
    start: { x: startX + labelWidth, y: startY + 15 },
    end: { x: startX + labelWidth, y: startY - 10 },
    thickness: 0.5,
    color: borderColor,
  });

  // Value
  page.drawText(value, {
    x: startX + labelWidth + 15,
    y: startY,
    size: 11,
    font,
    color: rgb(0.15, 0.15, 0.15),
  });

  startY -= rowHeight;
});

// Footer (remove principal signature)
startY -= 20;
page.drawLine({
  start: { x: 40, y: startY },
  end: { x: width - 40, y: startY },
  thickness: 0.6,
  color: rgb(0.2, 0.2, 0.2),
});

page.drawText('This receipt is electronically verified.', {
  x: 160,
  y: startY - 20,
  size: 11,
  font,
  color: rgb(0.3, 0.3, 0.3),
});


    // Save & download
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    const filename = `receipt_${student.admissionNumber || "student"}_${payment._id}.pdf`;
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);

    console.log("✅ Receipt generated successfully");
  } catch (error) {
    console.error("❌ PDF Error:", error);
    alert("Failed to generate receipt");
  }
};

  if (!studentData) return <p>Loading your data...</p>;

  // --- Fee Calculations ---
  const totalFeeAmount = studentData?.totalFeeAmount || 0;
  const totalPaid = studentData?.payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;
  const dueAmount = totalFeeAmount - totalPaid;

  return (
    <div className="dashboard-container">
      <h1>Welcome <strong>{studentData.name}</strong></h1>
      <span><LogoutButton /></span>

      <section>
        <h2>Personal Information</h2>
        <p><strong>Name:</strong> {studentData.name || "-"}</p>
        <p><strong>Admission Number:</strong> {studentData.admissionNumber || "-"}</p>
        <p><strong>Class:</strong> {studentData.class || "-"}</p>

        <h2>Demographics</h2>
        <p><strong>DOB:</strong> {studentData?.demographics?.dob || "-"}</p>
        <p><strong>Gender:</strong> {studentData?.demographics?.gender || "-"}</p>
        <p><strong>Address:</strong> {studentData?.demographics?.address || "-"}</p>
        <p><strong>Phone:</strong> {studentData?.demographics?.phone || "-"}</p>

        <h2>Mother's Details</h2>
        <p><strong>Name:</strong> {studentData?.motherDetails?.name || "-"}</p>
        <p><strong>Phone:</strong> {studentData?.motherDetails?.phone || "-"}</p>
        <p><strong>Aadhaar:</strong> {studentData?.motherDetails?.aadharNumber || "-"}</p>
        <p><strong>Account Type:</strong> {studentData?.motherDetails?.bankAccountType || "-"}</p>
        <p><strong>Account Number:</strong> {studentData?.motherDetails?.accountNumber || "-"}</p>
        <p><strong>Bank Name:</strong> {studentData?.motherDetails?.bankName || "-"}</p>
        <p><strong>Branch:</strong> {studentData?.motherDetails?.branch || "-"}</p>
        <p><strong>IFSC Code:</strong> {studentData?.motherDetails?.ifsc || "-"}</p>

        <h2>Father's Details</h2>
        <p><strong>Name:</strong> {studentData?.fatherDetails?.name || "-"}</p>
        <p><strong>Phone:</strong> {studentData?.fatherDetails?.phone || "-"}</p>
        <p><strong>Aadhaar:</strong> {studentData?.fatherDetails?.aadharNumber || "-"}</p>
      </section>

      <section>
        <h2>Attendance Summary</h2>
        <p>Attendance Percentage: {calcAttendancePercent()}%</p>

        <label>
          Filter Attendance by Date:
          <input
            type="date"
            value={attendanceFilter}
            onChange={(e) => setAttendanceFilter(e.target.value)}
          />
        </label>

        <table className="attendance-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.length > 0 ? filteredAttendance.map((att) => (
              <tr key={att.date}>
                <td>{att.date || "-"}</td>
                <td>{att.present ? "Present" : "Absent"}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="2" style={{ textAlign: "center" }}>No attendance records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Marks</h2>
        {studentData?.marks?.length > 0 ? (
          <table className="marks-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>FA1</th>
                <th>FA2</th>
                <th>FA3</th>
                <th>SA1</th>
                <th>SA2</th>
                <th>FE</th>
              </tr>
            </thead>
            <tbody>
              {studentData.marks.map((subject) => (
                <tr key={subject.subject}>
                  <td>{subject.subject || "-"}</td>
                  {["FA1","FA2","FA3","SA1","SA2","FE"].map((type) => (
                    <td key={type}>{subject.assessments?.[type] ?? "-"}</td>
                  ))}
                </tr>
              ))}
              <tr style={{ fontWeight: 'bold', backgroundColor: '#eee' }}>
                <td>Total</td>
                {["FA1","FA2","FA3","SA1","SA2","FE"].map((type) => {
                  const total = studentData.marks.reduce((sum, subj) => sum + (subj.assessments?.[type] ?? 0), 0);
                  return <td key={type}>{total}</td>;
                })}
              </tr>
            </tbody>
          </table>
        ) : <p>No marks available.</p>}
      </section>

      <section>
        <h2>Payment History</h2>

        <p><strong>Total Fee Amount:</strong> ₹{totalFeeAmount}</p>
        <p><strong>Amount Paid:</strong> ₹{totalPaid}</p>
        <p><strong>Due Amount:</strong> ₹{dueAmount >= 0 ? dueAmount : 0}</p>

        {studentData?.payments?.length > 0 ? (
          <table className="payments-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Mode</th>
                <th>Status</th>
                <th>Amount Due</th>
                <th>Receipt</th>
              </tr>
            </thead>
           <tbody>
  {studentData.payments.map((payment, idx) => (
    <tr key={payment._id || idx}>
      <td>{payment.date ? new Date(payment.date).toISOString().split("T")[0] : "-"}</td>
      <td>{payment.amount}</td>
      <td>{payment.mode}</td>
      <td>{payment.status || "Paid"}</td>
      <td>
        {`INR ${
          (studentData.totalFeeAmount || 0) -
          ((studentData.payments?.reduce((sum, p) => sum + (p.amount || 0), 0)) || 0)
        }`}
      </td>
      <td>
        <button
          className="pdf-btn"
          onClick={() => generateReceiptPDF(studentData, payment)} // pass full studentData + payment
        >
          Download
        </button>
      </td>
    </tr>
  ))}
</tbody>

          </table>
        ) : <p>No payment history available.</p>}
      </section>

      {popupVisible && <Popup message={popupMessage} onClose={() => setPopupVisible(false)} />}
    </div>
  );
};

export default StudentDashboard;