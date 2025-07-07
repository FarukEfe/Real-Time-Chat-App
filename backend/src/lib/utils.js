import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    // Create jwt token
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: "30d" // Token will expire in 30 days
    })

    res.cookie("jwt", token, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie will expire in 30 days
        httpOnly: true, // prevent XSS attacks cross-site scripting attacks
        sameSite: "strict", // CSRF attacks cross-site request forgery attacks
        secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
    })

    return token;
}