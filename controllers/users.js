const User = require('../models/user.js');

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
            res.redirect('/listings')
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
    let redirectUrl = res.locals.currUrl || "/listings"
    res.redirect(redirectUrl)
}

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err)
        }
        req.flash('success', 'You are Logged out.!')
        res.redirect('/listings')
    })
}