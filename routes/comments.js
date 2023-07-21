const express = require("express");
const router = express.Router({ mergeParams: true });
const Comment = require("../models/comment");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn } = require("../middleware");
const { commentSchema } = require("../utils/validateSchemas");
const Studygroup = require("../models/studygroup");

const validateComment = (req, res, next) => {
  const { error } = commentSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map((el) => el.message).join(", ");
    console.log(error);
    throw new ExpressError(errorMessage, 400);
  } else {
    next();
  }
};

router.post(
  "/",
  isLoggedIn,
  validateComment,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const studygroup = await Studygroup.findById(id);
    console.log(id);
    console.log(studygroup);
    const comment = new Comment({ ...req.body.comment, date: new Date() });
    comment.author = req.user._id;
    console.log(comment);

    studygroup.comments.push(comment);
    await comment.save();
    await studygroup.save();
    if (!studygroup) {
      req.flash("error", "스터디그룹을 찾을 수 없습니다");
      return res.redirect("/studygroups");
    }
    res.redirect(`/studygroups/${id}`);
  })
);

module.exports = router;
