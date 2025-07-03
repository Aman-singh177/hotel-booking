const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); 
const {listingSchema, reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");

// ab isko hum as middleware pass kar skte hai 
const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

// Index Route
router.get("/", async (req,res) => {
    const allListings = await Listing.find({});
    // This fetches all data (all listings) from the Listing collection in MongoDB.
    // Listing.find({}) means "find everything".
    // The result is saved in the variable allListings.
    res.render("listings/index.ejs",{allListings});
    //This tells Express to render the EJS file: views/listings/index.ejs
    //The second argument { allListings } sends the data to the EJS file.
});

// New route // isko isliye show route ke upar likha hai kyuki show route
//  walaa function isme new ko id samaj raha hai basically id ko dartabse mein 
// search liya jaa raha haia aur woh mil nhi rahi hai ishiliye new route ko show se upar rakha hai 
router.get("/new", isLoggedIn, (req,res) =>{
    res.render("listings/new.ejs");
})

// show route 
router.get("/:id", wrapAsync(async (req,res) =>{
    // req.params is an object that contains the route parameters — the values 
    // captured from the URL when using route parameters like :id.
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing you requested for does not exists!");
        res.redirect("/listings"); 
    }
    res.render("listings/show.ejs",{listing});
}))

// Create route
// app.post("/listings", async (req,res,next) =>{
//     //let {title, description,image,price,country,location} = req.body;
//     // ek aur tarika yeh hai ki jo saare variable hai new.ejs 
//     // ke andar inhe object ka field bana de obkjct ki key bana de
//     // ab tarika lkhne ka chota hoga
//     try{
//         let listing = req.body.listing;
//         let newListing = new Listing(listing);
//         await newListing.save();
//         res.redirect("/listings");
//     }catch(err){
//         next(err);
//     }
// })

router.post("/", isLoggedIn, validateListing ,wrapAsync(async (req,res,next) =>{ 
    // client ki galti se server pe error aaya means ushne sahi se data nhi bheja
    // if(!req.body.listing){ // yeh dekh raha hai lisiting aaya ki nhi pyr uske andr sabhai ya nhi  woh nhi dekh raha 
    //     throw new ExpressError(400,"send valid data for listing");
    // }
    //validation work for schema joy tool kar deta hai in easier format har kisi ke liye check kar raha hai 
    //not yeh sab server side se postamn se bhejne pe hoga means yeh mein bhej 
    // raha hoon aur khudh ke liye dekh raha hoon 
    // let result = listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400,result.error);
    // } 
    let listing = req.body.listing;
    let newListing = new Listing(listing);
    await newListing.save();
    req.flash("success","New Listing Added!");
    res.redirect("/listings");
}))

// edit route
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req,res) => {
    // :id means → "this part of the URL is dynamic"
    // It's like a placeholder for any actual ID value.
    // Let’s say you have 3 listings in the database with these MongoDB IDs:
    // 664a1...123    // 664a2...456
    // You want a separate edit page for each listing:
    //listings/664a1...123/edit
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exists!");
        res.redirect("/listings"); 
    }
    res.render("listings/edit.ejs",{listing});
}))

// Update route 
router.put("/:id", isLoggedIn, validateListing ,wrapAsync(async (req,res) =>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}))

// Delete Route
router.delete("/:id", wrapAsync(async (req,res) => {
    let {id} = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}));
 
module.exports = router;
