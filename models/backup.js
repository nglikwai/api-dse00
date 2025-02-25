const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const backupSchema = new Schema(
  {
    name: String,
    backup: String,
    pin: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Backup", backupSchema);
