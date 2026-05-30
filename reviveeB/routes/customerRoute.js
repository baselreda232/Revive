const express = require("express");
const router = express.Router();
const customerController = require("../controller/customerController");
const { authenticate, customerOnly } = require("../middleware/auth");
const upload = require("../upload");

router.post("/signup", customerController.signup);
router.post("/login", customerController.login);
router.post("/logout", authenticate, customerOnly, customerController.logout);
router.post("/forgot-password", customerController.forgotPassword);
router.post("/reset-password/:token", customerController.resetPassword);

// Profile routes (all require authentication)
router.get("/profile", authenticate, customerOnly, customerController.getProfile);
router.put("/profile", authenticate, customerOnly, customerController.updateProfile);
router.post("/addresses", authenticate, customerOnly, customerController.addAddress);
router.put("/addresses/:addressId", authenticate, customerOnly, customerController.updateAddress);
router.delete("/addresses/:addressId", authenticate, customerOnly, customerController.deleteAddress);

// Cart routes (all require authentication)
router.post("/cart", authenticate, customerOnly, customerController.addToCart);
router.get("/cart", authenticate, customerOnly, customerController.getCart);
router.put("/cart/:product_id", authenticate, customerOnly, customerController.updateCartItem);
router.delete("/cart/:product_id", authenticate, customerOnly, customerController.removeFromCart);
router.delete("/cart", authenticate, customerOnly, customerController.clearCart);

// Checkout and order routes (all require authentication)
router.post("/checkout", authenticate, customerOnly, customerController.checkout);
router.get("/orders", authenticate, customerOnly, customerController.getOrders);
router.get("/orders/:orderId", authenticate, customerOnly, customerController.getOrderById);

// Customization and innovation routes (all require authentication)
router.post("/customization", authenticate, customerOnly, upload.array('design_inspiration', 5), customerController.submitCustomization);
router.get("/customization", authenticate, customerOnly, customerController.getCustomizations);
router.post("/innovation", authenticate, customerOnly, customerController.submitInnovation);
router.get("/innovation", authenticate, customerOnly, customerController.getInnovations);

module.exports = router; 