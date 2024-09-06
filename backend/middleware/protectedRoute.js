import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(400).json({
                error: "Invalid:token is not provided",
                message: "You need to login first"
            });
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        if (!decode) {
            return res.status(400).json({
                error: "Invalid token"
            })
        }
        const user = await User.findById(decode.userId).select("-password");

        if (!user) {
            return res.status(400).json({
                error: "user not found"
            })
        }

        req.user = user;
        next();

    } catch (error) {
        console.log(`Error in protected route controll ${error.message}`);
        res.status(500).json({
            error: "Internal server error from protected route protectedRoute"
        })
    }
}