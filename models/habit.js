const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const habitSchema = new Schema(
  {
    id: String,
    name: String,
    token: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Habit", habitSchema);
