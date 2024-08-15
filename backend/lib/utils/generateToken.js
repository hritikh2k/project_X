import jwt from "jsonwebtoken";

export default function generateTokenAndSetCookie(newUser, res) {
    const token = jwt.sign(newUser, process.env.JWT_SECRET, {
        expiresIn: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,

    })
}