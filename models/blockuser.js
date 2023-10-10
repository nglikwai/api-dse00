const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blockuserSchema = new Schema({
  ip: String,
  title: String,
  display_name: String,
});

module.exports = mongoose.model("Blockuser", blockuserSchema);
