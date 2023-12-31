const Studygroup = require("./models/studygroup");
const Comment = require("./models/comment");
const { studygroupSchema, commentSchema } = require("./utils/validateSchemas");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
  console.log("REQ USER : " + req.user);
  if (!req.isAuthenticated()) {
    req.flash("error", "로그인이 필요합니다");
    return res.redirect("/login");
  }
  next();
};

module.exports.validateStudygroup = (req, res, next) => {
  const { error } = studygroupSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map((el) => el.message).join(", ");
    throw new ExpressError("validation error : " + errorMessage, 400);
  } else {
    next();
  }
};

module.exports.validateComment = (req, res, next) => {
  const { error } = commentSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map((el) => el.message).join(", ");
    console.log(error);
    throw new ExpressError(errorMessage, 400);
  } else {
    next();
  }
};

module.exports.isAbleToJoinGroup = async (req, res, next) => {
  const { id } = req.params;
  const studygroup = await Studygroup.findById(id);
  if (studygroup.participants.length >= studygroup.capacity) {
    req.flash("error", "해당 스터디그룹에 참여할 수 없습니다");
    return res.redirect(`/studygroups/${id}`);
  } else if (studygroup.participants.includes(req.user._id)) {
    req.flash("error", "이미 스터디그룹의 멤버입니다");
    return res.redirect(`/studygroups/${id}`);
  }
  next();
};

module.exports.isStudygroupAuthor = async (req, res, next) => {
  const { id } = req.params;
  const studygroup = await Studygroup.findById(id);
  if (!studygroup.author.equals(req.user._id)) {
    req.flash("error", "작성자만 수정 삭제할 수 있습니다");
    return res.redirect(`/studygroups/${id}`);
  }
  next();
};

module.exports.isCommentAuthor = async (req, res, next) => {
  const { id, commentId } = req.params;
  const comment = await Comment.findById(commentId);
  if (!comment.author.equals(req.user._id)) {
    req.flash("error", "작성자만 수정 삭제할 수 있습니다");
    return res.redirect(`/studygroups/${id}`);
  }
  next();
};
