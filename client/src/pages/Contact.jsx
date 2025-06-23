import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import '../styles/Contact.scss';

const Contact = () => {
  const form = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    emailjs.sendForm(
      'service_lym8w9i',
      'template_8hmz3no',
      form.current,
      'hvBq6hu4ldkm-oY-w'
    )
      .then(() => {
        setSubmitStatus({
          type: 'success',
          message: 'Message sent successfully! We will get back to you soon.'
        });
        form.current.reset();
      })
      .catch((error) => {
        setSubmitStatus({
          type: 'error',
          message: `Failed to send message. Please try again or email us directly. (Error: ${error.text || 'Unknown error'})`
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="contact-page">
      <div className="contact-header">
        <h2>Get In Touch</h2>
        <p className="intro-text">
          We'd love to hear from you! Whether you have questions about our services, 
          need support, or just want to say hello, fill out the form below or 
          email us directly at <a href="mailto:ekonduobe@gmail.com">ekonduobe@gmail.com</a>.
        </p>
      </div>

      <div className="contact-content">
        <form ref={form} onSubmit={sendEmail}>
          <div className="form-group">
            <label htmlFor="user_name">Your Name</label>
            <input 
              type="text" 
              id="user_name"
              name="user_name" 
              placeholder="Enter your name" 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="user_email">Email Address</label>
            <input 
              type="email" 
              id="user_email"
              name="user_email" 
              placeholder="Enter your email" 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="user_number">Phone Number</label>
            <input 
              type="number" 
              id="user_number"
              name="user_number" 
              placeholder="Enter your number"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Your Message</label>
            <textarea 
              id="message"
              name="message" 
              placeholder="How can we help you?" 
              rows="5" 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </button>

          {submitStatus && (
            <div className={`status-message ${submitStatus.type}`}>
              {submitStatus.message}
            </div>
          )}
        </form>

        <div className="contact-info">
          <h3>Other Ways to Reach Us</h3>
          <ul>
            <li>
              <strong>Email:</strong> ekonduobe@gmail.com
            </li>
            <li>
              <strong>Whatsapp:</strong> <a href="https://wa.me/+2348130223684">+2348130223684</a>
            </li>
            <li>
              <strong>Response Time:</strong> We typically reply within 24 hours
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Contact;