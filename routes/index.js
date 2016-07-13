var express = require("express");
var router = express.Router();
var User = require("../models/user")
var passport = require("passport");

// RESTful routes
router.get("/", function(req, res){
   res.redirect("/blog");
});

router.get("/secret",isLoggedIn, function(req, res){
  res.render("secret");
});

router.get("/register", function(req, res){
    res.render("register");
});
//handling user sign up
router.post("/register", function(req,res){
    
    var newUser = new User({username: req.body.username, email: req.body.email});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/secret");
        });
    });
});

//LOGIN ROUTES
router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login",passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res){
    console.log(req);
}); 

router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
   if(req.isAuthenticated()){
       return next();
   }
   res.redirect("/login");
}

module.exports = router;