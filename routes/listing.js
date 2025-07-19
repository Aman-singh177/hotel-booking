const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); 
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const multer  = require('multer');
// const upload = multer({ dest: 'uploads/' });
const {storage} = require("../cloudConfig.js");
const upload = multer({storage})
const listingController = require("../controllers/listing.js");


// New route // isko isliye show route ke upar likha hai kyuki show route
//  walaa function isme new ko id samaj raha hai basically id ko dartabse mein 
// search liya jaa raha haia aur woh mil nhi rahi hai ishiliye new route ko show se upar rakha hai 
router.get("/new", isLoggedIn,  listingController.renderNewForm);

// we can perform Router.route for same path "/" for any path
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single('listing[image][url]'),
        validateListing,
        wrapAsync(listingController.createListing)
    );
    // .post( upload.single('listing[image][url]'), (req,res) =>{
    //     res.send(req.file);
    // }) 

// iche waaley dono ki jagah yeh likha hai

// Index Route
// router.get("/",wrapAsync(listingController.index));

// // Create route
// // app.post("/listings", async (req,res,next) =>{
// //     //let {title, description,image,price,country,location} = req.body;
// //     // ek aur tarika yeh hai ki jo saare variable hai new.ejs 
// //     // ke andar inhe object ka field bana de obkjct ki key bana de
// //     // ab tarika lkhne ka chota hoga
// //     try{
// //         let listing = req.body.listing;
// //         let newListing = new Listing(listing);
// //         await newListing.save();
// //         res.redirect("/listings");
// //     }catch(err){
// //         next(err);
// //     }
// // })

// router.post("/", isLoggedIn, validateListing ,wrapAsync(listingController.createListing));


// show route 
router.get("/:id", wrapAsync( listingController.showListing));

// edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))

// Update route 
router.put("/:id", isLoggedIn, isOwner, validateListing ,wrapAsync(listingController.updateListing));

// Delete Route
router.delete("/:id", isOwner, wrapAsync(listingController.deleteListing));
 
module.exports = router;
