// Load environment variables
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const apiLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const discountRoutes = require('./routes/discountRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const favouritesRoutes = require('./routes/favouritesRoutes');
const autoFavouritesRoute = require('./routes/autoFavouritesRoute');
const returnRoutes = require('./routes/returnRoutes');
const adminRoutes = require('./routes/adminRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const uploadRoute = require('./routes/upload.route');
const viewRoutes = require('./routes/viewRoutes');
const discountPublicRoutes = require('./routes/discountPublicRoutes');
const websiteReviewRoutes = require('./routes/websiteReviewRoutes');

const app = express();

// Connect to MongoDB
dbConnect();
function dbConnect() {
  connectDB();
}

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3002'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(apiLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/discounts', discountRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/favourites', favouritesRoutes);
app.use('/api/auto-favourites', autoFavouritesRoute);
app.use('/api/returns', returnRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/upload', uploadRoute);
app.use('/api/views', viewRoutes);
app.use('/api/discounts', discountPublicRoutes);
app.use('/api/website-reviews', websiteReviewRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
