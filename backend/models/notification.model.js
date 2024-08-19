import mongoose from "mongoose";
import User from "./user.model.js";
import { boolean } from "zod";

const notificationSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    type: {
        type: String,
        require: true,
        enum: ["follow", "unfollow", "like"]
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;