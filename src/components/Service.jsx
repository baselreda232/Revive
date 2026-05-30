function Services() {
  return (
    <div className="services">

      <div className="service-box">

        {/* الصورة */}
        <div className="service-image">
          <img 
            src="https://via.placeholder.com/400" 
            alt="service" 
          />
        </div>

        {/* الكلام */}
        <div className="service-text">
          <h2>Our Services</h2>

          <p>
            We provide high-quality products with fast delivery and excellent customer support.
          </p>

          <p>
            Enjoy a smooth shopping experience and easy returns with us.
          </p>
        </div>

      </div>

    </div>
  );
}

export default Services;