const Studygroup = require("../models/studygroup");
const Comment = require("../models/comment");
const { cloudinary } = require("../cloudinary");
const { subjects } = require("../seeds/subjects");

module.exports.index = async (req, res) => {
  const subject = req.query.subject;
  console.log(subject);
  let studygroups;
  if (subject !== undefined) {
    studygroups = await Studygroup.find({ subject: subject });
  } else {
    studygroups = await Studygroup.find({});
  }
  res.render("studygroups/index", { studygroups, subjects, subject });
};

// module.exports.serchGroupWithSubject = async (req, res) => {
//   const { subject } = req.params;
//   const studygroups = await Studygroup.find({ subject: subject });
//   console.log(studygroups);
//   res.render("studygroups/index", { studygroups, subject, subjects });
// };

module.exports.renderNewStudygroupForm = (req, res) => {
  req.session.returnto = "/studygroups/new";
  res.render("studygroups/new");
};

module.exports.createStudygroup = async (req, res) => {
  const studygroup = new Studygroup({ ...req.body.studygroup });
  studygroup.date = new Date();
  if (req.files.length > 0) {
    studygroup.images = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
  }
  studygroup.author = req.user._id;
  await studygroup.save();
  req.flash("success", "등록이 완료되었습니다");
  res.redirect(`/studygroups/${studygroup._id}`);
};

module.exports.renderEditStudygroupForm = async (req, res) => {
  const { id } = req.params;
  const studygroup = await Studygroup.findById(id);
  console.log(studygroup);
  if (!studygroup) {
    req.flash("error", "스터디그룹을 찾을 수 없습니다");
    return res.redirect("/studygroups");
  }
  res.render("studygroups/edit", { studygroup });
};

module.exports.showStudygroup = async (req, res) => {
  const { id } = req.params;
  const studygroup = await Studygroup.findById(id)
    .populate({ path: "comments", populate: { path: "author" } })
    .populate("author");
  if (!studygroup) {
    req.flash("error", "스터디그룹을 찾을 수 없습니다");
    return res.redirect("/studygroups");
  }
  req.session.returnTo = `/studygroups/${id}`;
  res.render("studygroups/show", { studygroup });
};

module.exports.editStudygroup = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const studygroup = await Studygroup.findByIdAndUpdate(id, {
    ...req.body.studygroup,
  });
  if (!studygroup) {
    req.flash("error", "스터디그룹을 찾을 수 없습니다");
    return res.redirect("/studygroups");
  }
  if (req.files.length > 0) {
    console.log("req.files");
    const images = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
    }));
    studygroup.images.push(...images);
    await studygroup.save();
  }
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await studygroup.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }

  res.redirect(`/studygroups/${id}`);
};

module.exports.deleteStudygroup = async (req, res) => {
  const { id } = req.params;
  const studygroup = await Studygroup.findById(id);
  const commentsId = studygroup.comments;
  await Comment.deleteMany({ _id: { $in: commentsId } });
  await Studygroup.findByIdAndDelete(id);
  res.redirect("/studygroups");
};

module.exports.joinStudygroup = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const studygroup = await Studygroup.findById(id);
  if (!studygroup.participants.includes(userId)) {
    studygroup.participants.push(userId);
    await studygroup.save();
  } else {
    req.flash("error", "이미 그룹에 참여하고 있습니다");
    return res.redirect(`/studygroups/${id}`);
  }
  res.redirect(`/studygroups/${id}`);
};

module.exports.leaveStudygroup = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const studygroup = await Studygroup.findById(id);
  if (studygroup.participants.includes(userId)) {
    await studygroup.updateOne({ $pull: { participants: userId } });
  } else {
    req.flash("error", "그룹에 참여하고 있지 않습니다");
    return res.redirect(`/studygroups/${id}`);
  }
  res.redirect(`/studygroups/${id}`);
};
