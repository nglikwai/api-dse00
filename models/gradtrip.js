const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gradTripSchema = new Schema({
    trip: String,
    username: {
        type: String,
        default: 'DSEJJ'
    },
}, { timestamps: true });

module.exports = mongoose.model("Gradtrip", gradTripSchema);