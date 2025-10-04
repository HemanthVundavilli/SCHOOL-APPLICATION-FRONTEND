import React from "react";
import { useNavigate } from "react-router-dom";
import '../stylesheets/RoleSelection.css';

const roles = [
  {
    name: "Student",
    className: "student",
    icon: "🎓", // Use emoji or replace with <FaUserGraduate /> from react-icons
    btnColor: "#0d6efd"
  },
  {
    name: "Teacher",
    className: "teacher",
    icon: "👔",
    btnColor: "#ffc107"
  },
  {
    name: "Admin",
    className: "admin",
    icon: "🛡️",
    btnColor: "#198754"
  }
];

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    navigate("/login", { state: { role } });
  };

  return (
    <div className="role-selection-container">
      <h2 className="role-selection-title">Select Your Role</h2>
      <div className="role-blocks">
        {roles.map((role) => (
          <div
            key={role.name}
            className={`role-block ${role.className}`}
            onClick={() => handleSelect(role.name)}
          >
            <span className="role-icon">{role.icon}</span>
            <span className="role-label">{role.name}</span>
            <button
              className="role-login-btn"
              style={{ background: role.btnColor }}
              title="Login"
            >
              <span style={{ fontSize: "1.1rem" }}>⏎</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleSelection;