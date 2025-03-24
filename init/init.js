const mongoose = require("mongoose");
const Listing = require("../models/Listing");
const sampleListings = require("./data");

main()
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log("Error Database Connection : ", err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}

const initDB = () => {
  // const updatedSampleListings = sampleListings.map((obj) => {
  //   return { ...obj, owner: "67d5dc75bb5ebf79ab83d4da" };
  // });
  const updatedSampleListings = sampleListings.map((obj) => ({
    ...obj,
    owner: '67da63ea4be96f1d1cb2599d',
  }));
  Listing.insertMany(updatedSampleListings)
    .then((res) => {
      console.log("listings initialized");
    })
    .catch((err) => {
      console.log(err);
    });
};

initDB();