import React, { useState } from 'react';
import '../styles/About.scss';
import teamImage from '../assets/team.jpg'; // I'll need to add this image
import founderImage from '../assets/founder.jpg'; // I'll need to add this image
import { Link } from 'react-router-dom';
// Reminder: Make sure to replace the image paths with actual images in my project structure

const About = () => {
  const [activeTab, setActiveTab] = useState('mission');

  const stats = [
    { value: '10K+', label: 'Happy Customers' },
    { value: '2010', label: 'Founded In' },
    { value: '50+', label: 'Team Members' },
    { value: '24/7', label: 'Support' }
  ];

  const teamMembers = [
    { name: 'Alex Johnson', role: 'CEO & Founder', image: founderImage },
    { name: 'Sarah Miller', role: 'Head of Operations', image: teamImage },
    { name: 'David Chen', role: 'Lead Developer', image: teamImage },
    { name: 'Maria Garcia', role: 'Customer Success', image: teamImage }
  ];

  return (
    <div className="page-content about-page">
      <section className="about-hero">
        <div className="hero-content">
          <h1>Driving Innovation Forward</h1>
          <p className="hero-subtitle">
            At AutoLux, we're revolutionizing the automotive experience with cutting-edge technology 
            and unparalleled customer service.
          </p>
        </div>
      </section>

      <section className="about-stats">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <h3>{stat.value}</h3>
            <p>{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="about-tabs">
        <div className="tab-buttons">
          <button 
            className={activeTab === 'mission' ? 'active' : ''}
            onClick={() => setActiveTab('mission')}
          >
            Our Mission
          </button>
          <button 
            className={activeTab === 'values' ? 'active' : ''}
            onClick={() => setActiveTab('values')}
          >
            Our Values
          </button>
          <button 
            className={activeTab === 'history' ? 'active' : ''}
            onClick={() => setActiveTab('history')}
          >
            Our Story
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'mission' && (
            <div>
              <h2>Redefining Automotive Excellence</h2>
              <p>
                AutoLux was founded with a simple goal: to transform the way people interact with automotive 
                technology. We combine innovative engineering with customer-centric design to create products 
                that aren't just tools, but partners in your journey.
              </p>
              <p>
                Our mission extends beyond products - we're building a community of passionate individuals 
                who share our vision for smarter, safer, and more sustainable mobility solutions.
              </p>
            </div>
          )}
          
          {activeTab === 'values' && (
            <div>
              <h2>The Principles That Guide Us</h2>
              <ul className="values-list">
                <li>
                  <h3>Innovation</h3>
                  <p>We constantly push boundaries to deliver groundbreaking solutions.</p>
                </li>
                <li>
                  <h3>Integrity</h3>
                  <p>Honesty and transparency in all our relationships.</p>
                </li>
                <li>
                  <h3>Customer Obsession</h3>
                  <p>Your experience is at the heart of everything we do.</p>
                </li>
                <li>
                  <h3>Sustainability</h3>
                  <p>Committed to eco-friendly practices and products.</p>
                </li>
              </ul>
            </div>
          )}
          
          {activeTab === 'history' && (
            <div>
              <h2>From Garage to Global</h2>
              <p>
                What began as a small startup in a Silicon Valley garage has grown into an industry leader 
                with a global presence. Founder Alex Johnson started AutoLux with a vision to modernize 
                vehicle technology after experiencing frustrations with existing solutions.
              </p>
              <p>
                Today, our team of engineers, designers, and automotive enthusiasts continues to build on 
                that original vision, earning numerous industry awards and patents along the way.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="team-section">
        <h2>Meet Our Leadership</h2>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-card">
              <div className="team-image-container">
                <img src={member.image} alt={member.name} />
              </div>
              <h3>{member.name}</h3>
              <p className="role">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Experience the AutoLux Difference?</h2>
        <div className="cta-buttons">
          <button className="primary-cta"><Link to='/catalogue'>Shop Now</Link></button>
          <button className="secondary-cta"><Link to='/contact'>Contact Us</Link></button>
        </div>
      </section>
    </div>
  );
};

export default About;