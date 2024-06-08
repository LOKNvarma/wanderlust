const ExpressErr = require("./utils/ExpressErr.js");
const { listingSchema } = require("./Schema.js");
const Listing = require("./models/listings");
const {reviewSchema} = require("./Schema.js");
const Review = require("./models/review");
module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
      let errMsg = error.details.map((el)=>el.message).join(",");
      throw new ExpressErr(404,errMsg);
    }else{
      next();
    }
  },
module.exports.isloggedIn = (req,res,next)=>{
     if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl ;
        req.flash("error","you have to log in !");
        res.redirect("/login"); 
      }
      next();
},
module.exports.saveRedirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl
  }
  next();
},
module.exports.isOwner = async(req,res,next)=>{
  let {id} = req.params ;
  let listing = await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currentUser._id)){
    req.flash("error","you don't have permission , because you are not OWNER!");
    return res.redirect(`/listings/${id}`);
  }
  next();
},
module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
 
      let errMsg = error.details.map((el)=>el.message).join(",");
      throw new ExpressErr(404,errMsg);
    }else{
      next();
    }
},
module.exports.rOwner= async(req,res,next)=>{
      let {id,reviewId} = req.params ;
      let newReview = await Review.findById(reviewId);
      if(!newReview.rowner.equals(res.locals.currentUser._id)){
       req.flash("error","you don't have permission , because you are not author of this review !");
      return res.redirect(`/listings/${id}`)
      }
     next();
}


