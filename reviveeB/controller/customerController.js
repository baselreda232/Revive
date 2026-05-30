const customer = require("../model/customer.js");
const product = require("../model/product.js");
const order = require("../model/order.js");
const customization = require("../model/customization.js");
const innovation = require("../model/innovation.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// Validation helpers

//check email format (must contain @ and a valid domain)
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

//check password (minimum 8 characters and must contain at least one uppercase letter)
const isValidPassword = (password) => {
    return password.length >= 8 && /[A-Z]/.test(password);
};

//check phone number (numbers only, between 10 and 15 digits)
const isValidPhone = (phone) => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone);
};

// Helper function to calculate cart pricing
const calculateCartPricing = (cartItems) => {
    let subtotal = 0;
    const itemsWithPricing = cartItems.map(item => {
        const itemTotal = item.product_id.price * item.quantity;
        subtotal += itemTotal;
        return {
            _id: item._id,
            product_id: item.product_id._id,
            product_title: item.product_id.title,
            quantity: item.quantity,
            item_total: itemTotal,
            unit_price: item.product_id.price
        };
    });
    
    return {
        items: itemsWithPricing,
        subtotal: subtotal,
        total_items: cartItems.length
    };
};


//signup
const signup = async (req, res) => {
    const { full_name, email, password, phone_number } = req.body;

    //check if customer inputs all fields
    if (!full_name || !email || !password || !phone_number) {
        return res.status(400).json({ message: "All fields are required" });
    }

    //validate email format
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    //validate password length
	if (!isValidPassword(password)) {
    return res.status(400).json({ message: "Password must be at least 8 characters and contain at least one uppercase letter" });
	} 

    //validate phone number
    if (!isValidPhone(phone_number)) {
        return res.status(400).json({ message: "Phone number must contain only digits and be between 10 and 15 digits" });
    }

    //check if customer exists or not
    const foundCustomer = await customer.findOne({ email }).exec();
    if (foundCustomer) {
        return res.status(401).json({ message: "Customer already exists" });
    }

    //hashing password
    const hashedPassword = await bcrypt.hash(password, 15);

    //creating new customer
    const newCustomer = await customer.create({
        full_name,
        email,
        password: hashedPassword,
        phone_number,
    });

    //set token
    const token = jwt.sign(
        {
            customerInfo: {
                id: newCustomer._id,
                role: 'customer'
            },
        },
        process.env.TOKEN_SECRET,
        { expiresIn: "7d" }
    );

    //store token in cookie & set its properties
    res.cookie("jwt", token, {
        httpOnly: true, //accessible only by web server
        secure: process.env.NODE_ENV === "production", // HTTPS in production
        sameSite: "None", //store at main domain and sub domain
        maxAge: 7 * 24 * 60 * 60 * 1000, //in milliseconds
    });

    //save the new customer
    await newCustomer.save();

    //response details
    res.json({
        message: "Account created successfully",
        token,
        full_name: newCustomer.full_name,
    });
};
//end signup

//login
const login = async (req, res) => {
    const { email, password } = req.body;

    //check if fields required are there
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    //validate email format
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    //validate password length
	if (!isValidPassword(password)) {
    return res.status(400).json({ message: "Password must be at least 8 characters and contain at least one uppercase letter" });
	}

    //check if email exists
    const foundCustomer = await customer.findOne({ email }).exec();
    if (!foundCustomer) {
        return res.status(401).json({ message: "Customer Doesn't exist" });
    }

    //if yes check password
    const passwordCheck = await bcrypt.compare(password, foundCustomer.password);
    if (!passwordCheck) {
        return res.status(401).json({ message: "Wrong Email or Password" });
    }

    const token = jwt.sign(
        {
            customerInfo: {
                id: foundCustomer._id,
                role: 'customer'
            },
        },
        process.env.TOKEN_SECRET,
        { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
        httpOnly: true, //accessible only by web server
        secure: process.env.NODE_ENV === "production", // HTTPS in production
        sameSite: "None", //store at main domain and sub domain
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
        message: "Login successful",
        token,
        email: foundCustomer.email,
        full_name: foundCustomer.full_name,
        phone_number: foundCustomer.phone_number,
    });
};
//end login
 //logout
