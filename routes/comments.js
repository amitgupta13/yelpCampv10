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

router.get('/:commentId/edit', auth, function(req, res){
    Comment.findById(req.params.commentId, function(err, comment){
        if(err) return redirect('back');
         res.render('comments/edit',{campgroundId:req.params.id, comment:comment});
    });
    
});

router.put('/:commentId', auth, function(req, res){
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, comment){
        if(err) return res.redirect('back');
            res.redirect(`/campgrounds/${req.params.id}`);
    });
});

router.delete('/:commentId', auth, function(req, res){
    Comment.findByIdAndRemove(req.params.commentId, function(err){
        if(err) return res.redirect('back');
            return res.redirect(`/campgrounds/${req.params.id}`);
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

function auth(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentId, function(err, comment){
            if(err) return res.redirect('back');
                if(comment.author.id.equals(req.user._id)){
                    next()
                }else{
                    res.redirect('back');
                }
        });
    }else{
        res.redirect('back');
    }
}

module.exports = router;