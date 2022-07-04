const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const Cutoff = require('../models/cutoff');
const cutoffs = require('../controllers/cutoffs');

const { findById } = require('../models/user');


router.get('/', async (req, res) => {
    const category = req.query.category || '主科';
    const cutoffs = await Cutoff.find({ category })
    res.json({ cutoffs })
})




module.exports = router;