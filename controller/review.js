const Review = require("../models/review");
const Listing = require("../models/listings");
module.exports.createReview = async(req,res,next)=>{
    let {id} = req.params;
    let newReview = new Review(req.body.review);
     newReview.rowner = req.user.id ;
    await newReview.save();
    let listing = await Listing.findById(id);
    listing.reviews.push(newReview);
    await listing.save();
    req.flash("success","New review created !");
    res.redirect(`/listings/${id}`);
},
module.exports.deleteReview = async(req,res)=>{
    let {id,reviewId} = req.params ;
    await Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted");
    res.redirect(`/listings/${id}`);
}