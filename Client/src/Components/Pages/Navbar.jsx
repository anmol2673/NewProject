import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import '../Design/Navbar.css';
import LoginPage from './LoginPage';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const auth = localStorage.getItem('user');
  const navigate = useNavigate();



  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  }


  return (
    <nav>
      <NavLink to="/" className='title'>Rage AI</NavLink>
      <div className='menu' onClick={() => {
        setMenuOpen(!menuOpen);
      }}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={menuOpen ? "open" : ""}>

        <li><NavLink to="/dashboard">Dashboard</NavLink></li>
        <li><NavLink to="/new-content">NewContent</NavLink></li>
        <li><NavLink to="/settings">Settings</NavLink></li>
        <li></li>
        <li>{auth ? <NavLink onClick={handleLogout} to="/login">Logout</NavLink> : <NavLink to="/login">Login</NavLink>}</li>

      </ul>
    </nav>
  );
}

export default Navbar;
//        