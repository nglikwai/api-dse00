const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const user = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground, checkLogin } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Campground = require('../models/campground');
const Review = require('../models/review');

router.route('/')
    .get(user.updateUser, catchAsync(campgrounds.index))
    .post(upload.array('image'), validateCampground, user.updateUser, checkLogin, catchAsync(campgrounds.createCampground))

router.route('/reply/:id')
    .get(catchAsync(campgrounds.renderReply))
    .post(checkLogin, catchAsync(campgrounds.reply))

router.route('/iframe')
    .get(catchAsync(campgrounds.iframe))
    .post(upload.array('image'), validateCampground, user.updateUser, checkLogin, catchAsync(campgrounds.createCampgroundForIframe))

router.route('/search')
    .get(catchAsync(campgrounds.index))
    .post(upload.array('image'), validateCampground, user.updateUser, checkLogin, catchAsync(campgrounds.createCampground))

router.route('/iframe/:id')
    .get(catchAsync(campgrounds.showIframeCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, user.updateUser, checkLogin, catchAsync(campgrounds.updateIframeCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteIframeCampground));

router.get('/new', campgrounds.renderNewForm)

router.route('/post/:id')
    .get(user.updateUser, catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, user.updateUser, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

router.route('/:id/favour')
    .get((req, res) => res.redirect(`/${req.params.id}`))
    .put(isLoggedIn, catchAsync(user.addFavour))
    .delete(catchAsync(user.removeFavour))



module.exports = router;