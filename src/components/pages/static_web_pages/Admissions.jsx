import React from 'react';
import '../stylesheets/Admissions.css';
import { Link } from 'react-router-dom';
import ScrollToTopButton from './ScrollToTopButton';


const Admissions = () => {
  return (

    <div className="nav-bar p-0 m-0"> 
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold fs-4 d-flex align-items-center gap-2" to="/">
            <img
              src="./images/Pratibha-logo.png"
              alt="School Logo"
              width="90"
              height="60"
              className="d-inline-block align-text-top rounded-circle"
            />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-3">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/academics">Academics</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/fees-structure">Fees Structure</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/gallery">Gallery</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">Contact</Link>
              </li>
              <li className="nav-item">
                <Link to="/role-selection" className="btn btn-outline-light ms-2 fw-semibold px-3 py-2 mt-1">
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    <div className="admissions-section py-5" style={{ backgroundColor: '#f3f7f4' }}>
      <div className="container">
        <h2 className="text-center text-success fw-bold mb-4">Admissions Open for 2025–26</h2>

        <div className="text-center mb-4">
          <p className="lead">Click below to download the application form for admission.</p>
          <a href="/documents/ApplicationForm.pdf" download className="btn btn-success btn-lg">
            Download Application Form
          </a>
        </div>

        <h4 className="text-primary mt-5 mb-3">📌 Required Documents:</h4>
        <ul className="list-group list-group-flush fs-5">
          <li className="list-group-item">✅ Aadhar Card (Student, Father, Mother)</li>
          <li className="list-group-item">✅ Ration Card</li>
          <li className="list-group-item">✅ Birth Certificate (if available)</li>
          <li className="list-group-item">✅ Transfer Certificate</li>
          <li className="list-group-item">✅ Study Certificate till the class before joining</li>
        </ul>
      </div>
    </div>
    <ScrollToTopButton />
    </div>
  );
};

export default Admissions;
