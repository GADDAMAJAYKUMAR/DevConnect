import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [developers, setDevelopers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDevelopers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const res = await axios.get("http://localhost:5000/api/users/allprofile", {
          headers: { "x-token": token },
        });
        setDevelopers(res.data);
      } catch (error) {
        console.error("Failed to fetch developers:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };
    fetchDevelopers();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
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
          <button onClick={handleLogout} className="btn btn-light text-danger">
            Logout
          </button>
        </div>
      </nav>

      {/* Developers Cards */}
      <div className="container mt-4">
        <h2 className="mb-4">Developers List</h2>
        {developers.length === 0 ? (
          <p>No developers found.</p>
        ) : (
          <div className="row g-4">
            {developers.map((dev) => (
              <div key={dev._id} className="col-sm-12 col-md-6 col-lg-4">
                <div className="card h-100 shadow-sm">
                  <div
                    className="card-header bg-primary text-white"
                    style={{ fontWeight: "600", fontSize: "1.25rem" }}
                  >
                    {dev.name}
                  </div>
                  <div className="card-body d-flex flex-column">
                    <p>
                      <strong>Email:</strong> {dev.email}
                    </p>
                    {/* Hide mobile on cards as per your request */}
                    <p>
                      <strong>Skills:</strong>{" "}
                      {Array.isArray(dev.skills) ? dev.skills.join(", ") : dev.skills || "N/A"}
                    </p>
                    <div className="mt-auto">
                      <Link to={`/developer/${dev._id}`} className="btn btn-outline-primary w-100">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
