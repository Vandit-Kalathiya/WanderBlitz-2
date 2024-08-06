const Listing = require("../models/listing")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings })
}

module.exports.newForm = (req, res) => {
    // console.log(req.user);user is stored into req and then req.isAuth fun works.!
    res.render('listings/new')
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner")
    if (!listing) {
        req.flash('error', 'Listing you requested does not exist.!')
        res.redirect('/listings')
    }
    // console.log(listing)
    res.render("listings/show.ejs", { listing })
}

module.exports.createListing = async (req, res, next) => {
    // let {title,description,price,country,location} = req.body
    // if (!req.body.listing) {
    //     throw new ExpressError(400, "Send valid data for listing.!")
    // }
    // let result = listingSchema.validate(req.body)
    // console.log(result)
    // if(result.error){
    //     throw new ExpressError(404,result.error)
    // }because validateListing is present here

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send()
    // console.log(response.body.features[0].geometry)
    // res.send("Done!")

    let url = req.file.path
    let filename = req.file.filename
    let newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id
    newListing.image = { url, filename }
    console.log(req.body.features)
    newListing.geometry = response.body.features[0].geometry
    let saved = await newListing.save();
    console.log(saved)
    req.flash('success', 'New Listing Created.!')
    res.redirect("/listings")
}

module.exports.editListing = async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id)
    if (!listing) {
        req.flash('error', 'Listing you requested does not exist.!')
        res.redirect('/listings')
    }

    let originalImageUrl = listing.image.url
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250")
    res.render("listings/edit", { listing, originalImageUrl })
}

module.exports.updateListing = async (req, res) => {
    // if (!req.body.listing) {
    //     throw new ExpressError(400, "Send valid data for listing.!")
    // }because validateListing is present here
    let { id } = req.params
    // let listing = await Listing.findById(id)
    // if(!listing.owner._id.equals(res.locals.currUser.id)) {
    //     req.flash('error', 'You are not the owner of this listing.!')
    //     res.redirect(`/listings/${id}`)
    //     return;
    // }
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing })

    let response = await geocodingClient.forwardGeocode({
        query: listing.location,
        limit: 1
    }).send()
    // console.log(response.body.features[0].geometry)
    listing.geometry = response.body.features[0].geometry

    if (req.file) {
        let url = req.file.path
        let filename = req.file.filename
        listing.image = { url, filename }
    }
    await listing.save();
    req.flash('success', 'Listing Updated.!')
    res.redirect(`/listings/${id}`)
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params
    let delListing = await Listing.findByIdAndDelete(id)
    console.log(delListing)
    req.flash('success', 'Listing Deleted.!')
    res.redirect("/listings")
}