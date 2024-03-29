const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const jupas = require('../controllers/jupas');

router.get('/', catchAsync(jupas.searchCode))

router.get('/code', catchAsync(jupas.searchCode))
router.post('/code', catchAsync(jupas.createRecord))
router.patch('/code', catchAsync(jupas.editRecord))


router.get('/gradtrip', catchAsync(jupas.gradtripReport))
router.post('/gradtrip', catchAsync(jupas.gradtrip))

router.get('/getShrine', catchAsync(jupas.getShrine))
router.get('/:id/getShrine', catchAsync(jupas.getOneShrine))

router.post('/createShrine', catchAsync(jupas.createShrine))


module.exports = router;