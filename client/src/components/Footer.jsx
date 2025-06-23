import '../styles/Footer.scss';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Company Info */}
        <div className="footer-section">
          <h3 className="footer-heading">AutoLux</h3>
          <p className="footer-text">Premium automotive accessories and parts for enthusiasts and professionals alike.</p>
          <div className="social-icons">
            <a href="https://facebook.com" aria-label="Facebook"><FaFacebook /></a>
            <a href="https://twitter.com" aria-label="Twitter"><FaTwitter /></a>
            <a href="https://instagram.com" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://linkedin.com" aria-label="LinkedIn"><FaLinkedin /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li><a href="/about">About Us</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/testimonials">Testimonials</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/faq">FAQ</a></li>
          </ul>
        </div>

        {/* Categories */}
        <div className="footer-section">
          <h3 className="footer-heading">Categories</h3>
          <ul className="footer-links">
            <li><a href="/category/">Infotainment</a></li>
            <li><a href="/category/">Exterior Accessories</a></li>
            <li><a href="/category/">Gadgets</a></li>
            <li><a href="/category/">Tools & Kits</a></li>
            <li><a href="/category/">Car Cover</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h3 className="footer-heading">Contact Us</h3>
          <div className="contact-info">
            <p><FaMapMarkerAlt /> 123 Auto Street, Vehicle City, VC 10101</p>
            <p><FaWhatsapp /><a href="https://wa.me/+2348130223684">+2348130223684</a></p>
            <p><FaEnvelope /><a href="mailto:ekonduobe@gmail.com">ekonduobe@gmail.com</a></p>
            <p><FaPhone />+2348130223684</p>
          </div>
          
          {/* Newsletter */}
          {/* <div className="newsletter">
            <h4>Subscribe to our newsletter</h4>
            <form className="newsletter-form">
              <input type="email" placeholder="Your email address" required />
              <button type="submit">Subscribe</button>
            </form>
          </div> */}
        </div>
      </div>

      {/* Copyright & Legal */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} AutoLux. All rights reserved.</p>
        <div className="legal-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/shipping">Shipping Policy</a>
          <a href="/return-policy">Return Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;