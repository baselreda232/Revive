import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../contexts/cartStore';
import logo from "../images/logo.jpg";
import Search from './Search/Search';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [shopDropdown, setShopDropdown] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { getCartItemCount } = useCart();

  const handleShopEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setServicesDropdown(false); // Close other dropdown
    setShopDropdown(true);
  };

  const handleShopLeave = () => {
    const timeout = setTimeout(() => {
      setShopDropdown(false);
    }, 150);
    setDropdownTimeout(timeout);
  };

  const handleServicesEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setShopDropdown(false); // Close other dropdown
    setServicesDropdown(true);
  };

  const handleServicesLeave = () => {
    const timeout = setTimeout(() => {
      setServicesDropdown(false);
    }, 150);
    setDropdownTimeout(timeout);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsMenuOpen(false);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  return (
    <nav className="bg-white p-3 shadow-sm position-relative">
      <div className="container-fluid px-4 d-flex justify-content-between align-items-center">

        <Link to="/">
          <img src={logo} alt="logo" className="logo" />
        </Link>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-toggle d-md-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? 'x' : 'menu'}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <ul className="mobile-menu d-flex flex-column gap-2 list-unstyled m-0" style={{textAlign: 'left'}}>
            <li style={{textAlign: 'left', width: '100%'}}>
              <Link to="/" className="text-decoration-none text-dark" onClick={() => setIsMenuOpen(false)} style={{textAlign: 'left', display: 'block', width: '100%', paddingLeft: '0'}} onMouseEnter={(e) => e.target.style.color = '#6c757d'} onMouseLeave={(e) => e.target.style.color = '#333'}>
                Home
              </Link>
            </li>
            <li style={{textAlign: 'left', marginTop: '8px', marginBottom: '8px'}}>
              <div className="d-flex justify-content-between align-items-center" style={{textAlign: 'left'}}>
                <Link 
                  to="/shop" 
                  className="text-decoration-none text-dark p-0"
                  onClick={() => setIsMenuOpen(false)}
                  style={{textAlign: 'left', flex: 1}}
                  onMouseEnter={(e) => e.target.style.color = '#6c757d'} onMouseLeave={(e) => e.target.style.color = '#333'}
                >
                  Shop
                </Link>
                <button 
                  className="shop-arrow btn btn-link text-decoration-none text-dark p-0"
                  onClick={() => setShopDropdown(!shopDropdown)}
                  style={{padding: '14px 0px', marginLeft: '-35px', fontSize: '14px', color: '#666', position: 'relative', left: '-20px'}}
                >
                  {shopDropdown ? 'v' : '>'}
                </button>
              </div>
              {shopDropdown && (
                <ul className="list-unstyled ms-3 mt-2">
                  <li><Link to="/shop/bedroom" className="text-decoration-none text-dark" onClick={() => setIsMenuOpen(false)}>Bedroom</Link></li>
                  <li><Link to="/shop/living-room" className="text-decoration-none text-dark" onClick={() => setIsMenuOpen(false)}>Living Room</Link></li>
                  <li><Link to="/shop/dining-room" className="text-decoration-none text-dark" onClick={() => setIsMenuOpen(false)}>Dining Room</Link></li>
                </ul>
              )}
            </li>
            <li style={{textAlign: 'left', marginTop: '8px', marginBottom: '8px'}}>
              <div className="d-flex justify-content-between align-items-center" style={{textAlign: 'left'}}>
                <button 
                  className="btn btn-link text-decoration-none text-dark p-0"
                  onClick={() => setServicesDropdown(!servicesDropdown)}
                  style={{textAlign: 'left', flex: 1}}
                  onMouseEnter={(e) => e.target.style.color = '#6c757d'} onMouseLeave={(e) => e.target.style.color = '#333'}
                >
                  Services
                </button>
                <button 
                  className="services-arrow btn btn-link text-decoration-none text-dark p-0"
                  onClick={() => setServicesDropdown(!servicesDropdown)}
                  style={{padding: '14px 0px', marginLeft: '5px', fontSize: '14px', color: '#666', position: 'relative', left: '0px'}}
                >
                  {servicesDropdown ? 'v' : '>'}
                </button>
              </div>
              {servicesDropdown && (
                <ul className="list-unstyled ms-3 mt-2">
                  <li><Link to="/services/customization" className="text-decoration-none text-dark" onClick={() => setIsMenuOpen(false)}>Customization</Link></li>
                  <li><Link to="/services/innovation" className="text-decoration-none text-dark" onClick={() => setIsMenuOpen(false)}>Innovation</Link></li>
                </ul>
              )}
            </li>
            <li style={{textAlign: 'left', width: '100%'}}>
              <Link to="/contact" className="text-decoration-none text-dark" onClick={() => setIsMenuOpen(false)} style={{textAlign: 'left', display: 'block', width: '100%', paddingLeft: '0'}} onMouseEnter={(e) => e.target.style.color = '#6c757d'} onMouseLeave={(e) => e.target.style.color = '#333'}>
                Contact
              </Link>
            </li>
            <li style={{textAlign: 'left'}}>
              <Link to="/signin" onClick={() => setIsMenuOpen(false)} style={{textAlign: 'left', display: 'block'}}>
                <button className="btn btn-dark" style={{width: '100%', textAlign: 'center'}}>
                  Sign In/Up
                </button>
              </Link>
            </li>
            
            {/* Mobile Navbar Icons */}
            <li className="mobile-nav-icons d-flex gap-3 align-items-center justify-content-center">
              <button className="icon-btn" aria-label="Search" onClick={toggleSearch}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
              <Link to="/dashboard" className="icon-btn" aria-label="Profile" onClick={() => setIsMenuOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </Link>
              <Link to="/cart" className="icon-btn" aria-label="Cart" onClick={() => setIsMenuOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span className="cart-badge">{getCartItemCount()}</span>
              </Link>
            </li>
          </ul>
        )}
        
        {/* Desktop Menu */}
        <ul className="desktop-menu d-none d-md-flex flex-row gap-3 list-unstyled m-0 align-items-center">
          <li>
            <Link to="/" className="text-decoration-none text-dark">
              Home
            </Link>
          </li>

          <li className="nav-item dropdown"
            onMouseEnter={handleShopEnter}
            onMouseLeave={handleShopLeave}>
            <Link to="/shop" className="dropdown-toggle">
              Shop
            </Link>
            <div className={`dropdown-menu ${shopDropdown ? 'show' : ''}`}>
              <Link to="/shop/bedroom" className="dropdown-item">Bedroom</Link>
              <Link to="/shop/living-room" className="dropdown-item">Living Room</Link>
              <Link to="/shop/dining-room" className="dropdown-item">Dining Room</Link>
            </div>
          </li>

          <li className="nav-item dropdown"
            onMouseEnter={handleServicesEnter}
            onMouseLeave={handleServicesLeave}>
            <button className="dropdown-toggle">
              Services
            </button>
            <div className={`dropdown-menu ${servicesDropdown ? 'show' : ''}`}>
              <Link to="/services/customization" className="dropdown-item">Customization</Link>
              <Link to="/services/innovation" className="dropdown-item">Innovation</Link>
            </div>
          </li>

          <li>
            <Link to="/contact" className="text-decoration-none text-dark">
              Contact
            </Link>
          </li>

          <li>
            <Link to="/signin">
              <button className="btn btn-dark">
                Sign In/Up
              </button>
            </Link>
          </li>

          {/* Navbar Icons */}
          <li className="nav-icons d-flex gap-3 align-items-center">
            <button className="icon-btn" aria-label="Search" onClick={toggleSearch}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
            <Link to="/dashboard" className="icon-btn" aria-label="Profile">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Link>
            <Link to="/cart" className="icon-btn" aria-label="Cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span className="cart-badge">{getCartItemCount()}</span>
            </Link>
          </li>

        </ul>

      </div>
      
      <Search isOpen={isSearchOpen} onClose={closeSearch} />
    </nav>
  );
}

export default Navbar;
