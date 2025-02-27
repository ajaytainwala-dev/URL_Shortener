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
});


URLSchema.methods.incrementClicks = function() {
    this.clicks += 1;
    return this.save();
};

    
URLSchema.statics.createURL = function(longURL) {
    const shortURL = nanoid(6);
    const urlDocument = new this({ url: longURL, shortURL });
    return urlDocument.save();
};

const URL = mongoose.model("URL", URLSchema);
export default URL;