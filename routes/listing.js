const express = require("express")
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js')
// const ExpressError = require('../utils/ExpressError.js')
// const { listingSchema, reviewSchema } = require('../schema.js')
// const Listing = require("../models/listing")
// const flash = require('connect-flash')
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js')
const { index, newForm, showListing, createListing, editListing, updateListing, deleteListing } = require("../controllers/listings.js")
const multer = require('multer')
const { storage } = require('../cloudConfig.js')
const upload = multer({ storage })


router.route('/')
    .get(wrapAsync(index))
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(createListing))
// .post(upload.single('listing[image]'), (req, res) => {
//     res.send(req.file)
// })

//New Route
router.get("/new", isLoggedIn, newForm)

router.route('/:id')
    .get(wrapAsync(showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(deleteListing))

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(editListing))

//Index Route
// router.get("/", wrapAsync(index))


//Show Route
// router.get("/:id", wrapAsync(showListing))

//Create Route
// router.post("/", isLoggedIn, validateListing, wrapAsync(createListing))


//Update Route
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(updateListing))

// Delete Route
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(deleteListing))

module.exports = router