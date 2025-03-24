const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required().min(0),
  location: Joi.string().required(),
  country: Joi.string().required(),
});

module.exports.reviewSchema = Joi.object({
  rating: Joi.number().required(),
  comment: Joi.string().required(),
});
