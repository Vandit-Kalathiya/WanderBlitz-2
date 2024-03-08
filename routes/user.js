const express = require("express")
const router = express.Router();
// const User = require('../models/user.js');
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { savedUrl } = require("../middleware.js");
const { signup, renderSignup, renderLogin, login, logout } = require("../controllers/users.js");

router.route('/signup')
    .get(renderSignup)
    .post(wrapAsync(signup))


router.route('/login')
    .get(renderLogin)
    .post(savedUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), login)

router.get('/logout', logout)

module.exports = router