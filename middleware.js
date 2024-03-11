const Listing = require("./models/listing")
const ExpressError = require("./utils/ExpressError")
const Review = require("./models/reviews")
const { listingSchema, reviewSchema } = require('./schema')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.currUrl = req.originalUrl
        req.flash('error', 'You have to Login to create listing.!')
        return res.redirect('/login')
    }
    next();
}

module.exports.isLoggedInForReview = (req, res, next) => {
    let { id } = req.params
    if (!req.isAuthenticated()) {
        req.session.currUrl = `/listings/${id}`
        req.flash('error', 'You have to Login to delete review.!')
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

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params
    let listing = await Listing.findById(id)
    if (!listing.owner._id.equals(res.locals.currUser.id)) {
        req.flash('error', 'You are not the owner of this listing.!')
        res.redirect(`/listings/${id}`)
        return;
    }
    next()
}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body)
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(404, errMsg)
        // throw new ExpressError(404, error)
    }
    else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    let { reviewId, id } = req.params
    let review = await Review.findById(reviewId)
    if (!review.author._id.equals(res.locals.currUser.id)) {
        req.flash('error', 'You are not the author of this review.!')
        res.redirect(`/listings/${id}`)
        return;
    }
    next()
}

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body)
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(404, errMsg)
        // throw new ExpressError(404, error)
    }
    else {
        next();
    }
}