import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/pages/backend_web_pages/ProtectedRoute';
import HomePage from './components/pages/static_web_pages/HomePage';
import Gallery from './components/pages/static_web_pages/Gallery';
import About from './components/pages/static_web_pages/About';
import Contact from './components/pages/static_web_pages/Contact';
import Academics from './components/pages/static_web_pages/Academic';
import FeesStructure from './components/pages/static_web_pages/FeesStructure';
import Admissions from './components/pages/static_web_pages/Admissions';
import LoginMain from './components/pages/backend_web_pages/Login';
import AdminPage from './components/pages/backend_web_pages/AdminPage';
import RoleSelection from './components/pages/static_web_pages/RoleSelection';
import TeacherDashboard from './components/pages/backend_web_pages/TeacherDashBoard';
import StudentPageinTeacher from './components/pages/backend_web_pages/StudentsPageinTeacher';
//import StudentManagement from './components/pages/backend_web_pages/StudentManagement';
import StudentPage from './components/pages/backend_web_pages/StudentPage';
import TeacherPage from './components/pages/backend_web_pages/TeacherPage';
import MarksEntry from './components/pages/backend_web_pages/MarksEntry';
import StudentDashboard from './components/pages/backend_web_pages/StudentDashBoard';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/academics" element={<Academics />} />
            <Route path="/fees-structure" element={<FeesStructure />} />
            <Route path="/admissions" element={<Admissions />} />
            <Route path="/role-selection" element={<RoleSelection />} />
            <Route path="/login" element={<LoginMain />} />
            <Route path='/marks-entry' element={<MarksEntry />} />
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/studentsmanagement" element={<StudentPage />} />
                <Route path="/teachersmanagement" element={<TeacherPage />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
                <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
                // <Route path="/teacher/studentsmanagement" element={<StudentManagement />} /> 
                <Route path="/teacher/studentsmanagement" element={<StudentsPage />} /> 
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                <Route path="/student-dashboard" element={<StudentDashboard />} />
            </Route>
            
            {/* <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                <Route path="/student" element={<StudentPage />} />
            </Route> */}

            
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
