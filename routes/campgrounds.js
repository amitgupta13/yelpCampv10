const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');

router.get('/', function(req, res){
    Campground.find({},function(err, campgrounds){
        if(err) return console.log(err);
        res.render('campgrounds/index', {campgrounds:campgrounds});
    });
});

router.post('/', isLoggedIn, function(req, res){
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;
    const author = {
        id:req.user._id,
        username:req.user.username
    }
    const newCampground = {
                name:name,
                image:image,
                description:description,
                author:author
            }

        Campground.create(newCampground,(err, campground)=>{
            if(err) return console.log(err);
                res.redirect('/campgrounds');
        });
});

router.get('/new', isLoggedIn, function(req, res){
    res.render('campgrounds/new');
});

//Show - show more info about one campground
router.get('/:id', function(req, res){
    Campground.findById(req.params.id).populate('comments').exec(function(err, campground){
        if(err) return console.log(err);
            res.render('campgrounds/show', {campground:campground});
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;