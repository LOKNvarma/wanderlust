const Listing = require("../models/listings");


module.exports.index =  async(req,res,next)=>{
    const allListings = await Listing.find();
    res.render("index.ejs",{allListings});
},
module.exports.renderNewListing = (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing = async(req,res,next)=>{
    let {id} = req.params ;
    const listing = await Listing.findById(id).populate("owner")
    .populate({path :"reviews",populate :{ path : "rowner", }});
    if(!listing){
      req.flash("error"," Listing you requested for ; Does not Exist !");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
},
module.exports.createListing = async(req,res,next)=>{
    
    let url = req.file.path ;
    let filename = req.file.filename ;    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user.id ;
    newListing.image = { url,filename }
    await newListing.save();
 
    req.flash("success","New listing created !");
    res.redirect("/listings");
},
module.exports.editListing = async(req,res,next)=>{
    let {id} = req.params ; 
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error"," Listing you requested for ; Does not Exist !");
      res.redirect("/listings");
    };
    let originalImageUrl ;
    if(typeof listing.image.url !== "undefined"){
         originalImageUrl = listing.image.url 
        originalImageUrl = originalImageUrl.replace("/upload","/upload/ar_1.0,c_fill,h_250/bo_5px_solid_lightblue")
    }
 
    res.render("listings/edit.ejs",{listing,originalImageUrl});
},
module.exports.updateListing = async(req,res,next)=>{
    let {id} = req.params ;
    let listing =  await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;  
        listing.image = { url,filename },
        await listing.save();
    }    
    req.flash("success","listing updated !");
    return res.redirect(`/listings/${id}`);  
},
module.exports.deleteListing = async(req,res,next)=>{
    let {id}= req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted");
    res.redirect("/listings");
}
