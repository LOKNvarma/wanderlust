const express = require('express');
const router = express.Router({mergeParams : true});
const Wrapasync = require("../utils/asyncWrap.js");
const Review = require("../models/review");
const Listing = require("../models/listings");
const { validateReview,rOwner,isloggedIn } = require('../middleware.js');
const reviewController = require("../controller/review.js")
 // review create route 
 router.post("/",
 isloggedIn,
 Wrapasync(reviewController.createReview));
// delete review ..
router.delete("/:reviewId",
isloggedIn,
rOwner ,
Wrapasync(reviewController.deleteReview));

module.exports = router ;