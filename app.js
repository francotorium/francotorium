var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    methodOverride = require("method-override"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");
//Models
var User = require("./models/user");
var Post = require("./models/post");

mongoose.connect("mongodb://localhost/coldbrew_app");

app.use(require("express-session")({
    secret: "CLEAR",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// App Config
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());

// RESTful routes
app.get("/", function(req, res){
   res.redirect("/blog");
});

app.get("/secret",isLoggedIn, function(req, res){
  res.render("secret");
});

app.get("/register", function(req, res){
    res.render("register");
});
//handling user sign up
app.post("/register", function(req,res){
    
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

app.get("/blog", function(req,res){
    Post.find({}, function(err, blogs){
        if(err){
            console.log("ERROR!");
        } else {
            res.render("index", {blogs: blogs});
        }
        
    });
});

// NEW ROUTE
app.get("/blog/new", function(req, res){
    res.render("new");
});

// CREATE ROUTE
app.post("/blog", function(req, res){
  //create blog
  Post.create(req.body.blog, function(err, newBlog){
      if(err){
          res.render("new");
      } else {
          res.redirect("/blog");
      }
  });
  //then, redirect to the index
});

app.get("/blog/:id", function(req, res){
    Post.findById(req.params.id, function(err,foundBlog){
        if(err){
            res.redirect("/blog");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

//EDIT Route

app.get("/blog/:id/edit", function(req,res){
    Post.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blog");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});

app.put("/blog/:id", function(req, res){
    Post.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blog");
        } else {
            res.redirect("/blog/"+req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete("/blog/:id", function(req, res){
    Post.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blog");
        } else {
            res.redirect("/blog");
        }
    });
});


//LOGIN ROUTES
app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login",passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res){
    console.log(req);
}); 

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
   if(req.isAuthenticated()){
       return next();
   }
   res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SERVER IS RUNNING!");
});