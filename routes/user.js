const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { setOriginalUrl } = require("../middleware");
const {
  signup,
  signupForm,
  loginForm,
  logout,
  login,
} = require("../controllers/user");
const router = express.Router();

router
  .route("/signup")
  .get(signupForm) // signup form route
  .post(wrapAsync(signup)); // signup route

router
  .route("/login")
  .get(loginForm) // login form route
  .post(
    setOriginalUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    login
  ); // login route

// logout route
router.get("/logout", logout);

module.exports = router;