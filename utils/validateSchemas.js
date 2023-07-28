const Joi = require("joi");

module.exports.studygroupSchema = Joi.object({
  studygroup: Joi.object({
    title: Joi.string().required(),
    subject: Joi.string().required(),
    capacity: Joi.number().required().min(1),
    location: Joi.string().required(),
    // images: Joi.array().items(
    //   Joi.object({
    //     url: Joi.string(),
    //     filename: Joi.string(),
    //   })
    // ),
    description: Joi.string().required(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.commentSchema = Joi.object({
  comment: Joi.object({
    body: Joi.string().required(),
  }).required(),
});
