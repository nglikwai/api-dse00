const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2')

const tutorSchema = new Schema({
    name: String,
    age: Number,
    gender: String,
    school: String,
    popular: Number,
    location: [String],
    teachingSubjects: [String],
    teachingSubjectsPrice: [Number],
    price: Number,
    intro: String,
    details: [String]
}, { timestamps: true });


tutorSchema.plugin(mongoosePaginate);


module.exports = mongoose.model("Tutor", tutorSchema);