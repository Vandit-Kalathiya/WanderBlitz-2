const express = require("express")
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js')
const { isLoggedIn, validateBooking } = require('../middleware.js')
const { bookListing, bookingConfirmation, confirmBooking, makePayment } = require("../controllers/booking.js")

router.get('/:id/checkout', isLoggedIn, wrapAsync(bookListing))
router.post('/:id/checkout/book', isLoggedIn, wrapAsync(bookingConfirmation))
router.post('/:id/checkout/booked', isLoggedIn, wrapAsync(confirmBooking))
router.get('/:id/checkout/book/payment', isLoggedIn, wrapAsync(makePayment))

module.exports = router;
