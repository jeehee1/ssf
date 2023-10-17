const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}}은 HTML을 포함할 수 없습니다",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value) {
          return helpers.error("string.escapeHTML", { value });
        }
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.studygroupSchema = Joi.object({
  studygroup: Joi.object({
    title: Joi.string().required().escapeHTML(),
    line: Joi.string().required().escapeHTML(),
    subject: Joi.string().required().escapeHTML(),
    capacity: Joi.number().required().min(1),
    location: Joi.string().required().escapeHTML(),
    address: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.commentSchema = Joi.object({
  comment: Joi.object({
    body: Joi.string().required().escapeHTML(),
  }).required(),
});
