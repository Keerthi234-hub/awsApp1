import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">
          TourismApp
        </Link>
      </div>
      <div className="navbar-menu">
        <Link to="/search" className="navbar-item">
          Explore
        </Link>
        <Link to="/profile" className="navbar-item">
          My Profile
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;