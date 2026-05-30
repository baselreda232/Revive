import { Link } from "react-router-dom";

function Offers() {
  return (
    <div className="offers">
      <div className="offers-hero">
        <div className="offers-image">
          <img
            src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80"
            alt="free delivery furniture"
          />
        </div>
        <div className="offers-content">
          <h2>Get your <span className="green-text">Free Delivery</span> Offer on First Order</h2>
          <p>Transform your home with beautiful furniture without the shipping cost. Limited time offer for new customers!</p>
          <Link to="/shop" className="btn-offers">Claim Your Offer</Link>
        </div>
      </div>
    </div>
  );
}

export default Offers;