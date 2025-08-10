import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Home = () => {
  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-dark" style={{ background: 'linear-gradient(90deg, #ff6f61, #ff9671)' }}>
        <div className="container-fluid d-flex justify-content-between align-items-center">
          {/* Brand */}
          <Link className="navbar-brand fw-bold fs-4 m-0" to="/">
            Developer Hub
          </Link>

          {/* Nav Buttons */}
          <div className="d-flex gap-2">
            <Link className="btn btn-light text-dark px-3" to="/login">
              Login
            </Link>
            <Link className="btn btn-light text-dark px-3" to="/register">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div
        style={{
          height: '100vh',
          background: 'linear-gradient(to right, #ff9671, #ffc75f)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '20px',
          paddingBottom: '80px', // extra space for footer
        }}
      >
        <h1 className="text-white fw-bold fs-2 mb-3">Welcome to Developer Hub</h1>
        <p className="text-dark fs-5" style={{ maxWidth: '600px' }}>
          Create a developer profile, share posts, and get help from other developers.
        </p>
        <div className="mt-4 d-flex flex-wrap justify-content-center gap-2">
          <Link to="/register" className="btn btn-light text-dark px-4">
            Get Started
          </Link>
          <Link to="/login" className="btn btn-outline-light px-4">
            Login
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="text-center text-white"
        style={{ backgroundColor: '#ff6f61', padding: '15px 0', position: 'fixed', width: '100%', bottom: 0 }}
      >
        <div>
          Developed by Ajay Kumar Gaddam | Email: <a href="mailto:gaddamajaykumar1@gmail.com" className="text-white">gaddamajaykumar1@gmail.com</a>
        </div>
      </footer>
    </>
  );
};

export default Home;
