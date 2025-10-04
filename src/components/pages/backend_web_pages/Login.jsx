import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import api from './../api/axios'; // Adjust path as needed
import '../stylesheets/Login.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { email: form.email, password: form.password });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);

      if (res.data.role === 'admin') navigate('/admin');
      else if (res.data.role === 'teacher') navigate('/teacher-dashboard');
      else if (res.data.role === 'student') navigate('/student-dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-title">Login</div>
      <form onSubmit={handleSubmit}>
        <div className="login-form-group">
          <input
            type="email"
            name="email"
            className="login-input"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            autoFocus
          />
        </div>
        <div className="login-form-group">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className="login-input"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="login-eye"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {error && <div className="login-error">{error}</div>}
        <button type="submit" className="login-btn">Submit</button>
      </form>
      <div className="login-links">
        <Link to="/" className="login-home-link">Go to Home Page</Link>
      </div>
    </div>
  );
};

export default Login;