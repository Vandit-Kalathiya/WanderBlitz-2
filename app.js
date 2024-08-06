if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
// console.log(process.env.SECRET)

const express = require('express')
const app = express()
const mongoose = require('mongoose')
// const Listing = require("./models/listing")
// const Review = require("./models/reviews")
const path = require("path")
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
// const wrapAsync = require('./utils/wrapAsync.js')
const ExpressError = require('./utils/ExpressError.js')
// const { listingSchema, reviewSchema } = require('./schema.js')

const listingRouter = require('./routes/listing.js')
const reviewrouter = require('./routes/reviews.js')
const userRouter = require('./routes/user.js')

const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user.js');
const { Module } = require('module');

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, "/public")))

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.use(session(sessionOptions))
app.use(flash())//Make sure that you have used flash before all routes.


app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.currUser = req.user
    next();
})

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust'

main()
    .then(() => {
        console.log("connection successful")
    })
    .catch(err => console.log(err))

async function main() {
    await mongoose.connect(MONGO_URL)

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.get("/", (req, res) => {
    // res.send('hi i am root')
    res.render("listings/render");
})

// app.get('/userDemo', async (req, res) => {
//     let fake = new User({
//         email: 'abc@gmail.com',
//         username: "delta1"
//     })

//     let fakeUser = await User.register(fake, 'helloStudent')
//     res.send(fakeUser)
// })

app.use("/listings", listingRouter)
app.use('/listings/:id/reviews', reviewrouter)
app.use('/', userRouter)


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found.!"))
})

app.use((err, req, res, next) => {
    // res.send("something went wrong.!")
    let { statusCode = 500, message = "Something went wrong.!" } = err
    // res.status(statusCode).send(message)
    res.status(statusCode).render("listings/errors", { message })
})

app.listen(8080, () => {
    console.log('server is listening on port 8080')
})

// app.get("/listing",(req,res)=>{
//     let list = new Listing({
//         title:"My new villa",
//         description:"by the beach",
//         price:12000,
//         location:"Calangute, Goa",
//         country:"India"
//     })
//     list.save()
//     console.log('listing saved')
//     res.send('successful')
// })
// const list = Listing.findById("657bf6e746acaa939191d8c7")
// console.log(list)