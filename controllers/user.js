const User = require("../models/user"); 


module.exports.renderSignupForm = (req,res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async (req,res) => {
    try{
        let { username,email,password } = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        // for auto llogin 
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success","Welcome to ApnaRoom");
            res.redirect("/listings");
        })
    }catch(err){
        req.flash("Error", err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req,res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req,res) => {
    req.flash("Welcome to ApnaRoom, You logged in sucessfully!");
    // redirectUrl key humne store kari hogi toh passport ishe delete kar dega
    // yaha access karenge toh empty undefined value aaegi
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res, next) => {
    // req.logout method ye apne aap ko leta hai as a parameter
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
}
