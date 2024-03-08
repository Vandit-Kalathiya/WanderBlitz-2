const express = require("express")
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js')
// const ExpressError = require('../utils/ExpressError.js')
// const { listingSchema, reviewSchema } = require('../schema.js')
const Listing = require("../models/listing")
const Review = require("../models/reviews")
const { validateReview, isLoggedIn, isAuthor } = require("../middleware.js");
const { postReview, deleteReview } = require("../controllers/reviews.js");




//Reviews
//Post Route
router.post("/", isLoggedIn, validateReview, wrapAsync(postReview))

//Delete review Route
router.delete("/:reviewId", isLoggedIn, isAuthor, wrapAsync(deleteReview))

module.exports = router