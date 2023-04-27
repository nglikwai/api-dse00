const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const jupasSchema = new Schema({
    program: String,
    school: String,
    year: {
        type: Number,
        min: 4
    },
    code: {
        type: Number,
        min: 4
    },
    chin: Number,
    eng: Number,
    math: Number,
    ls: Number,
    e1: Number,
    e2: Number,
    e3: Number,
    m1m2: Number,
    like: {
        type: Number,
        default: 0
    },
    dislike: {
        type: Number,
        default: 0
    },

}, { timestamps: true });

module.exports = mongoose.model("Jupas", jupasSchema);