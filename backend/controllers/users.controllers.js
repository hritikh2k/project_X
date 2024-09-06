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
    let userId = req.user._id;

    try {
        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        // Password update validation
        if ((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
            return res.status(400).json({ message: "Please provide both current password and new password" });
        }

        if (newPassword && currentPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password); // Await added here
            if (!isMatch) {
                return res.status(400).json({ message: "Current password is incorrect" });
            }
            if (newPassword.length < 6) {
                return res.status(400).json({ error: "Password must be greater than 6 characters" });
            }
            // Update password only if conditions are met
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        // Profile image upload handling
        if (profileImage) {
            if (user.profileImage) {
                await cloudinary.uploader.destroy(user.profileImage.split("/").pop().split(".")[0]);
            }
            const uploaderResponse = await cloudinary.uploader.upload(profileImage);
            user.profileImage = uploaderResponse.secure_url;
        }

        // Cover image upload handling
        if (coverImage) {
            if (user.coverImage) {
                await cloudinary.uploader.destroy(user.coverImage.split("/").pop().split(".")[0]);
            }
            const uploaderResponse = await cloudinary.uploader.upload(coverImage);
            user.coverImage = uploaderResponse.secure_url;
        }

        // Update user fields
        user.username = username || user.username;
        user.fullname = fullname || user.fullname;
        user.email = email || user.email;
        user.bio = bio || user.bio;
        user.link = link || user.link;

        // Save user changes
        await user.save();

        // Return the updated user profile
        res.status(200).json({
            message: "User profile updated successfully",
            user
        });

    } catch (error) {
        console.log(`Error in updateUserProfile controller: ${error.message}`);
        res.status(500).json({
            error: "Internal server error from updateUserProfile users.controller"
        });
    }
};
