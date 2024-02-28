const express = require("express")
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js')
const ExpressError = require('../utils/ExpressError.js')
const { listingSchema, reviewSchema } = require('../schema.js')
const Listing = require("../models/listing")
const flash = require('connect-flash')
const { isLoggedIn } = require('../middleware.js')

const validateListing = (req, res, next) => {
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



//Index Route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings })
}))

//New Route
router.get("/new", isLoggedIn, (req, res) => {
    // console.log(req.user);user is stored into req and then req.isAuth fun works.!
    res.render('listings/new')
})

//Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id).populate("reviews")
    if (!listing) {
        req.flash('error', 'Listing you requested does not exist.!')
        res.redirect('/listings')
    }
    res.render("listings/show.ejs", { listing })
}))

//Create Route
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {
    // let {title,description,price,country,location} = req.body
    // if (!req.body.listing) {
    //     throw new ExpressError(400, "Send valid data for listing.!")
    // }
    // let result = listingSchema.validate(req.body)
    // console.log(result)
    // if(result.error){
    //     throw new ExpressError(404,result.error)
    // }because validateListing is present here
    let newListing = new Listing(req.body.listing)
    // console.log(req.body.listing)
    await newListing.save();
    req.flash('success', 'New Listing Created.!')
    res.redirect("/listings")
}))

//Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id)
    if (!listing) {
        req.flash('error', 'Listing you requested does not exist.!')
        res.redirect('/listings')
    }
    res.render("listings/edit", { listing })
}))

//Update Route
router.put("/:id", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    // if (!req.body.listing) {
    //     throw new ExpressError(400, "Send valid data for listing.!")
    // }because validateListing is present here
    let { id } = req.params
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    req.flash('success', 'Listing Updated.!')
    res.redirect(`/listings/${id}`)
}))

//Listing Delete Route
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params
    let delListing = await Listing.findByIdAndDelete(id)
    console.log(delListing)
    req.flash('success', 'Listing Deleted.!')
    res.redirect("/listings")
}))

module.exports = router