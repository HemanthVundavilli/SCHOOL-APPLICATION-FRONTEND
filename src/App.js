import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/pages/CommonPages/ProtectedRoute';
import HomePage from './components/pages/static_web_pages/HomePage';
import Gallery from './components/pages/static_web_pages/Gallery';
import About from './components/pages/static_web_pages/About';
import Contact from './components/pages/static_web_pages/Contact';
import Academics from './components/pages/static_web_pages/Academic';
import FeesStructure from './components/pages/static_web_pages/FeesStructure';
import Admissions from './components/pages/static_web_pages/Admissions';
import LoginMain from './components/pages/CommonPages/Login';
import AdminPage from './components/pages/AdminPages/AdminPage';
import RoleSelection from './components/pages/static_web_pages/RoleSelection';
import TeacherDashboard from './components/pages/TeacherPages/TeacherDashBoard';
import StudentPageinTeacher from './components/pages/TeacherPages/StudentsPageinTeacher';
//import StudentManagement from './components/pages/backend_web_pages/StudentManagement';
import StudentPage from './components/pages/AdminPages/StudentPage';
import TeacherPage from './components/pages/AdminPages/TeacherPage';
import MarksEntry from './components/pages/CommonPages/MarksEntry';
import StudentDashboard from './components/pages/StudentPages/StudentDashBoard';
import FeesEntry from './components/pages/CommonPages/FeesEntry';
import EventsPage from "./components/pages/AdminPages/EventsPage";
import SettingsPage from './components/pages/AdminPages/Settings';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import AttendancePage from './components/pages/CommonPages/AttendancePage';

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
                <Route path="/admin/studentsmanagement" element={<StudentPage />} />
                <Route path="/admin/teachersmanagement" element={<TeacherPage />} />
                <Route path="/admin/events" element={<EventsPage />} />
                <Route path="/admin/attendance" element={<AttendancePage />} />
                <Route path="/admin/settings" element={<SettingsPage />} />
                <Route path='/admin/marks-entry' element={<MarksEntry />} />
                <Route path='/admin/fees-entry' element={<FeesEntry />} />
                
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
                <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
{/* <Route path="/teacher/studentsmanagement" element={<StudentManagement />} /> */}
                <Route path="/teacher/studentsmanagement" element={<StudentPageinTeacher />} /> 
                <Route path="/teacher/attendance" element={<AttendancePage />} />
                <Route path='/teacher/marks-entry' element={<MarksEntry />} />
                <Route path="/teacher/settings" element={<SettingsPage />} />
                <Route path='/teacher/fees-entry' element={<FeesEntry />} />
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
