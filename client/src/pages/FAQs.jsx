import React, { useState, useEffect } from 'react';
import '../styles/FAQs.scss';

const initialFaqs = [
  { id: 1, question: "How do I order?", answer: "Browse our catalogue and add items to your cart. Proceed to checkout when you're ready to complete your purchase." },
  { id: 2, question: "How do I contact support?", answer: "You can use the contact form on our website, email us directly at support@example.com, or call our helpline at (234) 813-0223-684 during business hours." },
  { id: 3, question: "Can I track my order?", answer: "Yes, immediately after checkout you'll receive a confirmation email with tracking information. You can also track your order through your account dashboard." },
  { id: 4, question: "What payment methods do you accept?", answer: "We accept credit/debit cards (Visa, MasterCard, American Express), PayPal, bank transfers, and select cryptocurrencies." },
  { id: 5, question: "Is my payment information secure?", answer: "Yes, we use SSL encryption and PCI-compliant payment processors to ensure your data is protected." },
  { id: 6, question: "Do you offer international shipping?", answer: "Yes, we ship worldwide. Shipping costs and delivery times vary by location." },
  { id: 7, question: "What is your return policy?", answer: "You can return unused items within 30 days for a full refund. Please review our Returns & Refunds page for details." },
  { id: 8, question: "How long does shipping take?", answer: "Domestic orders typically arrive in 3-5 business days. International orders may take 7-14 business days, depending on customs." },
  { id: 9, question: "Do you have a mobile app?", answer: "Yes, our app is available on iOS and Android. Download it from the App Store or Google Play." },
  { id: 10, question: "How do I reset my password?", answer: "Click 'Forgot Password' on the login page, enter your email, and follow the instructions sent to your inbox." },
  { id: 11, question: "Can I change my order after placing it?", answer: "If your order hasn’t shipped yet, contact support immediately. Once shipped, changes cannot be made." },
  { id: 12, question: "Do you offer discounts for bulk orders?", answer: "Yes! Contact our sales team at sales@example.com for custom pricing on large orders." },
  { id: 13, question: "Are taxes included in the price?", answer: "Prices displayed exclude taxes. Applicable taxes will be calculated at checkout." },
  { id: 14, question: "How do I apply a promo code?", answer: "Enter the code in the 'Promo Code' field at checkout and click 'Apply' before payment." },
  { id: 15, question: "What if my item is out of stock?", answer: "Backordered items will ship once restocked. You’ll receive an email with an updated delivery estimate." },
  { id: 16, question: "Do you offer gift wrapping?", answer: "Yes! Select the gift-wrapping option at checkout and add a personalized message." },
  { id: 17, question: "How do I unsubscribe from emails?", answer: "Click 'Unsubscribe' at the bottom of any marketing email, or adjust preferences in your account settings." },
  { id: 18, question: "Can I cancel my subscription?", answer: "Yes, manage or cancel subscriptions anytime in your account dashboard under 'Subscriptions.'" },
  { id: 19, question: "What are your business hours?", answer: "Customer support is available Monday-Friday, 9 AM - 6 PM (GMT). Automated services run 24/7." },
  { id: 20, question: "How do I leave a product review?", answer: "Log in, go to 'My Orders,' select the item, and click 'Write a Review.'" },
  { id: 21, question: "Do you price-match competitors?", answer: "Yes, submit a price-match request within 48 hours of purchase with proof of the lower price." },
  { id: 22, question: "What’s your warranty policy?", answer: "Most products come with a 1-year manufacturer warranty. Check product details for specifics." },
  { id: 23, question: "How do I update my billing address?", answer: "Go to 'Account Settings' > 'Billing Information' to make changes." },
];

const FAQs = ({ isAdmin }) => {
  const [faqs, setFaqs] = useState(initialFaqs);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [editQ, setEditQ] = useState('');
  const [editA, setEditA] = useState('');
  const [activeIndex, setActiveIndex] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  // Load FAQs from localStorage if available
  useEffect(() => {
    const savedFaqs = localStorage.getItem('faqs');
    if (savedFaqs) {
      setFaqs(JSON.parse(savedFaqs));
    }
  }, []);

  // Save FAQs to localStorage when they change
  useEffect(() => {
    localStorage.setItem('faqs', JSON.stringify(faqs));
  }, [faqs]);

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(search.toLowerCase()) ||
    faq.answer.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = id => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      setFaqs(faqs.filter(f => f.id !== id));
    }
  };

  const handleEdit = faq => {
    setEditing(faq.id);
    setEditQ(faq.question);
    setEditA(faq.answer);
    setActiveIndex(null);
  };

  const handleEditSave = id => {
    if (!editQ.trim() || !editA.trim()) {
      alert('Both question and answer are required');
      return;
    }
    setFaqs(faqs.map(f => f.id === id ? { ...f, question: editQ, answer: editA } : f));
    setEditing(null);
  };

  const handleAdd = () => {
    if (!editQ.trim() || !editA.trim()) {
      alert('Both question and answer are required');
      return;
    }
    setFaqs([...faqs, { id: Date.now(), question: editQ, answer: editA }]);
    setEditQ('');
    setEditA('');
    setIsAdding(false);
  };

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
    setEditing(null);
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditQ('');
    setEditA('');
    setIsAdding(false);
  };

  return (
    <div className="page-content faqs-page">
      <h2>Frequently Asked Questions</h2>
      <p className="faq-subtitle">Find answers to common questions about our products and services</p>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search FAQs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="faq-search"
        />
        <i className="search-icon">🔍</i>
      </div>

      <div className="faq-list">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => (
            <div key={faq.id} className={`faq-item ${activeIndex === index ? 'active' : ''}`}>
              {editing === faq.id ? (
                <div className="faq-edit-form">
                  <input 
                    value={editQ} 
                    onChange={e => setEditQ(e.target.value)} 
                    className="edit-input"
                    placeholder="Edit question"
                  />
                  <textarea 
                    value={editA} 
                    onChange={e => setEditA(e.target.value)} 
                    className="edit-textarea"
                    placeholder="Edit answer"
                    rows="4"
                  />
                  <div className="edit-actions">
                    <button onClick={() => handleEditSave(faq.id)} className="save-btn">Save</button>
                    <button onClick={cancelEdit} className="cancel-btn">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div 
                    className="faq-question" 
                    onClick={() => toggleAccordion(index)}
                  >
                    <span>{faq.question}</span>
                    <span className="toggle-icon">{activeIndex === index ? '−' : '+'}</span>
                  </div>
                  <div className="faq-answer">
                    {faq.answer}
                    {isAdmin && (
                      <div className="admin-actions">
                        <button onClick={() => handleEdit(faq)} className="edit-btn">Edit</button>
                        <button onClick={() => handleDelete(faq.id)} className="delete-btn">Delete</button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <div className="no-results">
            No FAQs found matching your search. Try different keywords.
          </div>
        )}
      </div>

      {isAdmin && (
        <div className="add-faq-section">
          {isAdding ? (
            <div className="faq-add-form">
              <h3>Add New FAQ</h3>
              <input
                placeholder="Enter new question"
                value={editQ}
                onChange={e => setEditQ(e.target.value)}
                className="add-input"
              />
              <textarea
                placeholder="Enter detailed answer"
                value={editA}
                onChange={e => setEditA(e.target.value)}
                className="add-textarea"
                rows="4"
              />
              <div className="add-actions">
                <button onClick={handleAdd} className="add-btn">Add FAQ</button>
                <button onClick={cancelEdit} className="cancel-btn">Cancel</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setIsAdding(true)} className="add-toggle-btn">
              + Add New FAQ
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FAQs;