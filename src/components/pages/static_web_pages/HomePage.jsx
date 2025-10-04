import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../stylesheets/Homepage.css';
import ScrollToTopButton from './ScrollToTopButton';

const HomePage = () => {
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
                <Link className="nav-link active" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/academics">Academics</Link>
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
      {/* <div className="admissions-banner py-2 text-center text-white fw-semibold" style={{ backgroundColor: '#d32f2f' }}>
  🎓 Admissions are now open for the academic year 2025–26!
  <Link to="/admissions" className="btn btn-light btn-sm ms-3 fw-bold">
    Enroll Now
  </Link>
</div> */}

      {/* Hero Section - Peaceful Look */}
<div className="hero-section py-5" style={{ background: 'linear-gradient(to right, #e0f2f1, #f1f8e9)' }}>
  <div className="container text-center">
    <h1 className="display-5 fw-bold text-success mb-3">Welcome to Sri Pratibha U.P. School</h1>
    <p className="lead text-muted mb-4">
      A place where learning meets values. For over <strong>23 years</strong>, we’ve nurtured bright minds with care,
      compassion, and commitment to excellence.
    </p>
    <div className="d-flex justify-content-center gap-3 flex-wrap">
      <a href="/about" className="btn btn-success btn-lg px-4">Our Story</a>
      <a href="/contact" className="btn btn-outline-success btn-lg px-4">Get in Touch</a>
    </div>
  </div>
</div>
    
      {/* stats starts */}
      <div className="container my-5">
        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <div className="p-4 bg-light rounded shadow h-100">
              <h2 className="text-primary fw-bold display-6">250+</h2>
              <p className="fs-5 mb-0">Students</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="p-4 bg-light rounded shadow h-100">
              <h2 className="text-success fw-bold display-6">15+</h2>
              <p className="fs-5 mb-0">Staff Members</p>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="p-4 bg-light rounded shadow h-100">
              <h2 className="text-warning fw-bold display-6">23+</h2>
              <p className="fs-5 mb-0">Years of Excellence</p>
            </div>
          </div>
        </div>
      </div>
      {/* stats ends */}

      {/* news and Announcements starts */}
      <div className="container my-5">
        <h2 className="text-center fw-bold mb-4 text-primary">News & Announcements</h2>
        <div className="row">
          {/* <div className="col-md-4 mb-4">
            <div className="card shadow h-100">
              <div className="card-body">
                <h5 className="card-title text-dark fw-bold">Annual Day Circular</h5>
                <p className="card-text text-muted">
                  Read the official circular regarding Annual Day celebration timings, dress code, and responsibilities.
                </p>
                <a href="/pdfs/annual_day_circular.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary btn-sm">
                  View PDF
                </a>
                <p className="card-text mt-2"><small className="text-secondary">Posted on April 10, 2025</small></p>
              </div>
            </div>
          </div> */}

          <div className="col-md-4 mb-4">
            <div className="card shadow h-100">
              <div className="card-body">
                <h5 className="card-title text-dark fw-bold">Holiday Notice</h5>
                <p className="card-text text-muted">
                  Download the summer vacation schedule for all grades in PDF format.
                </p>
                <a href="/documents/NOTICE.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-outline-success btn-sm">
                  View PDF
                </a>

                <p className="card-text mt-2"><small className="text-secondary">Posted on April 5, 2025</small></p>
              </div>
            </div>
          </div>

          {/* <div className="col-md-4 mb-4">
            <div className="card shadow h-100">
              <div className="card-body">
                <h5 className="card-title text-dark fw-bold">Scholarship List</h5>
                <p className="card-text text-muted">
                  The scholarship recipient list has been released. Click below to view/download the document.
                </p>
                <a href="/pdfs/scholarship_results.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-outline-warning btn-sm">
                  View PDF
                </a>
                <p className="card-text mt-2"><small className="text-secondary">Posted on March 28, 2025</small></p>
              </div>
            </div>
          </div> */}

        </div>
      </div>
      {/* news and Announcements ends */}
            <ScrollToTopButton />
      
    </div>
  );
};

export default HomePage;