const logout = (req, res) => {
	res.clearCookie("jwt", {
		httpOnly: true,
		sameSite: "None",
		secure: true,
	});
	res.json({ message: "You are logged out" });
};

//forgot password
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    //check if field is there
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    //check if customer exists
    const foundCustomer = await customer.findOne({ email }).exec();

    //always respond the same to prevent email enumeration
    if (!foundCustomer) {
        return res.status(200).json({ message: "This email doesn't exist" });
    }

    //create a short-lived reset token using the customer's hashed password as part of the secret
    //this makes the token one-time-use: once password changes, token is invalid
    const resetToken = jwt.sign(
        {
            customerInfo: {
                id: foundCustomer._id,
                hash: foundCustomer.password,
                role: 'customer'
            },
        },
        process.env.TOKEN_RESET_SECRET,
        { expiresIn: "5m" }
    );

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    //send reset email
    await sendEmail({
        to: foundCustomer.email,
        subject: "Password Reset Request",
        html: `
            <h2>Password Reset</h2>
            <p>You requested a password reset. This link expires in <strong>5 minutes</strong>.</p>
            <a href="${resetURL}" style="padding:10px 20px;background:#4F46E5;color:white;border-radius:5px;text-decoration:none;">
                Reset Password
            </a>
            <p>If you didn't request this, ignore this email.</p>
        `,
    });

    res.status(200).json({ message: "The reset link has been sent" });
};
//end forgot password

//reset password
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    //check if field is there
    if (!newPassword) {
        return res.status(400).json({ message: "Please Enter your New Password" });
    }

    //verify token
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.TOKEN_RESET_SECRET);
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(400).json({ message: "Reset link has expired, please request a new one" });
        }
        return res.status(400).json({ message: "Invalid reset link" });
    }

    //check if customer exists
    const foundCustomer = await customer.findById(decoded.customerInfo.id).exec();
    if (!foundCustomer) {
        return res.status(404).json({ message: "Customer doesn't exist" });
    }

    //check token hasn't already been used (hash changes once password is reset)
    if (decoded.customerInfo.hash !== foundCustomer.password) {
        return res.status(400).json({ message: "Reset link has already been used" });
    }

    //hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 15);
    foundCustomer.password = hashedPassword;
    await foundCustomer.save();

    res.status(200).json({ message: "Password reset successful" });
};
//end reset password

