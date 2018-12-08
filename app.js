const express = require('express'),
      bodyParser = require('body-parser'),
      app = express(),
      mongoose = require('mongoose'),
      passport = require('passport'),
      localStrategy = require('passport-local'),
      seedDB = require('./seeds'),
      User = require('./models/user'),
      commentRoutes = require('./routes/comments');
      campgroundRoutes = require('./routes/campgrounds'),
      indexRoutes = require('./routes/index');

mongoose.connect('mongodb://localhost/yelpCamp',{useNewUrlParser:true})
.then(()=>{
    console.log('Connected to mongoDB')
})
.catch(()=>{
    console.log('error connecting to DB');
});

app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"))
// seedDB();
app.use(bodyParser.urlencoded({extended:true}));

//passport config
app.use(require('express-session')({
    secret:'Eat banana',
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use('/', indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);

app.listen(3000, ()=>{
    console.log('server started on port 3000');
});