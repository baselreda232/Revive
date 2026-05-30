 import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home/Home";
import Shop from "./pages/Shop/Shop";
import Bedroom from "./pages/Shop/Bedroom";
import LivingRoom from "./pages/Shop/LivingRoom";
import DiningRoom from "./pages/Shop/DiningRoom";
import ShoppingCart from "./pages/Shop/ShoppingCart";
import Checkout from "./pages/Shop/Checkout";
import Services from "./pages/Services/Services";
import Customization from "./pages/Services/Customization";
import CustomizationConfirmation from "./pages/Services/CustomizationConfirmation";
import Innovation from "./pages/Services/Innovation";
import InnovationConfirmation from "./pages/Services/InnovationConfirmation";
import Dashboard from "./pages/Dashboard/Dashboard";
import Contact from "./pages/Contact/Contact";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import "./App.css";

function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
        <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/bedroom" element={<Bedroom />} />
          <Route path="/shop/living-room" element={<LivingRoom />} />
          <Route path="/shop/dining-room" element={<DiningRoom />} />
          <Route path="/cart" element={<ShoppingCart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/customization" element={<Customization />} />
          <Route path="/customization-confirmation" element={<CustomizationConfirmation />} />
          <Route path="/services/innovation" element={<Innovation />} />
          <Route path="/innovation-confirmation" element={<InnovationConfirmation />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
        </main>
        <Footer />
      </Router>
    </CartProvider>
  );
}

export default App; 