import '../stylesheets/Academics.css';
import { Link } from 'react-router-dom';
import ScrollToTopButton from './ScrollToTopButton';

const Academics = () => {
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
    <section id="academics">
      
  <div class="academic-overview">
    <h2 class="section-title">Academic Excellence at Sri Pratibha UP School</h2>
    <p class="section-description">
      At Sri Pratibha UP School, we are committed to nurturing young minds through a comprehensive and balanced curriculum that encourages intellectual curiosity, creativity, and holistic development. Our academic programs are designed to foster academic excellence while promoting life skills, critical thinking, and emotional well-being.
    </p>
  </div>

  <div class="academic-section">
    <h3 class="subheading">Curriculum & Syllabus</h3>
    <p>
      Our curriculum is based on the Andhra Pradesh State Board, designed to ensure the development of strong fundamental skills and knowledge. The syllabus includes a combination of core academic subjects, such as Mathematics, Science, Social Studies, English, and Telugu, complemented by arts, sports, and physical education.
    </p>
    <ul>
      <li><strong>Grade 1-2:</strong> Introduction to basics in English, Mathematics, and Science.</li>
      <li><strong>Grade 3-5:</strong> Strengthening fundamentals with in-depth studies of core subjects.</li>
      <li><strong>Grade 6-7:</strong> Advanced learning in subjects with project-based assignments and creative explorations.</li>
    </ul>
  </div>

  <div class="academic-section">
    <h3 class="subheading">Academic Programs</h3>
    <p>
      At Sri Pratibha, we offer a variety of specialized academic programs tailored to meet the needs of each student:
    </p>
    <ul>
      <li><strong>Honors Program:</strong> For high-achieving students who want to deepen their knowledge in specific subjects.</li>
      <li><strong>Advanced Placement (AP) Program:</strong> Provides students with an opportunity to take college-level courses while still in school.</li>
      <li><strong>Vocational Training:</strong> Hands-on courses aimed at building practical skills in areas such as technology, crafts, and entrepreneurship.</li>
    </ul>
  </div>

  <div class="academic-section">
    <h3 class="subheading">Admissions</h3>
    <p>
      Admission to Sri Pratibha UP School is open for Nursery to Grade 7. The admission process includes an online application, submission of necessary documents, and an interview process for select grades.
    </p>
    <ul>
      <li><strong>Application Deadline:</strong> The last date for applications is usually in June every year.</li>
      <li><strong>Admission Criteria:</strong> Based on age group, previous academic performance (if applicable), and personal interaction.</li>
    </ul>
  </div>

  <div class="academic-section">
    <h3 class="subheading">Exams & Assessments</h3>
    <p>
      We conduct periodic assessments throughout the academic year to evaluate students' progress. Our exams are designed to test conceptual understanding, application skills, and problem-solving ability.
    </p>
    <ul>
      <li><strong>Formative Assessments:</strong> Regular quizzes, projects, and class participation.</li>
      <li><strong>Summative Assessments:</strong> Mid-term and final exams at the end of each term.</li>
      <li><strong>External Exams:</strong> State-level and national-level exams as required by educational boards.</li>
    </ul>
  </div>

  <div class="academic-section">
    <h3 class="subheading">Academic Events</h3>
    <p>
      We organize various academic events to promote student engagement and foster a culture of learning. These include:
    </p>
    <ul>
      <li><strong>Annual Science Fair:</strong> A platform for students to showcase their scientific projects.</li>
      <li><strong>Cultural Programs:</strong> Events celebrating the rich diversity of our academic community.</li>
      <li><strong>Debates and Quiz Competitions:</strong> Promoting public speaking and critical thinking skills.</li>
    </ul>
  </div>

  <div class="academic-section">
    <h3 class="subheading">Faculty & Staff</h3>
    <p>
      Our teachers are passionate educators who are committed to the academic success and overall development of our students. The faculty members are highly qualified and experienced, bringing with them a wealth of knowledge and teaching expertise.
    </p>
    <ul>
      <li><strong>Experienced Faculty:</strong> Teachers with advanced degrees and specializations in their respective subjects.</li>
      <li><strong>Supportive Staff:</strong> Dedicated to providing an encouraging and supportive learning environment.</li>
    </ul>
  </div>

  <div class="academic-section">
    <h3 class="subheading">Life Skills and Well-being</h3>
    <p>
      We believe in nurturing the overall well-being of our students, which includes not just academic growth but also life skills like communication, time management, and emotional intelligence.
    </p>
    <ul>
      <li><strong>Health & Hygiene Programs:</strong> Ensuring physical well-being through regular health check-ups and awareness sessions.</li>
      <li><strong>Emotional Support:</strong> Counseling services for students to help them navigate personal and academic challenges.</li>
    </ul>
  </div>

  <div class="academic-section">
    <h3 class="subheading">Skill Education</h3>
    <p>
      In addition to academics, Sri Pratibha UP School places a strong emphasis on skill-based education to prepare students for real-world challenges. Students can explore:
    </p>
    <ul>
      <li><strong>Technology and Coding:</strong> Introduction to basic coding and digital literacy.</li>
      <li><strong>Art and Creativity:</strong> Encouraging creativity through painting, drawing, and performing arts.</li>
      <li><strong>Vocational Training:</strong> Courses aimed at building practical life skills, such as cooking, carpentry, and more.</li>
    </ul>
  </div>
</section>
    <ScrollToTopButton/>
</div>

  );
};

export default Academics;
