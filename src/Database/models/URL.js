import mongoose from "mongoose";

const URLSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    shortURL: {
        type: String,
        required: true,
    },
    clicks: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    date: {
        type: Date,
        default: Date.now,
    },
});



const URL = mongoose.model("URL", URLSchema);
export default URL;