import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString();

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: `User not found`
            })
        }
        if (!text && !img) {
            return res.status(400).json({
                error: "Post must have image or text"
            })
        }

        if (img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }

        const newPost = new Post({
            user: userId,
            text,
            img
        })

        await newPost.save();
        res.status(200).json(newPost);

    } catch (error) {
        console.log(`Error in create post in post.controllers controll ${error.message}`);
        res.status(500).json({
            error: "Internal server error from create post post.controller"
        });
    }
}
export const likesUnlikeOnPost = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id: postId } = req.params;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(400).json({
                error: "Post not found"
            })
        }

        const userLikePost = post.likes.includes(userId);
        if (userLikePost) {
            //unlike post
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            res.status(200).json({ message: "You unliked successfully" })
        } else {
            //like post
            post.likes.push(userId);
            await post.save();

            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like"
            });
            await notification.save();
            res.status(200).json({ message: "You liked successfully" })
        }

    } catch (error) {
        console.log(`Error in likeUnlike on post in post.controllers controll ${error.message}`);
        res.status(500).json({
            error: "Internal server error from likeUnlike on post post.controller"
        });
    }

}
export const commentOnPost = async (req, res) => {
    try {
        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;
        if (!text) {
            return res.status(400).json({
                error: "Text field is required"
            })
        }
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(400).json({
                error: "Post not found"
            })
        }
        const comment = { user: userId, text };
        post.comments.push(comment);
        await post.save();

        const notification = new Notification({
            from: userId,
            to: postId,
            type: "comment"
        });
        await notification.save();

        res.status(200).json(post)



    } catch (error) {
        console.log(`Error in comment on post in post.controllers controll ${error.message}`);
        res.status(500).json({
            error: "Internal server error from comment on post post.controller"
        });
    }

}
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(400).json({
                error: "Post not found"
            })
        }
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(400).json({
                error: "You are not authorized to delete the post"
            })
        }

        if (post.img) {
            const imageId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy();
        }
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "Post delete successfully"
        })

    } catch (error) {
        console.log(`Error in delete post in post.controllers controll ${error.message}`);
        res.status(500).json({
            error: "Internal server error from delete post post.controller"
        });
    }

}

