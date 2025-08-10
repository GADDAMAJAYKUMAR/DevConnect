import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Using promise style
    axios.post('http://localhost:5000/api/users/login', formData)
      .then(res => {
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          navigate('/dashboard');
        } else {
          alert("Login failed!");
        }
      })
      .catch(err => {
        console.error(err);
        alert("Error logging in. Please check your credentials.");
      });
  };

  return (
    <div 
      className="d-flex justify-content-center align-items-center vh-100" 
      style={{ background: 'linear-gradient(to right, #ff9671, #ffc75f)' }}
    >
      <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="text-center mb-4 fw-bold">Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input 
              type="email" 
              name="email" 
              className="form-control" 
              placeholder="Enter email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input 
              type="password" 
              name="password" 
              className="form-control" 
              placeholder="Enter password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </div>
          <button 
            type="submit" 
            className="btn w-100 text-white" 
            style={{ background: 'linear-gradient(90deg, #ff6f61, #ff9671)' }}
          >
            Login
          </button>
        </form>
        <p className="text-center mt-3">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
