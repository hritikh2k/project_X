import { v2 as cloudinary } from "cloudinary";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

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
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        // To check for searched account is same as user 
        if (id === req.user._id.toString()) {
            return res.status(500).json({
                error: "you cannot follow/unfollow yourself"
            });
        }

        if (!currentUser || !userToModify) {
            return res.status(400).json({
                error: "User not found"
            });
        }

        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

            const newNotification = new Notification({
                type: "unfollow",
                from: userToModify._id,
                to: req.user._id
            })
            await newNotification.save();

            res.status(200).json({
                message: `User unfollowed ${userToModify.username} successfully`
            });
        } else {
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

            const newNotification = new Notification({
                type: "follow",
                from: req.user._id,
                to: userToModify._id
            })
            await newNotification.save();

            res.status(200).json({
                message: `User followed ${userToModify.username} successfully `
            });
        }

    } catch (error) {
        console.log(`Error in followUnfollow controll ${error.message}`);
        res.status(500).json({
            error: "Internal server error from followUnfollow users.controller"
        })
    }

}

export const getSuggestUsers = async (req, res) => {
    try {
        console.log(req.user.username);
        const userId = req.user._id;
        const userFollowedByMe = await User.findById(userId).select("following");

        const user = await User.aggregate([{
            $match: {
                _id: { $ne: userId },
            },
        },
        {
            $sample: { size: 10 },
        }
        ])

        const filteredUsers = user.filter((user) => !userFollowedByMe.following.includes(user._id));
        const sugggestedUsers = filteredUsers.slice(0, 5);

        sugggestedUsers.forEach((user) => (user.password = null));
        res.status(200).json(
            sugggestedUsers
        )

    } catch (error) {
        console.log(`Error in getSuggestUsers controll ${error.message}`);
        res.status(500).json({
            error: "Internal server error from getSuggestUsers users.controller"
        })
    }
}

export const updateUserProfile = async (req, res) => {
    let { username, fullname, email, currentPassword, newPassword, link, bio } = req.body;
    let { profileImage, coverImage } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }
        if ((!currentPassword && newPassword) || (!newPassword && currentPassword)) {
            return res.status(400).json({ message: "Please provide both currnet passaword and new password" });
        }
        if (newPassword && currentPassword) {
            const isMatch = bcrypt.compare(user.password, currentPassword);
            if (!isMatch) {
                return res.status(400).json({ message: "Current password is incorrect" });
            }
            if (newPassword.length < 6) {
                return res.status(400).json({ error: "Password must be greater than 6 digits" });
            }
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        if (profileImage) {
            if (user.profileImage) {
                await cloudinary.uploader.destroy(user.profileImage.split("/").pop().split(".")[0]);
            }
            const uploaderResponse = await cloudinary.uploader.upload(profileImage);
            profileImage = uploaderResponse.secure_url;
        }

        if (coverImage) {
            if (user.coverImage) {
                await cloudinary.uploader.destroy(user.coverImage.split("/").pop().split(".")[0]);
            }
            const uploaderResponse = await cloudinary.uploader.upload(coverImage);
            coverImage = uploaderResponse.secure_url
        }

        user.fullname = username || user.fullname;
        user.email = email || user.email;
        user.fullname = fullname || user.fullname;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.coverImage = coverImage || user.coverImage;
        user.profileImage = profileImage || user.profileImage;

    } catch (error) {
        console.log(`Error in updateUserProfile controll ${error.message}`);
        res.status(500).json({
            error: "Internal server error from updateUserProfile users.controller"
        })
    }
}