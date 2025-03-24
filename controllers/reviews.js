const Listing = require("../models/Listing");
const Review = require("../models/Review");


// create review
module.exports.createReview = async (req, res) => {
  let review = new Review(req.body.review);
  review.owner = req.user;
  await review.save();
  const list = await Listing.findById(req.params.id);
  list.review.push(review);
  await list.save();
  req.flash("flashMessage", "Review created successfully");
  res.redirect(`/listings/${list._id}/show`);
}

// destroy review
module.exports.destroyReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId }  });
  await Review.findByIdAndDelete(reviewId);
  req.flash("flashMessage", "Review Deleted successfully");
  res.redirect(`/listings/${id}/show`);
}