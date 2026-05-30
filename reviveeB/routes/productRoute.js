const express = require("express");
const router = express.Router();
const upload = require("../upload");
const productController = require("../controller/productController");
const { authenticate, adminOnly } = require("../middleware/auth");

// Route to add a new product with image upload (admin only)
router.post(
  "/addProduct", authenticate, adminOnly, upload.single("image"),
  productController.addProduct
);

// Route to update a product, including updating the image (admin only)
router.put(
  "/updateProduct/:id", authenticate, adminOnly,
  productController.updateProduct
);

// Route to fetch all products
router.get(
  "/getAllProducts",
  productController.getAllProducts
);

// Route to delete a product (admin only)
router.delete(
  "/deleteProduct/:id", authenticate, adminOnly,
  productController.deleteProduct
);

// Route to filter products
router.get(
  "/filter",
  productController.filteringProducts
);

// Route to sort products
router.get(
  "/sort",
  productController.sortingProducts
);

module.exports = router;
