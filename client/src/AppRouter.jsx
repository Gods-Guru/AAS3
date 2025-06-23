import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import WelcomePage from './pages/WelcomePage';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import Cart from './components/Cart';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthForm from './components/AuthForm';
import HomePage from './pages/HomePage';
import Orders from './pages/Orders';
import AdminPanel from './pages/AdminPanel';
import PrivateRoute from './components/PrivateRoute';
import FeaturedProducts from "./components/FeaturedProducts";
import CatalogPage from "./pages/Catalogue";
import Wishlist from "./pages/Wishlist";
import AdminDashboard from "./components/admin/AdminDashboard";
import About from "./pages/About";
import FAQs from "./pages/FAQs";
import Contact from "./pages/Contact";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import VerifyOtp from "./components/VerifyOTP";
import NewUserWelcome from "./pages/NewUserWelcome";
import UserHome from "./pages/OldUserPage";
import FavouritesPage from "./pages/Favourites";
import Checkout from "./pages/Checkout";
import Settings from "./pages/Settings";
import ProductsPage from "./components/admin/ProductsPage";
import OrderPage from "./components/admin/OrderPage";
import CustomerPage from "./components/admin/CustomerPage";
import StaffPage from "./components/admin/StaffPage";
import SettingsPage from "./components/admin/Settingspage";
import CategoriesPage from "./components/admin/CategoriesPage";
import ReturnRequestForm from "./components/ReturnRequestForm";
import DiscountPage from "./components/admin/DiscountPage";
import AdminReturnRequests from "./components/admin/AdminReturnRequests";
import UserManagementPage from "./components/admin/UserManagementPage";
import AdminAnalytics from "./components/admin/AdminAnalytics";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsandConditions from "./components/TermsandConditions";
import UserOrders from "./components/UserOrders";
import ShippingPolicy from "./components/ShippingPolicy";
import ReturnPolicy from "./components/ReturnPolicy";
import UserProfile from "./pages/UserProfile";
import AdminProfile from "./components/admin/AdminProfile";
// import AdminNavbar from './components/AdminNavbar';
import AdminSidebar from './components/AdminSidebar';
import UserReviewsPage from "./pages/UserReviewsPage";
import AdminWebsiteReviewsPage from "./components/admin/AdminWebsiteReviewsPage";
import OrderDetails from './components/OrderDetails';

// Utility to determine home path based on user
const getHomePath = (user) => {
  if (!user) return "/";
  if (user.isAdmin) return "/admin/dashboard";
  if (user.isFirstLogin) return "/user/home";
  return "/user/home";
};

const AdminLayout = () => {
  const { user } = useAuth();
  return (
    <div className="admin-layout">
      {user && user.isAdmin && <AdminSidebar />}
      <div className="admin-content-with-sidebar">
        <Outlet />
      </div>
    </div>
  );
};

const AppRoutes = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const excludePaths = ['/login', '/signup', '/reset-password'];
    if (!excludePaths.includes(location.pathname)) {
      localStorage.setItem('lastPage', location.pathname);
    }
  }, [location]);

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && <Header homePath={getHomePath(user)} />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={user ? <Navigate to={getHomePath(user)} replace /> : <WelcomePage />} />
        <Route path="/home" element={<Navigate to={getHomePath(user)} replace />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/featured" element={<FeaturedProducts />} />
        <Route path="/catalogue" element={<CatalogPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<AuthForm type="login" />} />
        <Route path="/signup" element={<AuthForm type="signup" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsandConditions />} />
        <Route path="/return-policy" element={<ReturnPolicy />} />
        <Route path="/shipping" element={<ShippingPolicy />} />

        {/* Authenticated User Routes */}
        <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
        <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
        <Route path="/user/favourites" element={<PrivateRoute><FavouritesPage /></PrivateRoute>} />
        <Route path="/user/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/user/return-request" element={<PrivateRoute><ReturnRequestForm /></PrivateRoute>} />
        <Route path="/user/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/user/welcome" element={<PrivateRoute><NewUserWelcome /></PrivateRoute>} />
        <Route path="/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
        <Route path="/my-orders" element={<PrivateRoute><UserOrders /></PrivateRoute>} />
        <Route path="/my-profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
        <Route path="/my-reviews" element={<PrivateRoute><UserReviewsPage /></PrivateRoute>} />
        <Route path="/orders/:id" element={<PrivateRoute><OrderDetails /></PrivateRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<PrivateRoute adminOnly={true}><AdminLayout /></PrivateRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="orders" element={<OrderPage />} />
          <Route path="customers" element={<CustomerPage />} />
          <Route path="staff" element={<StaffPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="discounts" element={<DiscountPage />} />
          <Route path="return-requests" element={<AdminReturnRequests />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="website-reviews" element={<AdminWebsiteReviewsPage />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
};

const AppRouter = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default AppRouter;