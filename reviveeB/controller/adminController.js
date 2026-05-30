const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//check email format (must contain @ and a valid domain)
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    // Check if all fields are provided
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Validate inputs
    if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    try {
        // Check against environment variables
        if (email !== process.env.ADMIN_EMAIL) {
            return res.status(401).json({ message: "Invalid admin credentials" });
        }

        // Compare password with hashed password from environment
        const isValid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD);
        if (!isValid) {
            return res.status(401).json({ message: "Invalid admin credentials" });
        }

        // Generate admin JWT token
        const token = jwt.sign(
            {
                adminInfo: {
                    email: process.env.ADMIN_EMAIL,
                    role: 'admin'
                }
            },
            process.env.TOKEN_SECRET,
            { expiresIn: "7d" }
        );

        // Set token in cookie like customer controller
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Send the response
        res.json({
            token,
            email: process.env.ADMIN_EMAIL,
            role: 'admin'
        });

    } catch {
        res.status(500).json({ message: "Internal server error" });
    }
};
 //logout
const logoutAdmin = (req, res) => {
	res.clearCookie("jwt", {
		httpOnly: true,
		sameSite: "None",
		secure: true,
	});
	res.json({ message: "Admin logged out successfully" });
};

module.exports = {
    loginAdmin,
    logoutAdmin
};
