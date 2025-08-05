// Import hashing password package
import bcrypt from "bcryptjs";
// Import user model
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/coudinary.js";

// MARK: Signup
export const signup = async (req, res) => {
    // Handle user signup logic here
    const { username, fullname, email, password } = req.body;
    try {
        // Validate input
        if ( !username || !fullname || !email || !password) { return res.status(400).send("All fields are required"); }

        // Validate password input
        if (password.length < 6) { return res.status(400).send("Password must be at least 6 characters long"); }

        // Check if user already exists
        const user_email = await User.findOne({email});
        if (user_email) { return res.status(400).send("User already exists"); }

        const user_name = await User.findOne({username});
        if (user_name) { return res.status(400).send("Username already exists"); }

        // hash passwords
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName: fullname,
            username: username,
            email: email,
            password: hash,
        });

        if (newUser) {
            // Create jwt token 
            generateToken(newUser._id, res);
            // Save user to database
            await newUser.save();
            // Send response
            return res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                profilePic: newUser.profilePic
            });
        } else {
            return res.status(500).send("Error creating user | Invalid user data.");
        }
    } catch (error) {
        console.log("Error in signup:", error);
        return res.status(500).send("Internal Server Error");
    }
}

// MARK: Login
export const login = async (req, res) => {
    // Handle user login logic here
    const { email, password } = req.body;

    try {
        if (!email || !password) { return res.status(400).send("Email and password are required"); }

        const user = await User.findOne({email});
        if (!user) { return res.status(400).send("User not found"); }

        const PasswordCorrect = await bcrypt.compare(password, user.password);
        if (!PasswordCorrect) { return res.status(400).send("Invalid password"); }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });
    } catch (error) {
        console.log("Error in login:", error);
        return res.status(500).send("Internal Server Error");
    }
}

// MARK: Logout
export const logout = (req, res) => {
    // Handle user logout logic here
    try {
        res.cookie("jwt", "", { 
            maxAge: 0, // Set cookie to expire immediately 
        });
        return res.status(200).send("User logged out successfully");
    } catch (error) {
        console.log("Error in logout:", error.message);
        return res.status(500).send("Internal Server Error");
    }
}

// MARK: Update
export const update = async (req, res) => {
    // Use cloudinary.com to upload profile images onto the server

    try {
        const {profilePic} = req.body;
        const userId = req.user._id; // Get user ID from the request object

        if (!profilePic) {
            return res.status(400).send("Profile picture is required");
        };
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        // { new: true } gives you the user information post-update
        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadResponse.secure_url}, {new: true});

        return res.status(200).json(updatedUser);
    } catch (err) {
        console.log("Error in update:", err.message);
        return res.status(500).send("Internal Server Error");
    }
};

export const checkAuth = (req, res) => {
    try {
        return res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth:", error.message);
        return res.status(500).send("Internal Server Error");
    }
}