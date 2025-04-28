import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import logo from '../assets/logo.svg';

const Navbar = ({ theme, toggleTheme }) => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={logo}
            alt="Logo"
            style={{ height: '32px', marginRight: '10px' }}
          />
          TodoFlow
        </Link>
        <div className="d-flex align-items-center ms-auto">
          <div className="form-check form-switch me-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="themeSwitch"
              checked={theme === 'dark'}
              onChange={toggleTheme}
            />
            <label className="form-check-label text-light" htmlFor="themeSwitch">
              {theme === 'dark' ? 'Dark' : 'Light'} Mode
            </label>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <span className="nav-link">Welcome, {user?.name}</span>
                  </li>
                  <li className="nav-item">
                    <button
                      className="btn btn-link nav-link"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 