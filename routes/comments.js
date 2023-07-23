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
const comments = require("../controllers/comments");

router.post(
  "/",
  isLoggedIn,
  validateComment,
  catchAsync(comments.createComment)
);

router.delete(
  "/:commentId",
  isLoggedIn,
  isCommentAuthor,
  catchAsync(comments.deleteComment)
);

module.exports = router;
