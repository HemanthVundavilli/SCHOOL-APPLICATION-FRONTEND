import React from 'react';
import '../stylesheets/FeesStructure.css';
import { Link } from 'react-router-dom';
import ScrollToTopButton from './ScrollToTopButton';

const FeesStructure = () => {
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
                <Link className="nav-link active" to="/fees-structure">Fees Structure</Link>
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
    <div className="fees-structure-section py-5">
      <div className="container">
        <h2 className="text-center text-primary fw-bold mb-4">Fees Structure</h2>
        <p className="text-center text-muted mb-5">
          We believe in affordable, transparent education. Here is the fee structure for each class level.
        </p>

        <div className="table-responsive">
          <table className="table table-bordered text-center">
            <thead className="table-primary">
              <tr>
                <th>Class</th>
                <th>Admission Fee</th>
                <th>Tuition Fee (Yearly)</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Nursery</td>
                <td>₹1,000</td>
                <td>₹6,000</td>
                <td>₹7,000</td>
              </tr>
              <tr>
                <td>LKG</td>
                <td>₹1,000</td>
                <td>₹6,500</td>
                <td>₹7,500</td>
              </tr>
              <tr>
                <td>UKG</td>
                <td>₹1,000</td>
                <td>₹6,500</td>
                <td>₹7,500</td>
              </tr>
              <tr>
                <td>Class 1</td>
                <td>₹1,000</td>
                <td>₹7,000</td>
                <td>₹8,000</td>
              </tr>
              <tr>
                <td>Class 2</td>
                <td>₹1,000</td>
                <td>₹7,500</td>
                <td>₹8,500</td>
              </tr>
              <tr>
                <td>Class 3</td>
                <td>₹1,000</td>
                <td>₹8,000</td>
                <td>₹9,000</td>
              </tr>
              <tr>
                <td>Class 4</td>
                <td>₹1,000</td>
                <td>₹8,000</td>
                <td>₹9,000</td>
              </tr>
              <tr>
                <td>Class 5</td>
                <td>₹1,000</td>
                <td>₹8,500</td>
                <td>₹9,500</td>
              </tr>
              <tr>
                <td>Class 6</td>
                <td>₹1,000</td>
                <td>₹9,000</td>
                <td>₹10,000</td>
              </tr>
              <tr>
                <td>Class 7</td>
                <td>₹1,000</td>
                <td>₹9,500</td>
                <td>₹10,500</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-muted text-center mt-4">
          Note: Fees are subject to change. Please contact the school office for the most updated information.
        </p>
      </div>
    </div>
    <ScrollToTopButton />
    </div>
  );
};

export default FeesStructure;
