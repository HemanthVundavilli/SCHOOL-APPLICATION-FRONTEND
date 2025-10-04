import React from 'react';
import '../stylesheets/ContactUs.css';
import { Link } from 'react-router-dom';
import ScrollToTopButton from './ScrollToTopButton';

const ContactUs = () => {
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
                <Link className="nav-link" to="/gallery">Gallery</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/contact">Contact</Link>
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
    <div className="contact-section">
      <div className="container py-6">
        <h2 className="text-center fw-bold text-success mb-5">Contact Us</h2>

        <div className="row align-items-center">
          {/* Contact Information */}
          <div className="col-md-6 mb-6">
            <div className="contact-info p-4 rounded shadow-sm bg-light">
              <h4 className="text-primary mb-3">Email</h4>
              <p>
                <a
                  href="mailto:sripratibhaupschool@gmail.com"
                  className="text-decoration-none text-dark"
                >
                  sripratibhaupschool@gmail.com
                </a>
              </p>

              <h4 className="text-primary mb-3">Contact</h4>
              <p>9000709370</p>

              <h4 className="text-primary mb-3">Address</h4>
              <p>
                4-56-2, Gangalamma temple street,<br />
                Near Bhajenarayana Swamy temple,<br />
                Vadisaleru, Andhra Pradesh 533294
              </p>
            </div>
          </div>

          {/* Embedded Google Map */}
          <div className="col-md-6 mb-2">
            <div className="map-container rounded shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1952425.8012141187!2d80.61336806173976!3d17.105314682340147!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a379e793391b729%3A0xe56427f2a0080c1d!2sSri%20Pratibha%20Public%20School!5e0!3m2!1sen!2sin!4v1744470324516!5m2!1sen!2sin"
                width="100%"
                height="400"
                style={{ border: 0, borderRadius: '10px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Sri Pratibha Public School Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ScrollToTopButton />
    </div>
  );
};

export default ContactUs;
