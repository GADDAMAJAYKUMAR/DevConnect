import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [selectedAuthorId, setSelectedAuthorId] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [errorReviews, setErrorReviews] = useState("");
  const [ratingInput, setRatingInput] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const res = await axios.get(
          "https://devconnect-ct6s.onrender.com/api/posts/getallposts?page=1&limit=10",
          {
            headers: { "x-token": token },
          }
        );
        setPosts(res.data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };
    fetchPosts();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Fetch reviews for selected author
  const fetchReviews = async (authorId) => {
    setLoadingReviews(true);
    setErrorReviews("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `https://devconnect-ct6s.onrender.com/api/users/myreviews/${authorId}`,
        { headers: { "x-token": token } }
      );
      setReviews(res.data);
    } catch (error) {
      setErrorReviews("Failed to fetch reviews");
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  const viewAuthorReviews = (authorId) => {
    setSelectedAuthorId(authorId);
    setRatingInput("");
    setSubmitMessage("");
    fetchReviews(authorId);
  };

  const closeReviews = () => {
    setSelectedAuthorId(null);
    setReviews([]);
    setSubmitMessage("");
  };

  // Calculate average rating from reviews
  const getAverageRating = () => {
    if (reviews.length === 0) return "No ratings yet";
    const sum = reviews.reduce((acc, r) => acc + Number(r.rating), 0);
    return (sum / reviews.length).toFixed(1);
  };

  // Handle review form submit
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage("");
    const token = localStorage.getItem("token");
    if (!token) {
      setSubmitMessage("Please login to add a review.");
      return;
    }
    if (!ratingInput || ratingInput < 1 || ratingInput > 5) {
      setSubmitMessage("Rating must be between 1 and 5.");
      return;
    }
    try {
      await axios.post(
        "https://devconnect-ct6s.onrender.com/api/users/addreview",
        { taskprovider: selectedAuthorId, rating: Number(ratingInput) },
        { headers: { "x-token": token } }
      );
      setSubmitMessage("Review added successfully!");
      setRatingInput("");
      fetchReviews(selectedAuthorId); // refresh reviews list
    } catch (error) {
      setSubmitMessage(
        error.response?.data?.message || "Failed to add review"
      );
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav
        className="navbar navbar-expand-lg navbar-dark"
        style={{ background: "linear-gradient(90deg, #ff6f61, #ff9671)" }}
      >
        <div className="container">
          <Link to="/" className="navbar-brand fw-bold fs-4">
            Developer Hub
          </Link>
          <div className="d-flex align-items-center gap-3">
            <Link to="/addpost" className="btn btn-outline-light">
              Add Post
            </Link>
            <Link to="/reviews" className="btn btn-outline-light">
              My Reviews
            </Link>
            <Link to="/profile" className="btn btn-outline-light">
              My Profile
            </Link>
          </div>
          <button onClick={handleLogout} className="btn btn-light text-danger">
            Logout
          </button>
        </div>
      </nav>

      {/* Posts Feed */}
      <div className="container mt-4">
        <h2 className="mb-4">Posts Feed</h2>
        {posts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          <div className="row g-4">
            {posts.map((post) => (
              <div key={post._id} className="col-sm-12 col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm">
                  <div
                    className="card-header bg-primary text-white"
                    style={{ fontWeight: "600", fontSize: "1.25rem" }}
                  >
                    {post.author?.name || "Unknown Author"}
                  </div>
                  <div className="card-body d-flex flex-column">
                    <p>{post.description}</p>
                    {/* Display images if available */}
                    {post.images && post.images.length > 0 && (
                      <div className="post-images mb-3">
                        {post.images.map((imgUrl, index) => (
                          <img
                            key={index}
                            src={imgUrl}
                            alt={`post-img-${index}`}
                            style={{ maxWidth: "100%", marginBottom: "10px" }}
                          />
                        ))}
                      </div>
                    )}
                    <small className="text-muted mt-auto">
                      Posted on: {new Date(post.createdAt).toLocaleString()}
                    </small>

                    <button
                      className="btn btn-sm btn-info mt-3"
                      onClick={() => viewAuthorReviews(post.author._id)}
                    >
                      View Reviews & Rating
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reviews Modal */}
        {selectedAuthorId && (
          <div
            className="modal show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Reviews & Ratings</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeReviews}
                  ></button>
                </div>
                <div className="modal-body">
                  {loadingReviews ? (
                    <p>Loading reviews...</p>
                  ) : errorReviews ? (
                    <p className="text-danger">{errorReviews}</p>
                  ) : (
                    <>
                      <p>
                        <strong>Average Rating:</strong> {getAverageRating()} ⭐
                      </p>
                      {reviews.length === 0 ? (
                        <p>No reviews yet for this user.</p>
                      ) : (
                        reviews.map((review) => (
                          <div
                            key={review._id}
                            className="border p-2 mb-2 rounded"
                          >
                            <p>Rating: {review.rating} ⭐</p>
                            <p>
                              Reviewer:{" "}
                              {review.taskWorker?.name || "Unknown Reviewer"}
                            </p>
                          </div>
                        ))
                      )}

                      {/* Add Review Form */}
                      <form onSubmit={handleReviewSubmit} className="mt-3">
                        <label className="form-label">
                          Add Your Rating (1-5):
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="5"
                          className="form-control"
                          value={ratingInput}
                          onChange={(e) => setRatingInput(e.target.value)}
                          required
                        />
                        <button type="submit" className="btn btn-primary mt-2">
                          Submit Review
                        </button>
                      </form>
                      {submitMessage && (
                        <small className="d-block mt-2">{submitMessage}</small>
                      )}
                    </>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={closeReviews}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
