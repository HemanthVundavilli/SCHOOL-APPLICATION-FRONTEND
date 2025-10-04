import React from 'react';
import '../stylesheets/About.css'; // You can place the styles in this file
import { Link } from 'react-router-dom';
import ScrollToTopButton from './ScrollToTopButton';

const About = () => {
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
                <Link className="nav-link active" to="/about">About</Link>
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
    <div className="about-section py-5">
      <div className="container">
        <h2 className="text-center fw-bold mb-4 text-success">About Our School</h2>
        <div className="row align-items-center">
          <div className="col-md-6 mb-4">
            <p className="lead text-muted">
              At <span className="fw-bold text-success">Sri Pratibha UP School</span>, we believe that the true power of education lies in the passion it ignites. Our journey started with a single student’s desire to learn, and today, that passion has transformed the lives of thousands, turning ordinary students into successful individuals who are ready to make a difference in the world.
            </p>
            <p className="text-muted">
              With over <span className="fw-semibold text-primary">250+ students</span> and <span className="fw-semibold text-primary">15+ dedicated staff members</span>, our school is more than just a place of learning. It's a place where dreams are nurtured, and the spark of passion grows into a flame of success that continues to inspire future generations.
            </p>
            <p className="text-muted">
              We are committed to building a future where every child has the opportunity to explore their potential, chase their dreams, and become a beacon of success in their communities. This is the foundation of our school’s mission: to nurture passion, build character, and help students achieve their highest potential.
            </p>
          </div>
          <div className="col-md-6">
            <img
              src="./images/sliderimage-2.jpg"
              alt="School Campus"
              className="img-fluid rounded-4 shadow"
            />
          </div>
        </div>
      </div>
    </div>

    <ScrollToTopButton />
    </div>
  );
};

export default About;
