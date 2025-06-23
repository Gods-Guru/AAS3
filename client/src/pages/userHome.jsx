// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import UserNavBar from '../components/UserNavBar';
// import { useAuth } from '../context/AuthContext';
// import '../styles/NewUserWelcome.scss'; // Use the correct style file

// const UserHome = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   // Defensive: If user is not loaded, don't render
//   if (!user) return null;

//   const name = user?.name?.split(' ')[0] || 'there';

//   const handleGoToCatalogue = () => navigate('/catalogue');
//   const handleGoToDashboard = () => navigate('/user/home');
//   const handlePersonalize = () => navigate('/user/settings');

//   return (
//     <div className="welcome-page">
//       <UserNavBar user={user} />
//       <div className="welcome-box">
//         <h1>Welcome to AutoMate, {name}! 🎉</h1>
//         <p className="intro-text">
//           You're all set to explore top-quality accessories and personalize your ride.
//         </p>
//         <ul className="features-list">
//           <li>🔍 Browse thousands of accessories tailored to your needs</li>
//           <li>🛒 Add items to your cart and checkout securely</li>
//           <li>❤ Save your favourite products and wishlist items</li>
//         </ul>
//         <div className="btn-group">
//           <button onClick={handleGoToCatalogue} className="welcome-btn primary">
//             Explore Catalogue
//           </button>
//           <button onClick={handlePersonalize} className="welcome-btn secondary">
//             Personalize My Ride
//           </button>
//           <button onClick={handleGoToDashboard} className="welcome-btn outline">
//             Go to Dashboard
//           </button>
//         </div>
//         <p className="help-text">
//           Need help? Visit our <a href="/faqs">FAQs</a> or <a href="/contact">contact support</a>.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default UserHome;