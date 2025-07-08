const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async(req,res) => {
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
};
 
module.exports.destroyReview = async (req,res)=>{
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
}
