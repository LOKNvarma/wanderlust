const express =   require("express");
const User = require("../models/cuser");
const router = express.Router({mergeParams : true});
const Wrapasync  = require("../utils/asyncWrap.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controller/user.js");
const { route } = require("./listing.js");

router
  .route("/singup")
  .get(userController.renderSignupForm)
  .post(Wrapasync(userController.signup))
  
// router.get("/singup",userController.renderSignupForm);
// router.post("/singup",Wrapasync(userController.signup));

router  
 .route("/login")
 .get(userController.renderLoginForm)
 .post(
    saveRedirectUrl,
    passport.authenticate('local', { failureRedirect: '/login',failureFlash:true }),
    userController.login
 )

// router.get("/login",userController.renderLoginForm);
// router.post("/login",
//          saveRedirectUrl,
//          passport.authenticate('local', { failureRedirect: '/login',failureFlash:true }),
//          userController.login
// );
router.get("/logout",userController.logOut);

module.exports = router ;