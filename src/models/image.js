const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    image_name: {
        type: String,
        required: true,
        minLength: 3,
        trim: true
    },
    image: {
        type: String,
        required: true,
    },
    image_type: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Images = new mongoose.model("Images", ImageSchema);

module.exports = Images;
