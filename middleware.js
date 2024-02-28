module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.currUrl = req.originalUrl
        req.flash('error', 'You have to Login to create listing.!')
        return res.redirect('/login')
    }
    next();
}

module.exports.savedUrl = (req, res, next) => {
    if (req.session.currUrl) {
        res.locals.currUrl = req.session.currUrl
    }
    next();
}