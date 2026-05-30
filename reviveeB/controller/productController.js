const product = require("../model/product");

//add product
const addProduct = async (req, res) => {
  const { title, price, description, color, category } = req.body;
  const image = req.file ? req.file.path : null;

  // Check if all required fields are provided
  if (!title || !price || !description || !color || !category || !image) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // check if product is already exists or not
    const foundProduct = await product.findOne({ title }).exec();
    if (foundProduct) {
        return res.status(401).json({ message: "Product already exists" });
    }

  try {
    // Create and save the new product in one step
    const newProduct = await product.create({
      title,
      price,
      description,
      color, 
      category,
      image
    });
        
    res.status(200).json({
      message: "Product created successfully",
      newProduct,
    });

  } catch (error) {
    // Log the error details to your server console for debugging
    console.error("Error creating product:", error);

    // Send back a more descriptive error message
    res.status(500).json({
      message: "Server Error creating product",
      error: error.message || error
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updateData = req.body;

    // // If an image file was uploaded, use its path
    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedProduct = await product.findByIdAndUpdate(
      productId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error: error.message || error});
  }
};


// Fetch all products
const getAllProducts = async (req, res) => {
  try {
    const products = await product.find().lean();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const deletedProduct = await product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      deletedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};

// Sort products
const sortingProducts = async (req, res) => {
  try {
    const { sort } = req.query;
    const products = await product.find().sort(sort);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to sorting products", error: error.message });
  }
};

// Filter products
const filteringProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice } = req.query;

    // Build a filter object dynamically
    const filter = {};
    if (category) filter.category = category;
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };

    const products = await product.find(filter); // Apply the filter
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
};

module.exports = {
  getAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  sortingProducts,
  filteringProducts,
};
