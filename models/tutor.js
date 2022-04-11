const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tutorSchema = new Schema({
    name: String,
    age: Number,
    school: String,
    teachingSubjects: [String],
    teachingSubjectsPrice: [Number],
    intro: String,
    details: [String]
}, { timestamps: true });

module.exports = mongoose.model("Tutor", tutorSchema);