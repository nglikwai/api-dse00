const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
  isAdmin,
} = require("../middleware");
const Campground = require("../models/campground");
const Review = require("../models/review");
const User = require("../models/user");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const admins = require("../controllers/admins");

router.get("/", isLoggedIn, isAdmin, admins.seeall);

router.get("/activity", isLoggedIn, isAdmin, admins.activity);

router.get("/refresh", admins.refreshAll);

router.post("/token", admins.saveToken);

router.put("/:id", isAdmin, admins.setAdmin);

module.exports = router;
