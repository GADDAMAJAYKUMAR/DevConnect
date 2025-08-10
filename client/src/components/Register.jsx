import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    skills: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/users/register', {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        skills: formData.skills,
        password: formData.password
      });

      alert("Registration successful!");
      console.log(res.data);
      navigate('/login');
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Registration failed!");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" 
         style={{ background: 'linear-gradient(to right, #ff9671, #ffc75f)' }}>
      <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="text-center mb-4 fw-bold">Register</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Name</label>
            <input 
              type="text" 
              name="name" 
              className="form-control" 
              placeholder="Enter your name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>
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
            <label>Mobile No</label>
            <input 
              type="tel" 
              name="mobile" 
              className="form-control" 
              placeholder="Enter phone number" 
              value={formData.mobile} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="mb-3">
            <label>Skills</label>
            <input 
              type="text" 
              name="skills" 
              className="form-control" 
              placeholder="Enter your skills" 
              value={formData.skills} 
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
          <div className="mb-3">
            <label>Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword" 
              className="form-control" 
              placeholder="Confirm password" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              required 
            />
          </div>
          <button 
            type="submit" 
            className="btn w-100 text-white" 
            style={{ background: 'linear-gradient(90deg, #ff6f61, #ff9671)' }}
          >
            Register
          </button>
        </form>
        <p className="text-center mt-3">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
