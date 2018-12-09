const Campground = require('../models/campground');
const Comment = require('../models/comment');

module.exports = {
    isLoggedIn:isLoggedIn,
    campAuth:campAuth,
    commentAuth:commentAuth
}

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

function campAuth(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, campground){
            if(err) return res.redirect('back');
                if(campground.author.id.equals(req.user._id)){
                    next()
                }else{
                    res.redirect('back');
                }
        });
    }else{
        res.redirect('back');
    }
}

function commentAuth(req, res, next){
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