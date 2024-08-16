import User from "../models/user.model.js"
// import dotenv from dotenv;

export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookie.jwt;
        if (!token) {
            res.status(400).json({ error: "Invalid:token is not provided" });
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        if (!decode) {
            res.status(400).json({
                error: "Invalid token"
            })
        }
        const user = await User.findById(decode.userId).select("-password");

        if (!user) {
            res.status(400).json({
                error: "user not found"
            })
        }

        req.user = user
        next();

    } catch (error) {
        console.log(`Error in protected route controll ${error.message}`);
        res.status(500).json({
            error: "Internal server error from protected route protectedRoute"
        })
    }
}