const express = require('express');
const app = express();
const mongoose = require('mongoose'); 
const path = require("path"); 
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); // essi chez jo har jagah same rahega  
const ExpressError = require("./utils/ExpressError.js"); 
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
 
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { connect } = require('http2');

const MONGO_URL = "mongodb://127.0.0.1:27017/apnaghar";

//async makes a function always return a Promise
async function main(){
    await mongoose.connect(MONGO_URL);
}

// main is a Promise — and it's likely calling something asynchronous
main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate); // includes partiaal jaisa hoaga
app.use(express.static("public")); 

const sessionOptions = {
    secret : "mysupersecretcode",
    resave: false,
    saveUninitialized : true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge :  7 * 24 * 60 * 60 * 1000,
        httpOnly : true, // used for security purposes only cross scripting attack
    }
};

// basic api
app.get("/", (req,res) =>{
    res.send("Hi, I am an robot");
})

app.use(session(sessionOptions));
app.use(flash()); // pehle flash aaega phir routes aaegnge code main 

app.use(passport.initialize());
app.use(passport.session());  
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
   
app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next(); 
})

app.use("/listings", listingRouter);
// yeh jo route hai yeh parent hai aur review.js mein child but parent ko chejne ke liye 
app.use("/listings/:id/reviews", reviewRouter);
// agar hum chate hai id ke baad walla nhi id bhi jaaye toh  {mergeParams : true}
app.use("/",userRouter);

// app.all("*",(req,res,next) =>{
//     next(new ExpressError(404,"Page not Found!"));
// });

// error handling waala part woh middleware karta hai 
app.use((err,req,res,next) =>{
    let {statusCode=500, message="something went wrong"} = err;
    res.render("error.ejs",{err});
    // res.status(statusCode).send(message); 
})  

app.listen(8080,() => { 
    console.log("server started at port 8080");
})

// database connect
// error handling 
// server start karne ka kaam 
