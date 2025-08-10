import React, { useState } from 'react';
import axios from 'axios';

const AddReviewForm = ({ developerId }) => {
  const [rating, setRating] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please login to add a review.');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/users/addreview',
        { taskprovider: developerId, rating: Number(rating) },
        { headers: { 'x-token': token } }
      );
      setMessage(res.data.message);
      setRating('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add review');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <label className="form-label">Add Review (1-5):</label>
      <input
        type="number"
        min="1"
        max="5"
        className="form-control"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        required
      />
      <button type="submit" className="btn btn-sm btn-primary mt-2">
        Submit
      </button>
      {message && <small className="d-block mt-2 text-success">{message}</small>}
    </form>
  );
};

export default AddReviewForm;
