import '../styles/ProductList.scss';
import React, { useState, useEffect, useContext } from 'react';
import { CartContext } from '../context/cartContext'; // Adjust the path as necessary


export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')  // Replace with your endpoint
      .then(res => res.json())
      .then(data => 
      {
        // Extract the array from the object
        const productsArray = data.products || []; // Fallback to empty array
        setProducts(productsArray);
      }
      )
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  const { addToCart } = useContext(CartContext);

  return (
    <div className="product-list">
      <h2>Popular Products</h2>
      <div className="products">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}