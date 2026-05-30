// src/components/Hero.jsx

import { Link } from "react-router-dom";
import heroImage from "../../images/hero2.png";
function Hero() {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="row align-items-center">

          {/* Text section */}
          <div className="col-md-5">
            <h1 className="hero-title">
              Design Your Space. Define Your Style.
            </h1>
            <p className="hero-text">
              Discover modern furniture crafted for comfort,
              beauty, and everyday living.
            </p>
            <Link to="/shop" className="btn btn-dark">
              Discover
            </Link>
          </div>

          {/* Image section */}
          <div className="col-md-7">
            <div className="hero-image-container">
              <img
                src={heroImage}
                alt="furniture"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;