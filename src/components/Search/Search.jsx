import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS, formatCurrency } from '../../data/products';
import './Search.css';

function Search({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');

  const searchResults = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    if (!normalizedSearchTerm) {
      return [];
    }

    return PRODUCTS.filter(product =>
      product.title.toLowerCase().includes(normalizedSearchTerm) ||
      product.category.toLowerCase().includes(normalizedSearchTerm) ||
      product.type.toLowerCase().includes(normalizedSearchTerm)
    ).slice(0, 8);
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-header">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            autoFocus
          />
          <button className="search-close-btn" onClick={onClose} type="button">
            x
          </button>
        </div>

        <div className="search-results">
          {searchTerm && searchResults.length === 0 && (
            <div className="no-results">
              <p>No products found for "{searchTerm}"</p>
            </div>
          )}

          {searchResults.length > 0 && (
            <div className="results-grid">
              {searchResults.map(product => (
                <div key={product._id} className="search-result-item">
                  <div className="result-image">
                    <img src={product.image} alt={product.title} loading="lazy" />
                  </div>
                  <div className="result-info">
                    <h4>{product.title}</h4>
                    <p className="result-category">{product.category}</p>
                    <span className="result-price">{formatCurrency(product.price)}</span>
                  </div>
                  <Link
                    to={`/shop/${product.routeCategory}`}
                    className="view-product-btn"
                    onClick={onClose}
                  >
                    View Product
                  </Link>
                </div>
              ))}
            </div>
          )}

          {searchTerm && searchResults.length > 0 && (
            <div className="search-footer">
              <p>Found {searchResults.length} product{searchResults.length !== 1 ? 's' : ''}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
