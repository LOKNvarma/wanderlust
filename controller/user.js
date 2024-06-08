
const User = require("../models/cuser");
module.exports.renderSignupForm = async(req,res)=>{
    res.render("signup.ejs");
},
module.exports.signup = async(req,res)=>{
    try{
        let{ username , email , password } = req.body ;
        const newUser = new User({email,username}) ;
        const registerUser =  await User.register(newUser,password);
        req.login(registerUser,(err)=>{
            if(err){
                next(err);
            }
            req.flash("success","welcome to Wanderlust");
            res.redirect("/listings");
        });
       
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/singup");
     }
},
module.exports.renderLoginForm = async(req,res)=>{
    res.render("login.ejs");
},
module.exports.login =   async(req,res)=>{
    req.flash("success","Welcome back to wanderlust , you are logged in !")
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
},
module.exports.logOut = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return err ;
        }else{
            req.flash("success","logged Out !");
            res.redirect("/listings");
        }
    });
}