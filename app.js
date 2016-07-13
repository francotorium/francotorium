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

var blogRoutes = require("./routes/blog"),
    indexRoutes = require("./routes/index");

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
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use(indexRoutes);
app.use("/blog", blogRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SERVER IS RUNNING!");
});