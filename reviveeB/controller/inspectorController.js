const inspector = require("../model/inspector.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//signup
const signup = async (req, res) => {
    const { full_name, national_id, password, phone_number} = req.body;

    // Check if inspector inputs all fields
    if (!full_name || !password || !phone_number) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Check if inspector exists or not
    const foundInspector = await inspector.findOne({ phone_number }).exec();
    if (foundInspector) {
        return res.status(401).json({ message: "inspector already exists" });
    }

    // Hashing password
    const hashedPassword = await bcrypt.hash(password, 15);

	//creating new inspector
    const newInspector = await inspector.create({
        full_name,
        national_id,
        password: hashedPassword,
        phone_number
    });

    // Set token
    const token = jwt.sign(
        {
            inspectorInfo: {
                id: newInspector._id,
                role: 'inspector'
            },
        },
        process.env.TOKEN_SECRET,
        { expiresIn: "7d" }
    );

    // Store token in cookie & set its properties
    res.cookie("jwt", token, {
        httpOnly: true,//accessible only by web server
        secure: process.env.NODE_ENV === 'production', // HTTPS in production
        sameSite: "None",//store at main domain and sub domain
        maxAge: 7 * 24 * 60 * 60 * 1000, //in milliseconds
    });

    // Save the new inspector
    await newInspector.save();

  //response details
	res.json({
		token,
		full_name: newInspector.full_name,
	});
};//end signup

//login
const login = async (req, res) => {
	const { phone_number, password } = req.body;

	//check if fields required are there
	if (!phone_number || !password) {
		return res.status(400).json({ message: "All fields are required" });
	}

	//check if phone_number exists
	const foundInspector = await inspector.findOne({ phone_number }).exec();
	if (!foundInspector) {
		return res.status(401).json({ message: "inspector Doesn't exist" });
	}

	//if yes check password
	const passwordCheck = await bcrypt.compare(password, foundInspector.password);
	if (!passwordCheck) {
		return res.status(401).json({ message: "Wrong national_id or Password" });
	}

	const token = jwt.sign(
		{
			inspectorInfo: {
				id: foundInspector._id,
				role: 'inspector'
			},
		},
		process.env.TOKEN_SECRET,
		{ expiresIn: "7d" }
	);

	res.cookie("jwt", token, {
		httpOnly: true, //accessible only by web server
		secure: process.env.NODE_ENV === 'production', // HTTPS in production 
		sameSite: "None", //store at main domain and sub domain
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});

	res.json({
		token,
		full_name: foundInspector.full_name
	});
};
//end login

module.exports = {signup, login};