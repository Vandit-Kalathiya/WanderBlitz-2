const express = require("express")
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { savedUrl } = require("../middleware.js");

router.get('/signup', (req, res) => {
    res.render('users/signup')
})

router.post('/signup', wrapAsync(async (req, res) => {
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
            res.redirect('/listings')
        })
        // req.flash('success', 'Welcome to WanderBlitz.!')
        // res.redirect('/listings')
    }
    catch (e) {
        req.flash('error', e.message)
        res.redirect('/signup')
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', savedUrl , passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
    req.flash('success', 'Welcome back to WanderBlitz.!')
    let redirectUrl = res.locals.currUrl || "/listings"
    res.redirect(redirectUrl)
})

router.get('/logout', (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err)
        }
        req.flash('success', 'You are Logged out.!')
        res.redirect('/listings')
    })
})


module.exports = router