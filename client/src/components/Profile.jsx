import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const res = await axios.get('https://devconnect-ct6s.onrender.com/api/users/profile', {
          headers: {
            'x-token': token,
          },
        });
        setProfile(res.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!profile) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-sm rounded p-4 mx-auto" style={{ maxWidth: '480px', backgroundColor: '#fff' }}>
        <div className="text-center mb-4">
          <h1 style={{ fontWeight: '700', fontSize: '2.5rem', color: '#ff6f61' }}>
            {profile.name}
          </h1>
          <p className="text-muted fst-italic">Welcome to your profile page</p>
        </div>
        <div className="mb-3">
          <strong>Email:</strong>
          <p className="p-3 bg-light rounded">{profile.email}</p>
        </div>
        <div className="mb-3">
          <strong>Mobile:</strong>
          <p className="p-3 bg-light rounded">{profile.mobile || 'Not Provided'}</p>
        </div>
        <div className="mb-3">
          <strong>Skills:</strong>
          <p className="p-3 bg-light rounded">{profile.skills || 'Not Provided'}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
