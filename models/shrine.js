const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shrineSchema = new Schema({
    title: String,
    name: {
        type: String,
    },
    content: {
        type: String,
        min: 10
    },
    shrine: {
        type: String,
    },
    subShrine: {
        type: String,
    },
    donation: {
        type: Number,
    },
}, { timestamps: true });

module.exports = mongoose.model("Shrine", shrineSchema);