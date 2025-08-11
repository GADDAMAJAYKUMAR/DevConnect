import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddPost = () => {
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]); // files array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!description.trim()) {
      setError("Description is required");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("description", description);

      images.forEach((file) => {
        formData.append("images", file); // backend expects 'images' array
      });

      await axios.post(
        "http://localhost:5000/api/posts/addPost",
        formData,
        {
          headers: {
            "x-token": token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess("Post added successfully!");
      setDescription("");
      setImages([]);
      e.target.reset(); // reset file input
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong, try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add New Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description <span style={{ color: "red" }}>*</span>
          </label>
          <textarea
            id="description"
            className="form-control"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="images" className="form-label">
            Upload Images (optional)
          </label>
          <input
            type="file"
            id="images"
            multiple
            accept="image/*"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
};

export default AddPost;
