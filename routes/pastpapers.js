const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const Pastpaper = require('../models/pastpaper');
const users = require('../controllers/users');
const pastpapers = require('../controllers/pastpapers');
const { findById } = require('../models/user');


router.get('/', async (req, res) => {
    const pastpapers = await Pastpaper.find({ lang: 'EN' });
    res.json(pastpapers);
})

router.get('/ZH', async (req, res) => {
    const pastpapers = await Pastpaper.find({ lang: 'ZH' });
    res.json(pastpapers);
})

router.get('/:title', async (req, res) => {
    const { title } = req.params;
    const pastpapers = await Pastpaper.find({ title })
    const pastpaper = pastpapers[0]
    res.json(pastpapers);
})


module.exports = router;