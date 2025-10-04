import React from 'react';
import { Link } from 'react-router-dom';
import '../stylesheets/Gallery.css'; // Make sure to import this
import ScrollToTopButton from './ScrollToTopButton';

const Gallery = () => {
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
                <Link className="nav-link" to="/academics">Academics</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/fees-structure">Fees Structure</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/gallery">Gallery</Link>
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
    <div className="gallery-container">
      <h2 className="gallery-title">School Gallery</h2>
      <div className="gallery-grid">
        <div className="gallery-card">
          <img src="./images/sliderimage_1.JPG" alt="Event 1" className="gallery-image" />
          <div className="gallery-caption">Sankranthi Sambaralu</div>
        </div>
        <div className="gallery-card">
          <img src="./images/sliderimage-2.jpg" alt="Event 2" className="gallery-image" />
          <div className="gallery-caption">ClassRooms</div>
        </div>
        {/* Add more images similarly */}
      </div>
    </div>
    <ScrollToTopButton />
    </div>
  );
};

export default Gallery;
