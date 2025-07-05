const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : String,
    image: {
        filename: String,
        url: String
    },
    // image : {
    //     type : String,
    //     default : "https://plus.unsplash.com/premium_photo-1683910767532-3a25b821f7ae?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZnJlZSUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D",
    //     set : (v) => v ==="" ? "https://plus.unsplash.com/premium_photo-1683910767532-3a25b821f7ae?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZnJlZSUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D"
    //        : v,
    // },
    price : Number,
    location : String,
    country : String,
    reviews: [
        { 
            type: Schema.Types.ObjectId,
            ref : "Review", // jo hamara review model hai woh iske like refrence banega  
        }
    ],
    owner: { // listing ka owner platform pe ek registered user bhi hona chahiye
        type : Schema.Types.ObjectId,
        ref : "User",
    },
});


listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
