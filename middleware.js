const Listing = require("./models/Listing");
const Review = require("./models/Review");
const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require("./ExpressError.js");


module.exports.validateListing = (req, res, next) => {
  const result = listingSchema.validate(req.body);
  console.log(result)
  if (result.error) {
    return next(new ExpressError(404, result.error));
  } else {
    next();
  }
};


module.exports.validateReview = (req, res, next) => {
  const result = reviewSchema.validate(req.body.review);
  if (result.error) {
    next(new ExpressError(404, result.error));
  } else {
    next();
  }
}



module.exports.isLoggin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.originalUrl = req.originalUrl;
    req.flash("flashErrorMessage", "Please log in first to continue");
    return res.redirect("/login");
  }
  next();
}

module.exports.setOriginalUrl = (req, res, next) => {
  if (req.session.originalUrl) {
    res.locals.originalUrl = req.session.originalUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const list = await Listing.findById(id);
  // console.log(list);
  // console.log(req.user);
  // console.log(list.owner.id, " ", req.user._id.id);
  if (!list.owner.equals(req.user._id)) {
    req.flash("flashErrorMessage", "You must be owner of this listing to continue")
    return res.redirect(`/listings/${id}/show`);
  } 
  next();
}

module.exports.isReviewOwner = async(req, res, next) => {
  const review = await Review.findById(req.params.reviewId);
  if (!req.user._id.equals(review.owner._id)) { 
    req.flash("flashErrorMessage", "You must be owner of this listing")
    return res.redirect(`/listings/${req.params.id}/show`);
  }
  next();
}
