const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const {isLogin, validateCampground,isAuthor} = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer  = require('multer');
const {storage} = require('../cloudinary/index');
const upload = multer({ storage });

router.route('/')
.get( catchAsync(campgrounds.index))
.post( isLogin ,  upload.array('image') , validateCampground, catchAsync(campgrounds.createCampground))







router.get('/new', isLogin,campgrounds.renderNewForm);


router.route('/:id')

.get( catchAsync(campgrounds.showCampground))
.put( isLogin ,isAuthor,upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
.delete( isLogin, isAuthor, catchAsync(campgrounds.deleteCampground))




router.get('/:id/edit', isLogin, isAuthor, catchAsync(campgrounds.renderEditForm))






module.exports = router;