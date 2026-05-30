import logo from "../images/logo.jpg";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-top">

        <div className="footer-logo">
          <img src={logo} alt="logo" />
        </div>

        <div className="footer-content">
          <div className="footer-section">
            <h4>Want help?</h4>
            <p>Contact Us</p>
            <p>Help Center</p>
            <p>hello@revive.com</p>
            <p>Support Number: 15829</p>
          </div>

          <div className="footer-section">
            <h4>Important Links</h4>
            <p>Return Policy</p>
            <p>Privacy policy</p>
            <p>Warranty</p>
          </div>

          <div className="footer-section">
            <h4>Company</h4>
            <p>Terms & Conditions</p>
            <p>Functions</p>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <div className="copyright">
          © 2025 all rights reserved
        </div>
      </div>

    </footer>
  );
}

export default Footer; 