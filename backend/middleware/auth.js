import jwt from "jsonwebtoken";

import User from "../models/userModel.js"

const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret_key";
console.log("Middleware JWT_SECRET:", JWT_SECRET); // Add this line

export default async function authMiddleware(req, res, next) {
    // get token from authrization header

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: "not authorized and token missing "
        })
    }

    const token = authHeader.split(' ')[1];

    // verify and attach user object

    try {
            console.log("Token received:", token); // Log the received token
            const payload = jwt.verify(token, JWT_SECRET)
            console.log("Decoded payload:", payload); // Log the decoded payload
            
            const user = await User.findById(payload.id).select('-password')

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "user not found"
            })
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("JWT verification failed:", error.message); // More detailed error
        return res.status(401).json({
            success: false,
            message: "token invalid",
            error: error.message // Include error details in response
    })

    }

}





