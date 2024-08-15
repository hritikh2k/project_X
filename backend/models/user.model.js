import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    fullName: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
        minLength: 8
    },
    following: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    },
    followers: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    },
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

