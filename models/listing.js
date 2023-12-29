const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        // type: String,
        "filename": String,
        "url": {
            type: String,
            set: (v) => v === '' ? "https://unsplash.com/photos/white-and-brown-concrete-building-under-blue-sky-during-daytime-_TPTXZd9mOo" : v,
            default: "https://unsplash.com/photos/white-and-brown-concrete-building-under-blue-sky-during-daytime-_TPTXZd9mOo",
        },
    },
    price: Number,
    location: String,
    country: String     
})

const Listing = mongoose.model("Listing", listingSchema)
module.exports = Listing