import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        // eslint-disable-next-line no-undef
        const res = await axios.get(`http://localhost:5000/api/users/myreviews/${authorId}`, {
          headers: { 'x-token': token },
        });
        setReviews(res.data);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    fetchReviews();
  }, [navigate]);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: 'linear-gradient(90deg, #ff6f61, #ff9671)' }}>
        <div className="container">
          <Link to="/" className="navbar-brand fw-bold fs-4">Developer Hub</Link>
          <div className="d-flex align-items-center gap-3">
            <Link to="/dashboard" className="btn btn-outline-light">Dashboard</Link>
            <Link to="/profile" className="btn btn-outline-light">My Profile</Link>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <h2 className="mb-4">My Reviews</h2>
        {reviews.length === 0 ? (
          <p>You have not added any reviews yet.</p>
        ) : (
          <div className="list-group">
            {reviews.map((review) => (
              <div key={review._id} className="list-group-item list-group-item-action mb-2 shadow-sm rounded">
                <h5>Task Provider: {review.taskprovider}</h5>
                <p>Rating: {review.rating} / 5</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Reviews;
