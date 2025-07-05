module.exports.isLoggedIn = (req,res,next) => { 
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("Error","You must be logged in to create listings!");
        return res.redirect("/login");
    }
    next();
};
 
// toh user.js mein save karane ke liye redirectUrl key ko toh hum locals mein daal
// denge kyuki waha se delete nhi hogi pyr login pe hit karte hi 
// passport se delte ho jaaegi

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

