import React, { useState } from "react";
import Navbar from "../CommonPages/Navbar";
import "./../stylesheets/Settings.css";

export default function SettingsPage() {
  const [theme, setTheme] = useState("light");
  const [backupStatus, setBackupStatus] = useState("No backups yet");

  const handleBackup = () => {
    setBackupStatus("Backup completed at " + new Date().toLocaleString());
  };

  return (
    <>
      <Navbar />
      <div className="settings-container">
        <h2 className="page-title">System Settings</h2>
        <p className="subtitle">Manage administrative preferences and configurations</p>

        <div className="settings-grid">
          {/* General Info */}
          <div className="card setting-card">
            <h4>School Information</h4>
            <div className="info-group">
              <label>School Name</label>
              <input type="text" value="Sri Pratibha UP School" readOnly />
            </div>
            <div className="info-group">
              <label>Admin Email</label>
              <input type="text" value="admin@pratibhaschool.edu.in" readOnly />
            </div>
          </div>

          {/* Theme Settings */}
          <div className="card setting-card">
            <h4>Theme Preferences</h4>
            <p>Choose your dashboard display mode</p>
            <div className="theme-options">
              <button
                className={theme === "light" ? "active" : ""}
                onClick={() => setTheme("light")}
              >
                ☀️ Light Mode
              </button>
              <button
                className={theme === "dark" ? "active" : ""}
                onClick={() => setTheme("dark")}
              >
                🌙 Dark Mode
              </button>
            </div>
          </div>

          {/* Backup Section */}
          <div className="card setting-card">
            <h4>Database Backup</h4>
            <p>Secure your system data</p>
            <button onClick={handleBackup} className="backup-btn">Create Backup</button>
            <p className="backup-status">{backupStatus}</p>
          </div>
        </div>
      </div>
    </>
  );
}