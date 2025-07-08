const express = require("express");
const router = express.Router({ mergeParams : true });
const wrapAsync = require("../utils/wrapAsync.js"); 
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");
 
// Reviews --> revies ke andar post route create kar rahe hai 
// yeh async hoga kyuki hum database mein kuch store karwaenge toh woh asyncronous op. hoga 
// isloggedin ka use kiya hia jisse koi bhi na review postman se bheje 
router.post("/", isLoggedIn, validateReview , wrapAsync(reviewController.createReview));

// Delete route for review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
