import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-dark bg-primary px-4">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        <Link to="/" className="d-flex align-items-center">
          <img
            src="/images/Pratibha-logo.png"
            alt="School Logo"
            width="90"
            height="60"
            className="rounded-circle"
          />
        </Link>
        <span
          className="navbar-text text-white fs-4 fw-bold text-center flex-grow-1"
          style={{ marginLeft: "-90px" }}
        >
        Sri Pratibha School Management System
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
