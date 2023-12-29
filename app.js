const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Listing = require("./models/listing")
const path = require("path")
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname,"/public")))


main()
    .then(() => {
        console.log("connection successful")
    })
    .catch(err => console.log(err));hello

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.get("/", (req, res) => {
    res.send('hi i am root')
})

//Index Route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings })
})

//New Route
app.get("/listings/new", (req, res) => {
    res.render('listings/new')
})

//Show Route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    res.render("listings/show.ejs", { listing })
})

//Create Route
app.post("/listings", async (req, res) => {
    // let {title,description,price,country,location} = req.body
    let newListing = new Listing(req.body.listing)
    newListing.save();
    res.redirect("/listings")
})

//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id)
    res.render("listings/edit", { listing })
})

//Update Route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params
    await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    res.redirect(`/listings/${id}`)
})

app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params
    let delListing = await Listing.findByIdAndDelete(id)
    console.log(delListing)
    res.redirect("/listings")
})

app.listen(8080, () => {
    console.log('server is listening on port 8080')
})

// app.get("/listing",(req,res)=>{
//     let list = new Listing({
//         title:"My new villa",
//         description:"by the beach",
//         price:12000,
//         location:"Calangute, Goa",
//         country:"India"
//     })
//     list.save()
//     console.log('listing saved')
//     res.send('successful')
// })
// const list = Listing.findById("657bf6e746acaa939191d8c7")
// console.log(list)