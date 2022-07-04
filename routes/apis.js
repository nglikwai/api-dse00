const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const Yylam = require('../models/yylam');
const User = require('../models/user');
const Campground = require('../models/campground');
const Review = require('../models/review');

const { findById } = require('../models/user');

router.get('/yylam', async (req, res) => {
    const yylams = await Yylam.find();
    res.json(yylams)
})

router.get('/friendactivities', async (req, res) => {
    const id = req.user ? req.user._id : '622874ccc8ed254d82edf591';
    let friendList = ['622874ccc8ed254d82edf591', '62249a88f2e44a001678e0ef', '62246de9a1b279001669c648'];
    if (req.user) { friendList = req.user.friendList; }
    const reviews = await Review.find({ "author": friendList }).sort({ updatedAt: -1 }).limit(7).populate("author")
    res.json(reviews);
})

router.get('/getFriendList', async (req, res) => {
    const id = req.user ? req.user._id : '622874ccc8ed254d82edf591';
    const user = await User.findById(id).populate("friendList");
    res.json(user);
})


router.get('/posts', async (req, res) => {
    console.time('main')
    const limit = req.query.limit || 150;
    const page = req.query.page || 1;
    const category = req.query.category || ['吹水', 'DSE', '大學', '消息'];
    const options = {
        sort: { updatedAt: -1 },
        populate: [{
            path: 'author',
            select: 'username'
        }, "reviews"],
        limit,
        page,
    };
    const data = await Campground.paginate({ category }, options)

    const campgrounds = data.docs;
    console.timeEnd('main')
    res.json(campgrounds);
})

router.get('/popularposts', async (req, res) => {
    const today = new Date();
    const limit = req.query.limit || 6;
    const page = req.query.page || 1;
    const options = {
        sort: { popular: -1 },
        populate: ["author", "reviews"],
        limit,
        page,
    };
    const data = await Campground.paginate({ updatedAt: { $lt: today } }, options)
    const campgrounds = data.docs;
    res.json(campgrounds);
})

router.get('/user', async (req, res) => {
    const user = await User.find({ email: req.query.email });
    res.json(user)
})

module.exports = router;