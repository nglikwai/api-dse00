const express = require("express");
const router = express.Router();
const habits = require("../controllers/habits");
const catchAsync = require("../utils/catchAsync");

router.route("/").get(catchAsync(habits.index));

router.route("/friend/:name").get(catchAsync(habits.getFriend));

router.route("/go-online").post(catchAsync(habits.createupdate));

router
  .route("/backup")
  .get(catchAsync(habits.getBackUp))
  .post(catchAsync(habits.uploadBackup));

module.exports = router;
