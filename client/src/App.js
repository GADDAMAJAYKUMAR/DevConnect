import React from 'react';
import Home from './Home'; 
import { BrowserRouter as Router , Route, Routes } from "react-router-dom";
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Reviews from './components/Reviews';
import DeveloperDetail from './components/DeveloperDetail';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
       <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route path="/profile" element={<Profile/>} />
          <Route path="/reviews" element={<Reviews />} />
        <Route path="/developer/:id" element={<DeveloperDetail />} />
        
      </Routes>
    </Router>
  );
}


export default App