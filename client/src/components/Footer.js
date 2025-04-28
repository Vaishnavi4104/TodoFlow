import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5>TodoFlow</h5>
            <p className="text-muted">
              A simple and efficient task management application to help you stay organized and productive.
            </p>
          </div>
          <div className="col-md-4 mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-decoration-none text-light">Home</Link></li>
              <li><Link to="/dashboard" className="text-decoration-none text-light">Dashboard</Link></li>
              <li><Link to="/about" className="text-decoration-none text-light">About</Link></li>
            </ul>
          </div>
          <div className="col-md-4 mb-3">
            <h5>Contact</h5>
            <ul className="list-unstyled">
              <li><i className="bi bi-envelope me-2"></i> support@todoflow.com</li>
              <li><i className="bi bi-github me-2"></i> GitHub</li>
            </ul>
          </div>
        </div>
        <hr className="my-4" />
        <div className="row">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-0">&copy; {currentYear} TodoFlow. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <p className="mb-0">Made with ❤️ for better productivity</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 