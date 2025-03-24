const Listing = require("../models/Listing");
const Review = require("../models/Review");

// show all listings
module.exports.index = async (req, res) => {
  const listings = await Listing.find({});
  if (!listings) {
    req.flash("flashMessage", "Listings doesn't exist");
    res.redirect("/listings");
  }
  res.render("index.ejs", { listings });
}

// show one listing
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const list = await Listing.findById(id)
    .populate({ path: "review", populate: { path: "owner", model: "User" } })
    .populate("owner");
  if (!list) {
    req.flash("flashMessage", "List doesn't exist");
    res.redirect("/listings");
  }
  res.render("show.ejs", { list });
}

// create listing form
module.exports.createListingForm =  (req, res) => {
  res.render("new.ejs");
}


// create new listing
module.exports.createListing = async (req, res, next) => {
  const { filename, path } = req.file;
  
  const {
    title,
    description,
    price,
    location,
    country,
  } = req.body;

  const list = new Listing({
    title,
    description,
    image: {
      filename: filename,
      url: path,
    },
    price,
    location,
    country,
    owner: req.user,
  });
  
  await list.save();
  req.flash("flashMessage", "New Listing created successfully");
  res.redirect("/listings");
}

// edit listing
module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  const list = await Listing.findById(id);
  if (!list) {
    req.flash("flashMessage", "Listings doesn't exist");
    res.redirect("/listings");
  }
  let originalImageUrl = list.image.url;
  let modifiedImage = originalImageUrl.replace("/upload", "/upload/w_250,h_300");
  res.render("edit.ejs", { list, modifiedImage });
}

// update listing
module.exports.updateListing = async (req, res, next) => {
  const { id } = req.params;

  const {
    title,
    description,
    price,
    location,
    country,
  } = req.body;

  if (req.file) {
    await Listing.findByIdAndUpdate(id, {
      title,
      description,
      image: {
        filename: req.file.filename,
        url: req.file.path,
      },
      price,
      location,
      country,
    });
  } else {
    
    await Listing.findByIdAndUpdate(id, {
      title,
      description,
      price,
      location,
      country,
    });
  }

  req.flash("flashMessage", "List Updated successfully");
  res.redirect("/listings");
}
  

// destroy listing
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  const list = await Listing.findById(id);
  await Review.deleteMany({ _id: { $in: list.review } });
  await Listing.findByIdAndDelete(id);
  req.flash("flashMessage", "Listing deleted successfully");
  res.redirect("/listings");
}