const express = require("express");
const router = express.Router({ mergeParams : true });
const wrapAsync = require("../utils/wrapAsync.js"); 
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

 
// Reviews --> revies ke andar post route create kar rahe hai 
// yeh async hoga kyuki hum database mein kuch store karwaenge toh woh asyncronous op. hoga 
// isloggedin ka use kiya hia jisse koi bhi na review postman se bheje 
router.post("/", isLoggedIn, validateReview , wrapAsync(async(req,res) => {
    // saath mein error handling bhi jaururi hai uske likye hamara wrapasync 
    // so jitne bhi async naye method likhenge unh sbke around wrapasync ko use kar rahe honge taki basic error hnadilng ho rahi ho
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save(); 
    req.flash("success", "New Review Created!");
    console.log("new review saved");
    res.redirect(`/listings/${listing._id}`);
}))

// Delete route for review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(async (req,res)=>{
    let {id,reviewId} = req.params;
    //Why we are doing this?  Because: You have two collections:  
    //Listing — and inside each listing document, there's an array reviews that stores the IDs of the reviews.
    //Review — where each review is stored as a separate document.
    // ish listing ke review array ke andar bhi jaakar delete karna hoga 
    await Listing.findByIdAndUpdate(id, {$pull: {reviews : reviewId}});
    //  review delete kar diya aur redirect karenge show page pe
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${id}`);
}))

module.exports = router;
