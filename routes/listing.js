const express =   require("express");
const router  =   express.Router();
const Wrapasync  = require("../utils/asyncWrap.js");
const Listing = require("../models/listings");
const {isOwner,isloggedIn,validateListing} = require("../middleware.js");
const listingController = require("../controller/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


 router
  .route("/")
  .get( Wrapasync(listingController.index)) // index route
  .post(             // create route
    isloggedIn,
    upload.single('listing[image]'),
    validateListing ,
    Wrapasync( listingController.createListing)
  )

// New route
router.get("/new",isloggedIn,listingController.renderNewListing);

router 
   .route("/:id")
   .get(Wrapasync( listingController.showListing))       // show route
   .delete(        // delete route
     isloggedIn,
     isOwner,
     Wrapasync(listingController.deleteListing)
   )
// edit route
router.get("/:id/edit",
isloggedIn,
isOwner,
upload.single('listing[image]'),
Wrapasync(listingController.editListing));
// update route 
router.put("/:id/update",
isloggedIn, 
isOwner, 
upload.single('listing[image]'),
Wrapasync( listingController.updateListing));

 module.exports = router  ;
