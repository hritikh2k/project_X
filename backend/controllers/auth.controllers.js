import generateTokenAndSetCookie from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bycrypt from "bcryptjs";


export const signup = async (req, res) => {
    try {
        const { username, fullname, email, password } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: "Invalid email format"
            })
        }

        const existUser = await User.findOne({ username });
        if (existUser) {
            res.status(400).json({
                error: "User already exist"
            })
        }

        const existEmail = await User.findOne({ email });
        if (existEmail) {
            res.status(400).json({
                error: "Email already exist"
            })
        }

        if (password.length < 6) {
            res.status(400).json({
                error: "password must be greater than 6 digits"
            })
        }

        const salt = await bycrypt.genSalt(10);
        const hashPassword = await bycrypt.hash(password, salt);

        const newUser = new User({
            username,
            fullname,
            email,
            password: hashPassword
        })

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();
            res.status(200).json({
                _id: newUser._id,
                username: newUser.username,
                fullname: newUser.fullname,
                email: newUser.email,
                following: newUser.following,
                followers: newUser.followers,
                profile: newUser.profileImage,
                bio: newUser.bio,
                coverImage: newUser.coverImage,
                bio: newUser.bio,
            })
        } else {
            res.status(400).json({
                error: "invalid user data"
            })
        }

    } catch (error) {
        console.log(`Error in signup controll ${error.message}`);
        res.status(500).json({
            error: "Internal server error from auth.controller"
        })


    }


}

export const login = async (req, res) => {

}
export const logout = async (req, res) => {
    res.json({
        msg: "hit the logout page1"


    })
}
