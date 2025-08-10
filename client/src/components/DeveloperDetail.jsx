import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";

const AddReviewForm = ({ developerId, onReviewAdded }) => {
  const [rating, setRating] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("Please login to add a review.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/addreview",
        { taskprovider: developerId, rating: Number(rating) },
        { headers: { "x-token": token } }
      );
      setMessage(res.data.message);
      setRating("");
      onReviewAdded(); // reload reviews
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to add review");
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
      <button type="submit" className="btn btn-primary mt-2">
        Submit
      </button>
      {message && <small className="d-block mt-2 text-success">{message}</small>}
    </form>
  );
};

const DeveloperDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [developer, setDeveloper] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchDeveloper = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/profile/${id}`, {
          headers: { "x-token": token },
        });
        setDeveloper(res.data);
      } catch (error) {
        console.error("Failed to fetch developer details", error);
        navigate("/");
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/myreviews/${id}`, {
          headers: { "x-token": token },
        });
        setReviews(res.data);
      } catch (error) {
        console.error("Failed to fetch reviews", error);
        setReviews([]);
      }
    };

    const fetchAll = async () => {
      setLoading(true);
      await fetchDeveloper();
      await fetchReviews();
      setLoading(false);
    };

    fetchAll();
  }, [id, token, navigate]);

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (!developer) return <div className="container mt-4">Developer not found</div>;

  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-dark"
        style={{ background: "linear-gradient(90deg, #ff6f61, #ff9671)" }}
      >
        <div className="container">
          <Link to="/" className="navbar-brand fw-bold fs-4">
            Developer Hub
          </Link>
        </div>
      </nav>

      <div className="container mt-4">
        <h2>{developer.name}'s Profile</h2>
        <p><strong>Email:</strong> {developer.email}</p>
        <p><strong>Mobile:</strong> {developer.mobile || "N/A"}</p>
        <p>
          <strong>Skills:</strong>{" "}
          {Array.isArray(developer.skills) ? developer.skills.join(", ") : developer.skills}
        </p>

        <hr />

        <h4>Reviews</h4>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <ul className="list-group mb-3">
            {reviews.map((rev) => (
              <li key={rev._id} className="list-group-item">
                <strong>Rating:</strong> {rev.rating} / 5
              </li>
            ))}
          </ul>
        )}

        <AddReviewForm developerId={id} onReviewAdded={() => {
          // Refresh reviews after adding new one
          (async () => {
            try {
              const res = await axios.get(`http://localhost:5000/api/users/myreviews/${id}`, {
                headers: { "x-token": token },
              });
              setReviews(res.data);
            } catch {
              setReviews([]);
            }
          })();
        }} />

        <Link to="/dashboard" className="btn btn-secondary mt-4">
          Back to Developers
        </Link>
      </div>
    </>
  );
};

export default DeveloperDetail;
