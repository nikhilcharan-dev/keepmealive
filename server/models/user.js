import mongoose from "mongoose";
import UrlSchema from "./url.js";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    urls: {
        type: [UrlSchema],
        default: []
    },
    worker: {
        type: String,
        required: true
    },
}, { timestamps: true });

const User = mongoose.model("user", userSchema);
export default User;