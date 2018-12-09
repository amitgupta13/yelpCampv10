const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const middleware = require('../middleware');

router.get('/', function(req, res){
    Campground.find({},function(err, campgrounds){
        if(err) return console.log(err);
        res.render('campgrounds/index', {campgrounds:campgrounds});
    });
});

router.post('/', middleware.isLoggedIn, function(req, res){
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

router.get('/new', middleware.isLoggedIn, function(req, res){
    res.render('campgrounds/new');
});

//Show - show more info about one campground
router.get('/:id', function(req, res){
    Campground.findById(req.params.id).populate('comments').exec(function(err, campground){
        if(err) return console.log(err);
            res.render('campgrounds/show', {campground:campground});
    });
});

//Edit Route
router.get('/:id/edit', middleware.campAuth, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            return res.redirect('/campgrounds');
        }else{
            res.render('campgrounds/edit', {campground:campground});
        }
    });
});

//Update Route
router.put('/:id', middleware.campAuth, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
        if(err){
            res.redirect('/campground');
        }else{
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

//delete route
router.delete('/:id', middleware.campAuth, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err) return res.redirect('/campgrounds');
            return res.redirect('/campgrounds');
    });
});

// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect('/login');
// }

// function auth(req, res, next){
//     if(req.isAuthenticated()){
//         Campground.findById(req.params.id, function(err, campground){
//             if(err) return res.redirect('back');
//                 if(campground.author.id.equals(req.user._id)){
//                     next()
//                 }else{
//                     res.redirect('back');
//                 }
//         });
//     }else{
//         res.redirect('back');
//     }
// }

module.exports = router;