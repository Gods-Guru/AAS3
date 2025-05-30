import '../styles/categoryGrid.scss';

export default function CategoryGrid() {
  const categories = [
    { name: "Interior", icon: "🪑" },
    { name: "Exterior", icon: "🚗" },
    { name: "Performance", icon: "⚡" },
  ];

  return (
    <div className="category-grid">
      <h2>Shop by Category</h2>
      <div className="categories">
        {categories.map((category) => (
          <div key={category.name} className="category-card">
            <span className="category-icon">{category.icon}</span>
            <h3>{category.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}