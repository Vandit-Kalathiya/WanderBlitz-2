const express = require("express")
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js')
const ExpressError = require('../utils/ExpressError.js')
const { listingSchema, reviewSchema } = require('../schema.js')
const Listing = require("../models/listing")
const Review = require("../models/reviews")


const validateReview = (req, res, next) => {
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


//Reviews
//Post Route
router.post("/", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id)
    let newReview = new Review(req.body.review)
    listing.reviews.push(newReview)
    await newReview.save()
    await listing.save()
    console.log("new review saved.")
    req.flash('success', 'New Review Created.!')
    res.redirect(`/listings/${listing._id}`)
}))

//Delete review Route
router.delete("/:reviewId", async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Review Deleted.!')
    res.redirect(`/listings/${id}`)
})

module.exports = router