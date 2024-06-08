if(process.env.NODE_ENV != "production"){
  require('dotenv').config()

}


const express = require("express");
const app = express();
const port = 8181;

const path = require("path");
const  methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressErr = require("./utils/ExpressErr.js");
const mongoose = require("mongoose");
const { linkSync } = require("fs");
// const mongodb = 'mongodb://127.0.0.1:27017/wanderlust'
const dbUrl = process.env.ATLUS_URL ;
main().then(res => console.log("connection succesfull"))
.catch(err => console.log(err));
async function main() {
  await mongoose.connect(dbUrl);
}
// authentication and authorization
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require('passport-local-mongoose');
const User = require("./models/cuser.js");
const  session = require('express-session');
const MongoStore = require('connect-mongo');

const store = MongoStore.create({
  mongoUrl :dbUrl,
  crypto :{
    secret :process.env.SECRET
  },
  touchAfter : 24 * 3600
});

store.on("error",()=>{
  console.log("ERROR IN MONGO SESSION ",err);
});
const sessionOption = {
    store,
    secret :process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie : {
      expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge : 7 * 24 * 60 * 60 * 1000 ,
      httpOnly : true,
    },
}


app.use(session(sessionOption));
const flash = require('connect-flash');
app.use(flash());
// authentication..
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);

app.listen(port,()=>{
  console.log("server is listening on port : 8181"); 
});
//  middleware
app.use((req,res,next)=>{
  // success partial 
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error"); 
  res.locals.currentUser = req.user ;
  next();
});
// listings 
const listings = require("./routes/listing.js");
app.use("/listings",listings);
// review 
 const reviews = require("./routes/review.js");
 app.use("/listings/:id/reviews" ,reviews);
// user
const user = require("./routes/user.js");
app.use("/",user);




// errors handlers...
app.all("*",(req,res,next)=>{
  next( new ExpressErr(401,"page not found"));
 });
app.use((err,req,res,next)=>{
     let  {status = 505,message = "Something went wrong!"} = err ;
     res.render("error.ejs",{err});
});

