const express = require("express")
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js')
const ExpressError = require('../utils/ExpressError.js')
const { listingSchema, reviewSchema } = require('../schema.js')
const Listing = require("../models/listing")

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
router.get("/new", (req, res) => {
    res.render('listings/new')
})

//Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id).populate("reviews")
    res.render("listings/show.ejs", { listing })
}))

//Create Route
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
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
    res.redirect("/listings")
}))

//Edit Route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id)
    res.render("listings/edit", { listing })
}))

//Update Route
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    // if (!req.body.listing) {
    //     throw new ExpressError(400, "Send valid data for listing.!")
    // }because validateListing is present here
    let { id } = req.params
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    res.redirect(`/listings/${id}`)
}))

//Listing Delete Route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params
    let delListing = await Listing.findByIdAndDelete(id)
    console.log(delListing)
    res.redirect("/listings")
}))

module.exports = router