// Update customer profile
const updateProfile = async (req, res) => {
    try {
        const customerId = req.user.customerInfo.id;
        const { full_name, phone_number } = req.body;

        // Validate inputs
        if (!full_name && !phone_number) {
            return res.status(400).json({ message: "At least one field is required for update" });
        }

        if (phone_number && !isValidPhone(phone_number)) {
            return res.status(400).json({ message: "Invalid phone number format" });
        }

        const updateData = {};
        if (full_name) updateData.full_name = full_name;
        if (phone_number) updateData.phone_number = phone_number;

        const updatedCustomer = await customer.findByIdAndUpdate(
            customerId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password");

        res.status(200).json({
            message: "Profile updated successfully",
            customer: updatedCustomer
        });

    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
};

// Add new address
const addAddress = async (req, res) => {
    try {
        const customerId = req.user.customerInfo.id;
        const { street, city, state, country, is_default } = req.body;

        // Validate required fields
        if (!street || !city || !state) {
            return res.status(400).json({ message: "Street, city, and state are required" });
        }

        const newAddress = {
            street,
            city,
            state,
            country: country || "Egypt",
            is_default: is_default || false
        };

        // If setting as default, unset other default addresses
        if (newAddress.is_default) {
            await customer.findByIdAndUpdate(
                customerId,
                { $set: { "addresses.$[].is_default": false } }
            );
        }

        const updatedCustomer = await customer.findByIdAndUpdate(
            customerId,
            { $push: { addresses: newAddress } },
            { new: true, runValidators: true }
        ).select("-password");

        res.status(200).json({
            message: "Address added successfully",
            addresses: updatedCustomer.addresses
        });

    } catch (error) {
        res.status(500).json({ message: "Error adding address", error: error.message });
    }
};

// Update address
const updateAddress = async (req, res) => {
    try {
        const customerId = req.user.customerInfo.id;
        const { addressId } = req.params;
        const { street, is_default } = req.body;

        // Build update object - only allow street and is_default
        const updateData = {};
        if (street) updateData["addresses.$.street"] = street;
        if (is_default !== undefined) updateData["addresses.$.is_default"] = is_default;

        // If setting as default, unset other default addresses
        if (is_default) {
            await customer.findByIdAndUpdate(
                customerId,
                { $set: { "addresses.$[].is_default": false } }
            );
        }

        const updatedCustomer = await customer.findOneAndUpdate(
            { _id: customerId, "addresses._id": addressId },
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password");


        res.status(200).json({
            message: "Address updated successfully",
            addresses: updatedCustomer.addresses
        });

    } catch (error) {
        res.status(500).json({ message: "Error updating address", error: error.message });
    }
};

// Delete address
const deleteAddress = async (req, res) => {
    try {
        const customerId = req.user.customerInfo.id;
        const { addressId } = req.params;

        const updatedCustomer = await customer.findByIdAndUpdate(
            customerId,
            { $pull: { addresses: { _id: addressId } } },
            { new: true }
        ).select("-password");


        res.status(200).json({
            message: "Address deleted successfully",
            addresses: updatedCustomer.addresses
        });

    } catch (error) {
        res.status(500).json({ message: "Error deleting address", error: error.message });
    }
};

// Get customer profile
const getProfile = async (req, res) => {
    try {
        const customerId = req.user.customerInfo.id;

        const customerData = await customer.findById(customerId).select("-password");
    

        res.status(200).json({
            message: "Profile retrieved successfully",
            customer: customerData
        });

    } catch (error) {
        res.status(500).json({ message: "Error retrieving profile", error: error.message });
    }
};

// Add to cart
const addToCart = async (req, res) => {
    try {
        const customerId = req.user.customerInfo.id;
        const { product_id, quantity } = req.body;

        // Validate inputs
        if (!product_id || !quantity || quantity < 1) {
            return res.status(400).json({ message: "Product ID and valid quantity are required" });
        }

        // Check if product exists - handle both ObjectId and string IDs
        let productExists;
        try {
            productExists = await product.findById(product_id);
        } catch {
            // If not a valid ObjectId, try to find by title
            productExists = await product.findOne({ title: product_id });
        }
        
        if (!productExists) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if product already in cart
        const customerData = await customer.findById(customerId);
        const existingItem = customerData.cart.find(item => item.product_id.toString() === product_id);

        if (existingItem) {
            // Update quantity if already in cart
            await customer.findOneAndUpdate(
                { _id: customerId, "cart.product_id": product_id },
                { $set: { "cart.$.quantity": existingItem.quantity + quantity } }
            );
        } else {
            // Add new item to cart
            await customer.findByIdAndUpdate(
                customerId,
                { $push: { cart: { product_id, quantity } } }
            );
        }

        const updatedCustomer = await customer.findById(customerId).populate('cart.product_id');
        const cartWithPricing = calculateCartPricing(updatedCustomer.cart);
        
        res.status(200).json({
            message: "Product added to cart successfully",
            cart: cartWithPricing
        });

    } catch (error) {
        res.status(500).json({ message: "Error adding to cart", error: error.message });
    }
};

// Get cart
const getCart = async (req, res) => {
    try {
        const customerId = req.user.customerInfo.id;

        const customerData = await customer.findById(customerId).populate('cart.product_id');

        const cartWithPricing = calculateCartPricing(customerData.cart);

        res.status(200).json({
            message: "Cart retrieved successfully",
            cart: cartWithPricing
        });

    } catch (error) {
        res.status(500).json({ message: "Error retrieving cart", error: error.message });
    }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
    try {
        const customerId = req.user.customerInfo.id;
        const { product_id } = req.params;
        const { quantity } = req.body;

        // Validate quantity
        if (!quantity || quantity < 1) {
            return res.status(400).json({ message: "Valid quantity is required" });
        }

        const updatedCustomer = await customer.findOneAndUpdate(
            { _id: customerId, "cart.product_id": product_id },
            { $set: { "cart.$.quantity": quantity } },
            { new: true }
        ).populate('cart.product_id');

        const cartWithPricing = calculateCartPricing(updatedCustomer.cart);
        
        res.status(200).json({
            message: "Cart item updated successfully",
            cart: cartWithPricing
        });

    } catch (error) {
        res.status(500).json({ message: "Error updating cart item", error: error.message });
    }
};

// Remove from cart
const removeFromCart = async (req, res) => {
    try {
        const customerId = req.user.customerInfo.id;
        const { product_id } = req.params;

        const updatedCustomer = await customer.findByIdAndUpdate(
            customerId,
            { $pull: { cart: { product_id } } },
            { new: true }
        ).populate('cart.product_id');

        const cartWithPricing = calculateCartPricing(updatedCustomer.cart);
        
        res.status(200).json({
            message: "Item removed from cart successfully",
            cart: cartWithPricing
        });

    } catch (error) {
        res.status(500).json({ message: "Error removing from cart", error: error.message });
    }
};

// Clear cart
const clearCart = async (req, res) => {
    try {
        const customerId = req.user.customerInfo.id;

        const updatedCustomer = await customer.findByIdAndUpdate(
            customerId,
            { $set: { cart: [] } },
            { new: true }
        );

        res.status(200).json({
            message: "Cart cleared successfully",
            cart: updatedCustomer.cart
        });

    } catch (error) {
        res.status(500).json({ message: "Error clearing cart", error: error.message });
    }
};

// Checkout
const checkout = async (req, res) => {
    try {
        const customerId = req.user.customerInfo.id;
        const { address_id, payment_method } = req.body;

        // Validate inputs
        if (!address_id || !payment_method) {
            return res.status(400).json({ message: "Address ID and payment method are required" });
        }

        if (!['cash', 'instapay'].includes(payment_method)) {
            return res.status(400).json({ message: "Invalid payment method" });
        }

        // Get customer with cart and addresses
        const customerData = await customer.findById(customerId).populate('cart.product_id');
        

        // Check if cart is empty
        if (customerData.cart.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // Check if customer has any addresses
        if (customerData.addresses.length === 0) {
            return res.status(400).json({ 
                message: "No addresses found. Please add an address before checkout.",
                requires_address: true
            });
        }

        // Find selected address
        const selectedAddress = customerData.addresses.id(address_id);
        if (!selectedAddress) {
            return res.status(404).json({ message: "Address not found" });
        }

        // Calculate pricing
        const cartWithPricing = calculateCartPricing(customerData.cart);
        const shipping_fee = 50;
        const total = cartWithPricing.subtotal + shipping_fee;

        // Create order items
        const orderItems = cartWithPricing.items.map(item => ({
            product_id: item.product_id,
            product_title: item.product_title,
            quantity: item.quantity,
            unit_price: item.unit_price,
            item_total: item.item_total
        }));

        // Create order
        const newOrder = await order.create({
            customer_id: customerId,
            items: orderItems,
            shipping_address: {
                street: selectedAddress.street,
                city: selectedAddress.city,
                state: selectedAddress.state,
                country: selectedAddress.country
            },
            payment_method: payment_method,
            pricing: {
                subtotal: cartWithPricing.subtotal,
                shipping_fee: shipping_fee,
                total: total
            }
        });

        // Clear cart after successful order
        await customer.findByIdAndUpdate(customerId, { cart: [] });

        res.status(201).json({
            message: "Order placed successfully",
            order: newOrder
        });

    } catch (error) {
        res.status(500).json({ message: "Error during checkout", error: error.message });
    }
};

// Get order history
const getOrders = async (req, res) => {
    try {
        const customerId = req.user.customerInfo.id;

        const orders = await order.find({ customer_id: customerId })
            .sort({ order_date: -1 }); // Most recent first

        res.status(200).json({
            message: "Orders retrieved successfully",
            orders: orders
        });

    } catch (error) {
        res.status(500).json({ message: "Error retrieving orders", error: error.message });
    }
};

// Get single order details
const getOrderById = async (req, res) => {
    try {
        const customerId = req.user.customerInfo.id;
        const { orderId } = req.params;

        const orderData = await order.findOne({ 
            _id: orderId, 
            customer_id: customerId 
        }).populate('items.product_id');

        if (!orderData) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({
            message: "Order retrieved successfully",
            order: orderData
        });

    } catch (error) {
        res.status(500).json({ message: "Error retrieving order", error: error.message });
    }
};

// Submit customization form
const submitCustomization = async (req, res) => {
    try {
        const customerId = req.user.customerInfo.id;
        const { 
            category, 
            project_description, 
            preferred_material, 
            color_finish
        } = req.body;

        // Validate required fields
        if (!category || !project_description || !preferred_material || !color_finish) {
            return res.status(400).json({ 
                message: "All fields are required" 
            });
        }

        // Handle uploaded images
        const design_inspiration = req.files ? req.files.map(file => file.path) : [];

        // Create new customization request
        const newCustomization = await customization.create({
            customer_id: customerId,
            category,
            project_description,
            preferred_material,
            color_finish,
            design_inspiration: design_inspiration
        });

        res.status(201).json({
            message: "Customization request submitted successfully",
            customization: newCustomization
        });

    } catch (error) {
        res.status(500).json({ message: "Error submitting customization", error: error.message });
    }
};

// Submit innovation form
const submitInnovation = async (req, res) => {
    try {
        const customerId = req.user.customerInfo.id;
        const { 
            category, 
            project_description, 
            innovation_level, 
            approval_visit_date,
            street,
            city,
            state
        } = req.body;

        // Validate required fields
        if (!category || !project_description || !innovation_level || !approval_visit_date || !street || !city || !state) {
            return res.status(400).json({ 
                message: "All fields are required" 
            });
        }

        // Validate innovation level
        if (!['basic', 'intermediate', 'advanced'].includes(innovation_level)) {
            return res.status(400).json({ 
                message: "Invalid innovation level. Must be: basic, intermediate or advanced" 
            });
        }

        // Create new innovation request
        const newInnovation = await innovation.create({
            customer_id: customerId,
            category,
            project_description,
            innovation_level,
            approval_visit_date: new Date(approval_visit_date),
            address: {
                street,
                city,
                state
            }
        });

        res.status(201).json({
            message: "Innovation request submitted successfully",
            innovation: newInnovation
        });

    } catch (error) {
        res.status(500).json({ message: "Error submitting innovation", error: error.message });
    }
};

// Get customer customizations
const getCustomizations = async (req, res) => {
    try {
        const customerId = req.user.customerInfo.id;

        const customizations = await customization.find({ customer_id: customerId })
            .sort({ submission_date: -1 }); // Most recent first

        res.status(200).json({
            message: "Customizations retrieved successfully",
            customizations: customizations
        });

    } catch (error) {
        res.status(500).json({ message: "Error retrieving customizations", error: error.message });
    }
};

// Get customer innovations
const getInnovations = async (req, res) => {
    try {
        const customerId = req.user.customerInfo.id;

        const innovations = await innovation.find({ customer_id: customerId })
            .sort({ submission_date: -1 }); // Most recent first

        res.status(200).json({
            message: "Innovations retrieved successfully",
            innovations: innovations
        });

    } catch (error) {
        res.status(500).json({ message: "Error retrieving innovations", error: error.message });
    }
};

module.exports = { 
    signup, 
    login, 
    logout, 
    forgotPassword, 
    resetPassword,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    getProfile,
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    checkout,
    getOrders,
    getOrderById,
    submitCustomization,
    submitInnovation,
    getCustomizations,
    getInnovations
};
