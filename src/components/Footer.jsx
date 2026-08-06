import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-col">
            <h4>Aurelia</h4>
            <p>Timeless elegance for the modern soul.</p>
          </div>
          <div className="footer-col">
            <h4>Shop</h4>
            <ul>
              <li><Link to="/collections">Rings</Link></li>
              <li><Link to="/collections">Necklaces</Link></li>
              <li><Link to="/collections">Earrings</Link></li>
              <li><Link to="/collections">Bracelets</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>About</h4>
            <ul>
              <li><Link to="/about">Our Story</Link></li>
              <li><a href="#craftsmanship">Craftsmanship</a></li>
              <li><a href="#sustainability">Sustainability</a></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Follow Us</h4>
            <div className="social-links" style={{ display: 'flex', gap: '15px' }}>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
              <a href="https://pinterest.com" target="_blank" rel="noreferrer">Pinterest</a>
            </div>
          </div>
        </div>
        <div className="copyright">
          <p>&copy; {new Date().getFullYear()} Aurelia Jewellery. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};
