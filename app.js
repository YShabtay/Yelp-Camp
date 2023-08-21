if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const Joi = require('joi');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const ExpressError = require('./utils/ExpressErrors');
const ejsMate = require('ejs-mate'); 
const methodOverride = require('method-override');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const { error } = require('console');
const MongoStore = require('connect-mongo')(session);


const userRoutes = require('./routes/users')
// const review = require('./models/review');
const campgroundRoutes = require('./routes/campgrounds');
// const campground = require('./models/campground');
const reviewRoutes = require('./routes/reviews')

const dbUrl = process.env.DB_URL||   'mongodb://127.0.0.1:27017/yelp-camp'
// 

mongoose.connect(dbUrl)
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })


const app = express();
app.engine('ejs', ejsMate);//how to start it on the app
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(mongoSanitize({
    replaceWith: '_',
}));


app.use(express.static(path.join(__dirname, 'public')))

const secret = process.env.SECRET || 'holax'

const store = new MongoStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log('STORE ERROR', e)
})



const sessionConfig = {
    store,
    name: 'session',
    secret, 
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }

}

app.use(session(sessionConfig))
app.use(flash());
app.use(helmet(/* { contentSecurityPolicy: false  } */));

const scriptSrcUrls = [
   "https://stackpath.bootstrapcdn.com/",
   "https://api.tiles.mapbox.com/",
   "https://api.mapbox.com/",
   "https://kit.fontawesome.com/",
   "https://cdnjs.cloudflare.com/",
   "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
     "https://cdn.jsdelivr.net/",
   "https://kit-free.fontawesome.com/",
   "https://stackpath.bootstrapcdn.com/",
   "https://api.mapbox.com/",
   "https://api.tiles.mapbox.com/",
   "https://fonts.googleapis.com/",
   "https://use.fontawesome.com/",
];
const connectSrcUrls = [
   "https://api.mapbox.com/",
   "https://a.tiles.mapbox.com/",
   "https://b.tiles.mapbox.com/",
   "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
   helmet.contentSecurityPolicy({
       directives: {
           defaultSrc: [],
           connectSrc: ["'self'", ...connectSrcUrls],
           scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
           styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
           workerSrc: ["'self'", "blob:"],
           objectSrc: [],
           imgSrc: [
               "'self'",
               "blob:",
               "data:",
               "https://res.cloudinary.com/dfmrhqoxw/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
               "https://images.unsplash.com/",
           ],
           fontSrc: ["'self'", ...fontSrcUrls],
       },
   })
);

app.use(passport.session());
app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()) // שורת קוד שבעצם אומרת כיצד לאחסן במספר סידורי את המשתמשים בסשן
passport.deserializeUser(User.deserializeUser()) // השורת הקוד הפוכה אומרת בעצם כיצד לא לסדר אותם מחוץ לסשן

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes)


app.get('/', (req, res) => {
    res.render('home')
});








app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`CONNECTION TO ${port}`)
})
