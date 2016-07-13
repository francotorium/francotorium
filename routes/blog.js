var express = require("express");
var router = express.Router();
var Post   = require("../models/post");

router.get("/", function(req,res){
    Post.find({}, function(err, blogs){
        if(err){
            console.log("ERROR!");
        } else {
            res.render("index", {blogs: blogs});
        }
        
    });
});

//Create NEW ROUTE
router.get("/new",isLoggedIn, function(req, res){
    res.render("new");
});

// CREATE ROUTE
router.post("/",isLoggedIn, function(req, res){
  var title = req.body.blog.title;
  var image = req.body.blog.image;
  var body = req.body.blog.body;
  var author = {
      id: req.user._id,
      username: req.user.username
  };
  var newPost = {title: title, image: image, body: body, author: author};
  Post.create(newPost, function(err, newBlog){
      if(err){
          res.render("new");
      } else {
          res.redirect("/blog");
      }
  });
  //then, redirect to the index
});

router.get("/:id", function(req, res){
    Post.findById(req.params.id, function(err,foundBlog){
        if(err){
            res.redirect("/blog");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

//EDIT Route

router.get("/:id/edit",isLoggedIn,function(req,res){
    Post.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blog");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});

router.put("/:id",isLoggedIn, function(req, res){
    Post.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blog");
        } else {
            res.redirect("/blog/"+req.params.id);
        }
    });
});

//DELETE ROUTE
router.delete("/:id", isLoggedIn, function(req, res){
    Post.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blog");
        } else {
            res.redirect("/blog");
        }
    });
});

function isLoggedIn(req, res, next){
   if(req.isAuthenticated()){
       return next();
   }
   res.redirect("/login");
}

module.exports = router;