import mongoose from "mongoose";
import User from "./user.model.js";

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
        type: "string",
        require: true,
        enum: ["follow", "like"]
    },
    read: {


    }
}, { timestamps: true })