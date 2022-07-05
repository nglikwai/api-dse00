const Campground = require("../models/campground");
const Review = require("../models/review");
const User = require("../models/user");

module.exports.createReview = async (req, res) => {
  console.log(req.body)
  const campground = await Campground.findById(req.body.post);
  const review = new Review(req.body);
  let id = '622874ccc8ed254d82edf591';
  if (req.user) {
    id = req.user._id;
  }
  const user = await User.findById(id);
  review.author = id;
  user.reviews.push(review);
  user.coin += 3;
  await user.save();

  review.post = campground;
  campground.reviews.push(review);
  campground.popular += 1;
  await review.save();
  await campground.save();

  res.json({ success: 'true', review });
};



module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  const user = await User.findById(req.user._id);
  user.coin -= 3;
  await user.save();
  req.flash("success", "成功刪除");
  res.redirect(`/${id}`);
};
