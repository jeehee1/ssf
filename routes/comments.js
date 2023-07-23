const express = require("express");
const router = express.Router({ mergeParams: true });
const Comment = require("../models/comment");
const catchAsync = require("../utils/catchAsync");
const {
  isLoggedIn,
  isCommentAuthor,
  validateComment,
} = require("../middleware");
const { commentSchema } = require("../utils/validateSchemas");
const Studygroup = require("../models/studygroup");

router.post(
  "/",
  isLoggedIn,
  validateComment,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const studygroup = await Studygroup.findById(id);
    const comment = new Comment({ ...req.body.comment, date: new Date() });
    comment.author = req.user._id;
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

router.delete(
  "/:commentId",
  isLoggedIn,
  isCommentAuthor,
  catchAsync(async (req, res, next) => {
    const { id, commentId } = req.params;
    await Studygroup.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash("success", "댓글이 삭제되었습니다.");
    res.redirect(`/studygroups/${id}`);
  })
);

module.exports = router;
