const User = require('../models/user.js');
const Booking = require('../models/booking.js');
const Listing = require('../models/listing.js');

module.exports.renderSignup = (req, res) => {
    res.render('users/signup')
}

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body
        const newUser = new User({ email, username })
        const registeredUser = await User.register(newUser, password)
        console.log(registeredUser)
        req.login(registeredUser, (err, next) => {
            if (err) {
                return next(err)
            }
            req.flash('success', 'Welcome to WanderBlitz.!')
            res.redirect('/home')
        })
        // req.flash('success', 'Welcome to WanderBlitz.!')
        // res.redirect('/listings')
    }
    catch (e) {
        req.flash('error', e.message)
        res.redirect('/signup')
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

module.exports.login = async (req, res) => {
    req.flash('success', 'Welcome back to WanderBlitz.!')
    let redirectUrl = res.locals.currUrl || "/home"
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err)
        }
        req.flash('success', 'You are Logged out.!')
        res.redirect('/home')
    })
}

module.exports.myBookings = async (req, res, next) => {
    let curUser = await User.findById(req.user._id);
    let bookings = await Booking.find({ user: curUser._id });
    let checkInDates = [];

    await Promise.all(bookings.map(async booking => {
        let inDate = new Date(booking.checkIn);
        let outDate = new Date(booking.checkOut);
        let placeId = booking.place;
        let listing = await Listing.findById(placeId);
        let totalPrice = booking.totalPrice
        // console.log(totalPrice)
        checkInDates.push({ inDate, outDate, placeId, listing, totalPrice });
    }));

    // console.log(checkInDates);
    res.render('listings/myBookings', { checkInDates });
}