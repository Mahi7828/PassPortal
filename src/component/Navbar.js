import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close the menu when a link is clicked
  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">Mood Indigo</div>
        <div className="hamburger" onClick={toggleMenu}>
          <div className={`bar ${isOpen ? "open" : ""}`}></div>
          <div className={`bar ${isOpen ? "open" : ""}`}></div>
          <div className={`bar ${isOpen ? "open" : ""}`}></div>
        </div>
        <div className={`nav-links ${isOpen ? "active" : ""}`}>
          <Link to="/vippass" className="pass" onClick={closeMenu}>
            VIP Pass
          </Link>
          <Link to="/pass" className="pass" onClick={closeMenu}>
            Pass
          </Link>
          <Link to="/glpass" className="pass" onClick={closeMenu}>
            GL Pass
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
