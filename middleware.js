const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');
const User = require('./models/user');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/users/login');
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    console.log(req.body.campground)
    const { error } = campgroundSchema.validate(req.body);
    if (req.body.campground.description.includes('http', 'king ho') || req.body.title.includes('king ho')) {
        return res.redirect('/users/login');
    }
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        if (req.user.identity == 'admin') {
            return next()
        }
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/${id}`);
    }
    next();
}

module.exports.isAdmin = async (req, res, next) => {
    if (req.user.identity !== 'admin') {
        req.flash('error', 'ADMIN ONLY')
        return res.redirect(`/`);
    }
    next();
}

module.exports.checkLogin = async (req, res, next) => {
    if (!req.user) {
        req.flash("success", "登入DSE00以保存積分 ");
        return next()
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        if (req.user.identity == 'admin') {
            return next()
        }
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}