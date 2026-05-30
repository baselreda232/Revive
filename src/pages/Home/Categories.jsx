
import { Link } from "react-router-dom";
import bedroom from "../../images/bedroom2.jpg";
import living from "../../images/living2.jpg";
import dining from "../../images/dining.jpg";

function Categories() {
  return (
    <section className="categories-section">
      <div className="container">
        <h2 className="categories-title">
          Furniture That Defines Modern Living
        </h2>

        <div className="categories-grid">
          
          <div className="category-card">
            <div className="category-image-container">
              <img src={bedroom} alt="Bedroom Furniture" />
            </div>
            <div className="category-content">
              <h3 className="category-title">Bedroom</h3>
              <p className="category-description">
                Transform your bedroom into a sanctuary of comfort and style
              </p>
              <Link to="/shop/bedroom" className="btn btn-category">Shop Now</Link>
            </div>
          </div>

          <div className="category-card">
            <div className="category-image-container">
              <img src={living} alt="Living Room Furniture" />
            </div>
            <div className="category-content">
              <h3 className="category-title">Living Room</h3>
              <p className="category-description">
                Create the perfect gathering space for family and friends
              </p>
              <Link to="/shop/living-room" className="btn btn-category">Shop Now</Link>
            </div>
          </div>

          <div className="category-card">
            <div className="category-image-container">
              <img src={dining} alt="Dining Room Furniture" />
            </div>
            <div className="category-content">
              <h3 className="category-title">Dining Room</h3>
              <p className="category-description">
                Elevate your dining experience with elegant furniture pieces
              </p>
              <Link to="/shop/dining-room" className="btn btn-category">Shop Now</Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Categories;
