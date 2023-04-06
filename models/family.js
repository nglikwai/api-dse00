const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const familySchema = new Schema({
    title: String,
    id: String,
    name: String,
    locations: {
        type: [String],
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model("Family", familySchema);