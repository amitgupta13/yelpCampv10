const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
// localStrategy = require('passport-local'),
// passport.use(new localStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

router.get('/', function(req, res){
    res.render('landing');
});


router.get('/register', function(req, res){
    res.render('register');
});

//hander sign up logic
router.post('/register', function(req, res){
    const newUser = new User({username:req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/campgrounds');
        });
    });
});

//show login form
router.get('/login', function(req,res){
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect:'/campgrounds',
    failureRedirect:'/login'
}), function(req,res){
});

//logout
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;