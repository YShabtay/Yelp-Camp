const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const Review =require('../models/review');
const {validateReview, isLogin, isReviewAuthor}= require('../middleware');
const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressErrors');
const reviews = require('../controllers/reviews')

const {reviewSchema} = require('../schema');






// router.get('/:reviewId/review',validateReview, catchAsync(async(req,res)=>{
    
// }))

router.post('/',isLogin, validateReview, catchAsync(reviews.createReview))


router.delete('/:reviewId',isLogin, catchAsync(reviews.deleteReview))




module.exports = router;