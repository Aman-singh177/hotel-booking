const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");

router.get("/signup", (req,res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync( async (req,res) => {
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
}))
 
router.get("/login", (req,res) => {
    res.render("users/login.ejs");
});

router.post("/login", 
    passport.authenticate("local",{
        failureRedirect: "/login",
        failureFlash: true,
    }),
    async (req,res) => {
        res.send("Welcome to ApnaRoom, You logged in sucessfully!");
    }
);

router.get("/logout", (req,res, next) =>{
    // req.logout method ye apne aap ko leta hai as a parameter
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
})

module.exports = router;
