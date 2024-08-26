import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
    profileImage: {
        type: String,
        default: ""
    }, bio: {
        type: String,
        default: ""
    }, coverImage: {
        type: String,
        default: ""
    }, link: {
        type: String,
        default: ""
    }

});
const User = mongoose.model("User", userSchema);

export default User;

