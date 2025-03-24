const User = require("../models/User");


// signup form or create new user form
module.exports.signupForm = (req, res) => {
  res.render("signup.ejs");
};

// signup or create new user
module.exports.signup = async (req, res, next) => {
  try {
    const { email, username, password } = req.body.user;
    const newUser = new User({
      email,
      username,
    });
    let registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        req.flash("flashErrorMessage", err.message);
        return next(err);
      }
      req.flash("flashMessage", "You have created an account succussfully");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("flashErrorMessage", e.message);
    res.redirect("/signup");
  }
};

// login user form
module.exports.loginForm = (req, res) => {
  res.render("login.ejs");
};

// login user or authentication
module.exports.login = (req, res) => {
  req.flash("flashMessage", "Welcome to Airbnb, login succesfull");
  let redirectPath = res.locals.originalUrl || "/listings";
  if (redirectPath.includes("?_method")) {
    redirectPath = redirectPath.split("?_method")[0] + "/show";
  }
  if (redirectPath.includes("reviews")) {
    redirectPath = redirectPath.replace("reviews", "show");
  }
  res.redirect(redirectPath);
};

// logout user
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("flashMessage", "You logged out successfully");
    res.redirect("/listings");
  });
};