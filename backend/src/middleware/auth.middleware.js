import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode token

        if (!decoded) {
            return res.status(401).json({ message: "Not authorized, token failed" });
        }

        const user = await User.findById(decoded.userId).select("-password"); // Find user by ID and select everything, but the password (for security reasons)

        if (!user) {
            return res.status(401).json({ message: "Not authorized, user not found" });
        }

        req.user = user;

        next(); // This will be the update call post-authentication via cookies
        
    } catch (err) {
        console.log("Error in protectRoute middleware:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}