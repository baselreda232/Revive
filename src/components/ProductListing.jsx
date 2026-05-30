import { useMemo, useState } from 'react';
import Notification from './Notification/Notification';
import { useCart } from '../contexts/cartStore';
import { formatCurrency, labelFromValue } from '../data/products';

const sortProducts = (products, sortBy) => {
  const sortedProducts = [...products];

  switch (sortBy) {
    case 'price-low':
      return sortedProducts.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sortedProducts.sort((a, b) => b.price - a.price);
    case 'name-az':
      return sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
    case 'name-za':
      return sortedProducts.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return sortedProducts;
  }
};

function ProductListing({ classPrefix, title, subtitle, products, filters }) {
  const { addToCart } = useCart();
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [notification, setNotification] = useState(null);

  const maxProductPrice = useMemo(() => {
    const highestPrice = Math.max(...products.map(product => product.price), 0);
    return Math.max(1000, Math.ceil(highestPrice / 1000) * 1000);
  }, [products]);

  const [maxPrice, setMaxPrice] = useState(maxProductPrice);

  const toggleFilterValue = (value, setValue) => {
    setValue(previousValues =>
      previousValues.includes(value)
        ? previousValues.filter(item => item !== value)
        : [...previousValues, value]
    );
  };

  const visibleProducts = useMemo(() => {
    const filteredProducts = products.filter(product => {
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(product.type);
      const matchesMaterial =
        selectedMaterials.length === 0 || selectedMaterials.includes(product.material);
      const matchesColor = !selectedColor || product.color === selectedColor;
      const matchesPrice = product.price <= maxPrice;

      return matchesType && matchesMaterial && matchesColor && matchesPrice;
    });

    return sortProducts(filteredProducts, sortBy);
  }, [maxPrice, products, selectedColor, selectedMaterials, selectedTypes, sortBy]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setNotification({ message: `${product.title} added to cart`, type: 'success' });
  };

  const resetFilters = () => {
    setSelectedTypes([]);
    setSelectedMaterials([]);
    setSelectedColor('');
    setMaxPrice(maxProductPrice);
    setSortBy('default');
  };

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className={`${classPrefix}-page`}>
        <div className={`${classPrefix}-header`}>
          <h1 className={`${classPrefix}-title`}>{title}</h1>
          <p className={`${classPrefix}-subtitle`}>{subtitle}</p>
        </div>

        <div className={`${classPrefix}-layout`}>
          <aside className={`${classPrefix}-filters`}>
            <h2 className="filter-title">Filters</h2>

            <div className="filter-group">
              <h3 className="filter-group-title">Categories</h3>
              <div className="filter-options">
                {filters.types.map(type => (
                  <label className="filter-option" key={type}>
                    <input
                      type="checkbox"
                      name={type}
                      checked={selectedTypes.includes(type)}
                      onChange={() => toggleFilterValue(type, setSelectedTypes)}
                    />
                    <span>{labelFromValue(type)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h3 className="filter-group-title">Price Range</h3>
              <div className="price-filter">
                <input
                  type="range"
                  min="0"
                  max={maxProductPrice}
                  value={maxPrice}
                  className="price-slider"
                  onChange={(event) => setMaxPrice(Number(event.target.value))}
                />
                <div className="price-range">
                  <span>EGP 0</span>
                  <span>{formatCurrency(maxPrice)}</span>
                </div>
              </div>
            </div>

            <div className="filter-group">
              <h3 className="filter-group-title">Color</h3>
              <div className="color-options">
                {['white', 'brown', 'black', 'gray'].map(color => (
                  <label className="color-option" key={color} title={labelFromValue(color)}>
                    <input
                      type="radio"
                      name={`${classPrefix}-color`}
                      value={color}
                      checked={selectedColor === color}
                      onChange={() => setSelectedColor(color)}
                    />
                    <span className={`color-swatch ${color}`}></span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h3 className="filter-group-title">Material</h3>
              <div className="filter-options">
                {filters.materials.map(material => (
                  <label className="filter-option" key={material}>
                    <input
                      type="checkbox"
                      name={material}
                      checked={selectedMaterials.includes(material)}
                      onChange={() => toggleFilterValue(material, setSelectedMaterials)}
                    />
                    <span>{labelFromValue(material)}</span>
                  </label>
                ))}
              </div>
            </div>

            <button className="apply-filter-btn" type="button" onClick={resetFilters}>
              Reset Filters
            </button>
          </aside>

          <main className={`${classPrefix}-products`}>
            <div className="products-header">
              <div className="results-count">
                <span>
                  Showing {visibleProducts.length} of {products.length} products
                </span>
              </div>

              <div className="sort-dropdown">
                <label htmlFor={`${classPrefix}-sort-select`}>Sort by:</label>
                <select
                  id={`${classPrefix}-sort-select`}
                  className="sort-select"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                >
                  <option value="default">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-az">Name: A to Z</option>
                  <option value="name-za">Name: Z to A</option>
                </select>
              </div>
            </div>

            {visibleProducts.length === 0 ? (
              <div className="no-products-message">No products match these filters.</div>
            ) : (
              <div className="products-grid">
                {visibleProducts.map(product => (
                  <div key={product._id} className={`${classPrefix}-product-card`}>
                    <div className="product-image-wrapper">
                      <img src={product.image} alt={product.title} loading="lazy" />
                      <div className="product-overlay">
                        <button
                          className="add-to-cart-btn"
                          type="button"
                          onClick={() => handleAddToCart(product)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                    <div className="product-info">
                      <h3 className="product-name">{product.title}</h3>
                      <p className="product-price">{formatCurrency(product.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

export default ProductListing;
