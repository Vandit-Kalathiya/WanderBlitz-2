const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    place: { type: Schema.Types.ObjectId, ref: "Listing", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    noOfGuests: { type: Number, required: true },
    name: { type: String, required: true },
    phone: { type: Number, required: true },
    totalPrice: Number,
})



module.exports = mongoose.model('Booking', bookingSchema)