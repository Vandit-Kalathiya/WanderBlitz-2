const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Listing = require("./models/listing")
const Review = require("./models/reviews")
const path = require("path")
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const wrapAsync = require('./utils/wrapAsync.js')
const ExpressError = require('./utils/ExpressError.js')
const { listingSchema, reviewSchema } = require('./schema.js')
const listings = require('./routes/listing.js')
const reviews = require('./routes/reviews.js')


app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, "/public")))


main()
    .then(() => {
        console.log("connection successful")
    })
    .catch(err => console.log(err))

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

app.get("/", (req, res) => {
    // res.send('hi i am root')
    res.render("listings/render")
})



// let temp = Listing.findById('659917a48a21aebc9dfb0417')
// console.log(temp)



app.use("/listings", listings)
app.use('/listings/:id/reviews',reviews)


app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found.!"))
})

app.use((err, req, res, next) => {
    // res.send("something went wrong.!")
    let { statusCode = 500, message = "Something went wrong.!" } = err
    // res.status(statusCode).send(message)
    res.status(statusCode).render("listings/errors", { message })
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