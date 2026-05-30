import { Link } from "react-router-dom";

function Services() {
  return (
    <div className="services">
      <div className="services-header">
        <h2>Our <span className="accent-text">Services</span></h2>
        <p>Discover everything we offer to transform your living space</p>
      </div>

      <div className="services-grid">
        <div className="service-card shop-service">
          <div className="service-icon">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </div>
          <div className="service-content">
            <h3>Shop</h3>
            <p>Browse our curated collection of premium furniture pieces for every room in your home.</p>
            <ul className="service-features">
              <li>Wide selection of styles</li>
              <li>Quality craftsmanship</li>
              <li>Competitive pricing</li>
            </ul>
            <Link to="/shop" className="btn-service">Explore Collection</Link>
          </div>
        </div>

        <div className="service-card customization-service">
          <div className="service-icon">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <div className="service-content">
            <h3>Customization</h3>
            <p>Transform your ideas into reality with our bespoke furniture design service.</p>
            <ul className="service-features">
              <li>Personalized designs</li>
              <li>Material selection</li>
              <li>Expert craftsmanship</li>
            </ul>
            <Link to="/services/customization" className="btn-service">Start Designing</Link>
          </div>
        </div>

        <div className="service-card innovation-service">
          <div className="service-icon">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <div className="service-content">
            <h3>Innovation</h3>
            <p>Experience the future of furniture with cutting-edge design and smart technology.</p>
            <ul className="service-features">
              <li>Smart integration</li>
              <li>Sustainable materials</li>
              <li>Modular designs</li>
            </ul>
            <Link to="/services/innovation" className="btn-service">Discover Future</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;
