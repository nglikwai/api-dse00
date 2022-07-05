const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor, checkLogin } = require('../middleware');
const Campground = require('../models/campground');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');
const user = require('../controllers/users');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

router.post('/', catchAsync(reviews.createReview))

router.post('/iframe', validateReview, user.updateUser, checkLogin, catchAsync(reviews.createIframeReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, user.updateUser, catchAsync(reviews.deleteReview))

router.delete('/iframe/:reviewId', isLoggedIn, isReviewAuthor, user.updateUser, catchAsync(reviews.deleteIframeReview))

module.exports = router;