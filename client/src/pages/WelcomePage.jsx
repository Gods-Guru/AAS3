// import React, { Link, useState } from 'react';
import React from 'react';
import '../styles/WelcomePage.scss';

const WelcomePage = () => {
  // const [showLogin, setShowLogin] = useState(false);
  // const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="welcome-page">
      {/* Hero Section */}
      <div className="overlay">
        <div className="welcome-content">
          <h1 className="brand-title">AutoLux</h1>
          <p className="tagline">Discover premium automobile accessories tailored for you</p>
          <button className="enter-btn">Explore Now</button>
        </div>
      </div>
      {/* Feature Section - OUTSIDE overlay */}
      <section className="features-section">
        <h2 className="features-title">Why Choose AutoLux?</h2>
        <div className="features-list">
          <div className="feature-card">
            {/* Place your image here: <img src={require('../assets/feature1.jpg')} alt="Premium Quality" /> */}
            <div className="feature-img-placeholder">Image 1</div>
            <h3>Premium Quality</h3>
            <p>Only the best materials and brands for your vehicle.</p>
          </div>
          <div className="feature-card">
            {/* Place your image here: <img src={require('../assets/feature2.jpg')} alt="Fast Delivery" /> */}
            <div className="feature-img-placeholder">Image 2</div>
            <h3>Fast Delivery</h3>
            <p>Get your accessories delivered quickly and reliably.</p>
          </div>
          <div className="feature-card">
            {/* Place your image here: <img src={require('../assets/feature3.jpg')} alt="Expert Support" /> */}
            <div className="feature-img-placeholder">Image 3</div>
            <h3>Expert Support</h3>
            <p>Our team is here to help you choose the perfect fit.</p>
          </div>
          <div className="feature-card">
            {/* Place your image here: <img src={require('../assets/feature3.jpg')} alt="Expert Support" /> */}
            <div className="feature-img-placeholder">Image 4</div>
            <h3>User Experience</h3>
            <p>Your satisfaction is our topmost priority so we prioritize good user experience.</p>
          </div>
        </div>
      </section>
      {/* Testimonial Section - OUTSIDE overlay */}
      <section className="testimonial-section">
        <h2 className="testimonial-title">What Our Customers Say</h2>
        <div className="testimonial-list">
          <div className="testimonial-card">
            {/* Place your image here: <img src={require('../assets/customer1.jpg')} alt="Customer 1" /> */}
            <div className="testimonial-img-placeholder">Customer 1</div>
            <p className="testimonial-text">“AutoLux made my car look and feel brand new. Highly recommended!”</p>
            <span className="testimonial-name">— Alex G.</span>
          </div>
          <div className="testimonial-card">
            {/* Place your image here: <img src={require('../assets/customer2.jpg')} alt="Customer 2" /> */}
            <div className="testimonial-img-placeholder">Customer 2</div>
            <p className="testimonial-text">“Fast delivery and amazing quality. I’ll shop here again!”</p>
            <span className="testimonial-name">— Priya S.</span>
          </div>
        </div>
      </section>
      {/* Call to Action Section - OUTSIDE overlay */}
      <section className="cta-section">
        <h2>Ready to upgrade your ride?</h2>
        <button className="cta-btn">Shop Now</button>
      </section>
    </div>
  );
};

export default WelcomePage;