const Listing = require("../models/listing");

module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
    // This fetches all data (all listings) from the Listing collection in MongoDB.
    // Listing.find({}) means "find everything".
    // The result is saved in the variable allListings.
    res.render("listings/index.ejs",{allListings});
    //This tells Express to render the EJS file: views/listings/index.ejs
    //The second argument { allListings } sends the data to the EJS file.
};

module.exports.renderNewForm = (req,res) =>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req,res) =>{
    // req.params is an object that contains the route parameters — the values 
    // captured from the URL when using route parameters like :id.
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({path : "reviews", populate : {path : "author",},})
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exists!");
        res.redirect("/listings"); 
    } 
    res.render("listings/show.ejs",{listing});
}

module.exports.createListing = async (req,res,next) =>{ 
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
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url,"....",filename);
    let listing = req.body.listing;
    let newListing = new Listing(listing);
    // owner mein current user ki information save karna hai ab user ki info kaise save 
    // kare ab hume pata hai ki jo request object hai usme passport by default user related
    // information save karata hai kaha store karwata hai req.user._id ke andar.
    newListing.owner = req.user._id; 
    newListing.image = {filename,url};
    await newListing.save();
    req.flash("success","New Listing Added!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req,res) => {
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
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{listing , originalImageUrl});
};

module.exports.updateListing = async (req,res) =>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url , filename};
        await listing.save();
    }
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req,res) => {
    let {id} = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};

