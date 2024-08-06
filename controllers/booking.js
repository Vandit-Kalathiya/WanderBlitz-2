const Listing = require("../models/listing")
const Booking = require("../models/booking")
const User = require("../models/user")
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;

function dateDiffInDays(date1, date2) {
    // Convert both dates to milliseconds

    var date11 = new Date(date1);
    var date22 = new Date(date2);

    var date1_ms = date11.getTime();
    var date2_ms = date22.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;

    // Convert the difference to days
    return Math.floor(difference_ms / (1000 * 60 * 60 * 24));
}


module.exports.bookListing = async (req, res) => {
    // console.log(req)
    let { id } = req.params
    // console.log(id)
    res.render('listings/booking', { id })
}

module.exports.bookingConfirmation = async (req, res) => {
    let { id } = req.params
    // console.log(id)
    const listing = await Listing.findById(id)
    // console.log(totalPrice)
    let checkInDate = req.body.checkInDate
    let checkOutDate = req.body.checkOutDate
    let checkInDate1 = new Date(checkInDate);
    let checkOutDate1 = new Date(checkOutDate);
    let noOfGuests = req.body.guests

    for (const id1 of listing.bookings) {
        let booking = await Booking.findById(id1);
        const checkIn = new Date(booking.checkIn).getDate();
        const checkOut = new Date(booking.checkOut).getDate();
        if (
            (checkIn >= checkInDate1.getDate() && checkIn <= checkOutDate1.getDate()) ||
            (checkOut >= checkInDate1.getDate() && checkOut <= checkOutDate1.getDate()) ||
            (checkIn <= checkInDate1.getDate() && checkOut >= checkOutDate1.getDate())
        ) {
            req.flash('error', 'Sorry, this place is already booked in your time.!');
            return res.redirect(`/listings/${id}`);
        }
    }

    let totalPrice = listing.price * dateDiffInDays(checkInDate, checkOutDate)
    res.render('listings/finalBooking', { id, totalPrice, checkInDate, checkOutDate, noOfGuests })
}

module.exports.confirmBooking = async (req, res) => {
    let { id } = req.params;
    let { checkInDate, checkOutDate } = req.body;
    let checkInDate1 = new Date(checkInDate);
    let checkOutDate1 = new Date(checkOutDate);
    let listing = await Listing.findById(id);
    let curUser = await User.findById(req.user._id);
    let newBooking = new Booking();
    newBooking.place = id;
    newBooking.user = req.user._id;
    newBooking.checkIn = checkInDate1;
    newBooking.checkOut = checkOutDate1;
    newBooking.noOfGuests = req.body.guests;
    newBooking.name = req.body.name;
    newBooking.phone = req.body.phoneno ;
    newBooking.totalPrice = req.body.totalPrice;
    listing.bookings.push(newBooking);
    curUser.bookings.push(newBooking);
    await newBooking.save();
    await listing.save();
    await curUser.save();
    req.flash('success', 'Your Booking place is reserved.!');
    res.redirect(`/listings/${listing._id}`);
}

module.exports.makePayment = async (req, res) => {

}