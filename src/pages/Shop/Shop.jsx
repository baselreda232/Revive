import { useState } from "react";
import { Link } from "react-router-dom";
import ImageCarousel from "../../components/ImageCarousel";
import Notification from "../../components/Notification/Notification";
import { useCart } from "../../contexts/cartStore";
import {
  SHOP_SECTIONS,
  formatCurrency,
  PRODUCTS
} from "../../data/products";
import bedroom from "../../images/bedroom.jpg";
import living from "../../images/living.jpg";
import salon from "../../images/salon.jpg";
import shopCarousel1 from "../../images/shopCarousel1.jpg";
import shopCarousel2 from "../../images/shopCarousel2.jpg";
import shopCarousel3 from "../../images/shopCarousel3.jpg";
import "./Shop.css";

const carouselImages = [
  {
    src: shopCarousel1,
    alt: "Modern bedroom furniture",
    title: "Transform Your Living Space",
    description: "Discover our curated collection of modern furniture pieces"
  },
  {
    src: shopCarousel2,
    alt: "Luxury living room sofa",
    title: "Create Your Dream Bedroom",
    description: "Stylish and comfortable furniture for peaceful nights"
  },
  {
    src: shopCarousel3,
    alt: "Elegant dining room set",
    title: "Elegant Dining Solutions",
    description: "Premium furniture for memorable family moments"
  }
];

const categories = [
  {
    title: "Bedroom",
    image: bedroom,
    alt: "Bedroom set",
    path: "/shop/bedroom"
  },
  {
    title: "Living Room",
    image: living,
    alt: "Living room",
    path: "/shop/living-room"
  },
  {
    title: "Dining Room",
    image: salon,
    alt: "Dining room set",
    path: "/shop/dining-room"
  }
];

function Shop() {
  const { addToCart } = useCart();
  const [notification, setNotification] = useState(null);

  const handleAddToCart = (product) => {
    addToCart(product);
    setNotification({ message: `${product.title} added to cart`, type: "success" });
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

      <div className="shop-container">
        <ImageCarousel images={carouselImages} />

        <div className="shop-content">
          <h1>Shop Our Furniture Collection</h1>
          <p>Discover our curated selection of modern furniture pieces</p>

          <div className="categories-grid">
            {categories.map(category => (
              <Link className="category-item" key={category.path} to={category.path}>
                <div className="category-circle">
                  <img src={category.image} alt={category.alt} loading="lazy" />
                </div>
                <h3>{category.title}</h3>
              </Link>
            ))}
          </div>

          {SHOP_SECTIONS.map(section => (
            <section className="products-section" key={section.title}>
              <h2 className="section-title">{section.title}</h2>
              <div className="products-grid">
                {section.products.map(product => (
                  <div className="product-card" key={product._id}>
                    <div className="product-image-container">
                      <img src={product.image} alt={product.title} loading="lazy" />
                    </div>
                    <div className="product-info">
                      <h3>{product.title}</h3>
                      <span className="product-price">{formatCurrency(product.price)}</span>
                      <button
                        className="btn-add-cart"
                        type="button"
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}

export default Shop;
