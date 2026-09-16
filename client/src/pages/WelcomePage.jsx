import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/WelcomePage.scss";
import FeaturedProducts from "../components/FeaturedProducts";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
// import img1 from "../assets/welcomebg.jpg";
// import img2 from "../assets/gold-car.jpg";
// import img3 from "../assets/blue-car.png";
import img1 from "../assets/coloured-car.jpg";
import img2 from "../assets/yellow-car.jpg";
import img3 from "../assets/asian-guy-car.jpg";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import fallImg from '../assets/welcomebg.jpg';
import logoImg from '../assets/logo.png';
import toolsAndKit from "../assets/tools-and-kit.jpg";
import infotainment from "../assets/infotainment.jpg";
import carCover from "../assets/car-cover.jpg";
import electronic from "../assets/electronic.jpg";
import gadgets from "../assets/gadgets.jpg";
import boschLogo from "../assets/brands/bosch.png";
import threeMLogo from "../assets/brands/3m.png";
import mobilLogo from "../assets/brands/mobil.png";
import michelinLogo from "../assets/brands/michelin.png";
import castrolLogo from "../assets/brands/castrol.png";
import shellLogo from "../assets/brands/shell.png";
import bridgestoneLogo from "../assets/brands/bridgestone.png";
import goodyearLogo from "../assets/brands/good-year.png";
import { fetchFeaturedWebsiteReviews } from '../api/websiteReviews';

// Image imports with fallbacks
const fallbackImg = fallImg
const logo = logoImg
const heroSlides = [
  {
    image: img1,
    mobileImage: img1,
    title: "AutoLux",
    tagline: "Discover premium automobile accessories tailored for you",
    button: "Explore Now",
    link: "/catalogue",
    colorScheme: "dark",
  },
  {
    image: img2,
    mobileImage: img2,
    title: "Shine Brighter",
    tagline: "Premium car waxes and detailing products for a showroom finish",
    button: "Shop Car Care",
    link: "/catalogue",
    colorScheme: "dark",
  },
  {
    image: img3,
    mobileImage: img3,
    title: "Light Up the Road",
    tagline: "Upgrade to LED headlights and drive with confidence",
    button: "See Lighting",
    link: "/catalogue",
    colorScheme: "dark",
  },
];

const quickLinks = [
  {
    icon: toolsAndKit,
    title: "Tools & Kit",
    link: "/catalogue?categories=tools_and_kit",
  },
  {
    icon: infotainment,
    title: "Infotainmet",
    link: "/catalogue?categories=infotainment",
  },
  {
    icon: carCover,
    title: "Car Cover",
    link: "/catalogue?categories=Car_Cover",
  },
  {
    icon: electronic,
    title: "Electronics",
    link: "/catalogue?categories=Electronics",
  },
  {
    icon: gadgets,
    title: "Gadgets",
    link: "/catalogue?categories=Gadgets",
  },
];

const popularBrands = [
  { name: "Bosch", logo: boschLogo },
  { name: "3M", logo: threeMLogo },
  { name: "Mobil 1", logo: mobilLogo },
  { name: "Michelin", logo: michelinLogo },
  { name: "Castrol", logo: castrolLogo },
  { name: "Shell", logo: shellLogo },
  { name: "Bridgestone", logo: bridgestoneLogo },
  { name: "Goodyear", logo: goodyearLogo },
];

const stats = [
  { value: "10+", label: "Happy Customers" },
  { value: "Great", label: "Positive Reviews" },
  { value: "Only 4%", label: "Shipping Fee Nationwide" },
  { value: "24/7", label: "Customer Support" },
];

const trustBadges = [
  { icon: fallbackImg, label: "Secured Payments" },
  { icon: fallbackImg, label: "Authorized Dealers" },
  { icon: fallbackImg, label: "7-Day Return Guarantee" },
];

const WelcomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterMsg, setNewsletterMsg] = useState("");
  const [showRewardsBanner, setShowRewardsBanner] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [heroHeight, setHeroHeight] = useState("80vh");
  const [isScrolled, setIsScrolled] = useState(false);
  const [featuredReviews, setFeaturedReviews] = useState([]);
  const videoRef = useRef(null);

  // Responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setHeroHeight(window.innerWidth < 768 ? "60vh" : "80vh");
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll detection for header effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch products with error boundary
  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5002/api/products", {
        timeout: 5000,
      });
      setProducts(Array.isArray(res.data) ? res.data : res.data.products || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Redirect if logged in
  useEffect(() => {
    if (user) navigate("/user/home");
  }, [user, navigate]);

  // Auto-rotation for hero slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % (featuredReviews.length || 1));
    }, 10000);
    return () => clearInterval(interval);
  }, [featuredReviews]);

  // Fetch featured website reviews
  useEffect(() => {
    fetchFeaturedWebsiteReviews()
      .then(setFeaturedReviews)
      .catch(() => setFeaturedReviews([]));
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/newsletter", { email: newsletterEmail });
      setNewsletterMsg("Thank you for subscribing!");
      setNewsletterEmail("");
      setTimeout(() => setNewsletterMsg(""), 5000);
    } catch (error) {
      setNewsletterMsg("Subscription failed. Please try again.");
    }
  };

  const renderStars = (count) => (
    <div aria-label={`${count} star rating`}>
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < count ? "star-filled" : "star-empty"}>
          {i < count ? "★" : "☆"}
        </span>
      ))}
    </div>
  );

  return (
    <main className="welcome-page">
      {/* Rewards Banner */}
      {/* {showRewardsBanner && (
        <div className={`rewards-banner ${isScrolled ? "scrolled" : ""}`}>
          <span>
            Sign up & get <strong>22% off</strong> your first purchase by using the discount code SAVE22!
          </span>
          <button
              onClick={() => setShowRewardsBanner(false)}
              aria-label="Close banner"
            >
              &times;
            </button>
        </div>
      )} */}

      {/* Hero Carousel */}
      <section className="hero-carousel" style={{ height: heroHeight }}>
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentSlide ? "active" : ""}`}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0,0,0,0.4)), url(${
                isMobile ? slide.mobileImage : slide.image
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              color: slide.colorScheme === "dark" ? "#fff" : "#333",
            }}
          >
            <div className="hero-content">
              <h1 data-aos="fade-up">{slide.title}</h1>
              <p data-aos="fade-up" data-aos-delay="100">
                {slide.tagline}
              </p>
              <Link
                to={slide.link}
                className="hero-cta"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                {slide.button}
              </Link>
            </div>
          </div>
        ))}

        <div className="hero-pagination">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={index === currentSlide ? "active" : ""}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Brand Carousel */}
      <section className="brand-carousel">
        <div className="container">
          <h3>Trusted by Leading Brands</h3>
          <Swiper
            slidesPerView={isMobile ? 3 : 6}
            spaceBetween={30}
            loop={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            modules={[Autoplay]}
            className="brand-swiper"
          >
            {popularBrands.map((brand, index) => (
              <SwiperSlide key={index}>
                <div className="brand-logo">
                  <LazyLoadImage
                    src={brand.logo}
                    alt={brand.name}
                    effect="blur"
                    width="100%"
                    height="100%"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <section className="info">
        <div className="info-img">
          
        </div>
        <div className="info-text">
          Welcome to Autolux — where performance meets precision.
          At Autolux, we are more than just an automobile accessories store — we are your trusted partner in elevating your driving experience. Our mission is rooted in delivering top-tier automotive products with exceptional quality, functionality, and style.

          We take pride in serving every customer with efficiency, care, and an unwavering commitment to satisfaction. Whether you're a car enthusiast looking to upgrade your ride, a daily driver seeking dependable accessories, or a professional in need of reliable automotive solutions, Autolux is here to meet and exceed your expectations.

          Every product we offer is carefully selected and rigorously vetted to ensure it meets the highest standards of performance and durability. From sleek interior enhancements to rugged exterior upgrades, we provide accessories that not only enhance your vehicle but also reflect your unique style and preferences.

          At the heart of everything we do is a dedication to quality, trust, and excellence — because at Autolux, your journey deserves nothing less.


        </div>
      </section>

      {/* Value Proposition */}
      <section className="value-prop">
        <div className="container">
          <h2>Why Choose AutoLux?</h2>
          <div className="value-grid">
            <div className="value-card" data-aos="fade-up">
              <div className="value-icon">🚚</div>
              <h3>Fast Shipping</h3>
              <p>Get your orders delivered within 2-3 business days</p>
            </div>
            <div className="value-card" data-aos="fade-up" data-aos-delay="100">
              <div className="value-icon">🔧</div>
              <h3>Expert Support</h3>
              <p>Our automotive specialists are ready to help</p>
            </div>
            <div className="value-card" data-aos="fade-up" data-aos-delay="200">
              <div className="value-icon">💯</div>
              <h3>Quality Guaranteed</h3>
              <p>Premium products backed by our satisfaction guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="quick-links">
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="category-grid">
            {quickLinks.map((category, index) => (
              <Link
                to={category.link}
                key={index}
                className="category-card"
                data-aos="zoom-in"
                data-aos-delay={index * 50}
              >
                <LazyLoadImage
                  src={category.icon}
                  alt={category.title}
                  effect="blur"
                  width="100%"
                  height="100%"
                />
                <div className="category-overlay">
                  <h3>{category.title}</h3>
                  <span>Shop Now →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="stat-card"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <h2>What Our Customers Say</h2>
          <div className="testimonial-slider">
            {featuredReviews.length > 0 ? featuredReviews.map((review, index) => (
              <div
                key={review._id}
                className={`testimonial-card ${index === testimonialIndex ? "active" : ""}`}
              >
                <div className="testimonial-content">
                  <div className="testimonial-rating">
                    {renderStars(
                      Math.round((review.experience + review.quality + review.price) / 3)
                    )}
                  </div>
                  <p className="testimonial-text">{review.comment}</p>
                  <div className="testimonial-author">
                    {review.user?.profilePicture && (
                      <img src={review.user.profilePicture} alt={review.user.name || 'User'} className="testimonial-profile-pic" style={{width:32,height:32,borderRadius:'50%',objectFit:'cover',marginRight:8}} />
                    )}
                    <span>{review.user?.name || 'Anonymous'}</span>
                  </div>
                </div>
              </div>
            )) : <p>No featured reviews yet.</p>}
            <div className="testimonial-nav">
              {featuredReviews.map((_, index) => (
                <button
                  key={index}
                  className={index === testimonialIndex ? "active" : ""}
                  onClick={() => setTestimonialIndex(index)}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="container">
          <div className="newsletter-content">
            <div className="newsletter-text">
              <h2>Join Our Community</h2>
              <p>Subscribe for exclusive deals, tips, and new product alerts</p>
            </div>
            <form onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                placeholder="Your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              <button type="submit">Subscribe</button>
            </form>
            {newsletterMsg && (
              <div className="newsletter-message">{newsletterMsg}</div>
            )}
          </div>
        </div>
      </section>

      {/* Back to Top Button */}
      <button
        className={`back-to-top ${isScrolled ? "visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        ↑
      </button>

      {/* Chat Widget */}
      <div className="chat-widget">
        <button
          aria-label="Chat with us"
          onClick={() => {
            alert('This chat button lets you share your experience, rate our website, and leave feedback for the admin. You will be redirected to the review page.');
            navigate('/my-reviews');
          }}
        >
          💬
        </button>
      </div>
    </main>
  );
};

export default WelcomePage;