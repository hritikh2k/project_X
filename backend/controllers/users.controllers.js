import generateTokenAndSetCookie from "../lib/utils/generateToken.js";
import User from "../models/user.model.js";
import bycrypt from "bcryptjs";

export const getUserProfile = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username }).select("-password")
        if (!user) {
            res.status(400).json({
                error: "User not found"
            })
        }
        res.status(200).json(user)
    } catch (error) {
        console.log(`Error in getUserProfile controll ${error.message}`);
        res.status(500).json({
            error: "Internal server error from getUserProfile users.controller"
        })
    }
}

export const followUnfollow = async (req, res) => {

}

export const updateUserProfile = async (req, res) => {

}