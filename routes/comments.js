const express = require('express');
const router = express.Router({mergeParams:true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');

router.get('/new',isLoggedIn, function(req, res){
    Campground.findById(req.params.id, (err, campground)=>{
        if(err) return console.log(err);
            res.render('comments/new', {campground:campground});
    });
});

router.post('/', isLoggedIn, function(req, res){
    Campground.findById(req.params.id, (err, campground)=>{
        if(err){
            console.log(err);
            return res.redirect('/campgrounds');
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err) return console.log(err);
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect(`/campgrounds/${campground._id}`);
            });
        }  
                

    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;