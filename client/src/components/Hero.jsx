import '../styles/Hero.scss';
import { Link } from 'react-router-dom';
import CategoryGrid from '../components/categoryGrid';
import ProductList from '../components/ProductList';

export default function Hero() {
  return (
    <section className="hero-container">
      <section className="hero-content">
        <h1>Upgrade Your Ride</h1>
        <p>20% Off LED Headlights — Shop Now</p>
        <div className="vehicle-selector">
          <select>
            <option>Select Vehicle (e.g., Toyota Camry 2020)</option>
          </select>
          <button>Find Parts</button>
        </div>
      </section>
      {/* <section className="hero-image">
        <img src="https://example.com/hero-image.jpg" alt="Hero" />
      </section> */}
      <section className="category-grid">
        <CategoryGrid />
      </section>
      <section className="explore-products">
        <ProductList />
      </section>
      <section className="hero-footer">
      </section>
    </section>
  );
}