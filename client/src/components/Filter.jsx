import React, { useState } from 'react';

const Filters = ({ onFilter }) => {
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStock, setInStock] = useState(false);

  const handleApplyFilters = () => {
    onFilter({ category, minPrice, maxPrice, inStock });
  };

  return (
    <div className="filters">
      <h3>Filters</h3>

      <div>
        <label>Category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All</option>
          <option value="Interior">Interior</option>
          <option value="Exterior">Exterior</option>
          <option value="Engine">Engine</option>
          <option value="Lights">Lights</option>
          <option value="Performance">Performance</option>
          <option value="Technology">Technology</option>
          <option value="Car Care">Car Care</option>
        </select>
      </div>

      <div>
        <label>Min Price:</label>
        <input
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
      </div>

      <div>
        <label>Max Price:</label>
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={inStock}
            onChange={() => setInStock(!inStock)}
          />
          In Stock Only
        </label>
      </div>

      <button onClick={handleApplyFilters}>Apply Filters</button>
    </div>
  );
};

export default Filters;