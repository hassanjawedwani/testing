const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggin, isOwner, validateListing } = require("../middleware");
const {
  index,
  showListing,
  createListingForm,
  createListing,
  editListing,
  updateListing,
  destroyListing,
} = require("../controllers/listings");

const multer = require('multer')
const storage = require("../cloudConfig");
const upload = multer({ storage });


router
  .route("/")
  .get(wrapAsync(index)) // index route
  .post( isLoggin, upload.single('image'), validateListing, wrapAsync(createListing)); // create listing route

// show listing route
router.get("/:id/show", wrapAsync(showListing));

// create listing form route
router.get("/new", isLoggin, createListingForm);

// edit route
router.get("/:id/edit", isLoggin, isOwner, wrapAsync(editListing));

router
  .route("/:id")
  .put(isLoggin, isOwner, upload.single('image'), validateListing, wrapAsync(updateListing)) // update listing route
  .delete(isLoggin, isOwner, wrapAsync(destroyListing)); // destroy listing route

module.exports = router;