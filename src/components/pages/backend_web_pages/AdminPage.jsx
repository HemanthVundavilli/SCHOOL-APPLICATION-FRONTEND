import { useNavigate } from 'react-router-dom';
import React from 'react';
import api from './../api/axios';
import LogoutButton from './LogoutButton';
import './../stylesheets/AdminPage.css';
const AdminPage = () => {
  const [studentsList, setStudentsList] = React.useState([]);
  const [teachersList, setTeachersList] = React.useState([]);
  const [message, setMessage] = React.useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    async function fetchLists() {
      try {
        const [studentsRes, teachersRes] = await Promise.all([
          api.get('/admins/students'),
          api.get('/admins/teachers'),
        ]);
        setStudentsList(studentsRes.data);
        setTeachersList(teachersRes.data);
      } catch {
        setMessage('Failed to load students or teachers');
      }
    }
    fetchLists();
  }, []);

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      <LogoutButton />
      {message && <p className="message">{message}</p>}

      <section>
        <h2>Students</h2>
        <ul className="list">
          {studentsList.map((s) => (
            <li key={s._id}>
              {s.name} ({s.admissionNumber})
            </li>
          ))}
        </ul>
        <button onClick={() => navigate('/studentsmanagement')}>Manage Students</button>
      </section>

      <section>
        <h2>Teachers</h2>
        <ul className="list">
          {teachersList.map((t) => (
            <li key={t._id}>{t.name}</li>
          ))}
        </ul>
        <button onClick={() => navigate('/teachersmanagement')}>Manage Teachers</button>
      </section>
    </div>
  );
};

export default AdminPage;