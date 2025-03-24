const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { isLoggin, validateReview, isReviewOwner } = require("../middleware");
const { createReview, destroyReview } = require("../controllers/reviews");

// create review route
router.post("/", isLoggin, validateReview, wrapAsync(createReview));

// destroy review route
router.delete("/:reviewId", isLoggin, isReviewOwner, wrapAsync(destroyReview));

module.exports = router;