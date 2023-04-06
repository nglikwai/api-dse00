const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const familys = require('../controllers/familys');

const user = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground, checkLogin } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });



router.route('/')
    .get(catchAsync(familys.index))
// .post(catchAsync(campgrounds.createCampground))
// .delete(catchAsync(campgrounds.deleteCampground));

router.route('/:id')
    .get(catchAsync(familys.find))
    .patch(catchAsync(familys.update))

//     .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, user.updateUser, catchAsync(campgrounds.updateCampground))

router.route('/locations/ranks')
    .get(catchAsync(familys.locationsRanks))
// router.route('/:id/favour')
//     .get((req, res) => res.redirect(`/${req.params.id}`))
//     .put(isLoggedIn, catchAsync(user.addFavour))
//     .delete(catchAsync(user.removeFavour))



module.exports = router;