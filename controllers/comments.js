const Studygroup = require("../models/studygroup");
const Comment = require("../models/comment");

module.exports.createComment = async (req, res) => {
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
};

module.exports.deleteComment = async (req, res) => {
  const { id, commentId } = req.params;
  await Studygroup.findByIdAndUpdate(id, { $pull: { comments: commentId } });
  await Comment.findByIdAndDelete(commentId);
  req.flash("success", "댓글이 삭제되었습니다.");
  res.redirect(`/studygroups/${id}`);
};
