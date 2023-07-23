const Studygroup = require("../models/studygroup");

module.exports.index = async (req, res) => {
  const studygroups = await Studygroup.find({});
  res.render("studygroups/index", { studygroups });
};

module.exports.renderNewStudygroupForm = (req, res) => {
  req.session.returnto = "/studygroups/new";
  res.render("studygroups/new");
};

module.exports.createStudygroup = async (req, res) => {
  const studygroup = new Studygroup({ ...req.body.studygroup });
  await studygroup.save();
  req.flash("success", "등록이 완료되었습니다");
  res.redirect(`/studygroups/${studygroup._id}`);
};

module.exports.renderEditStudygroupForm = async (req, res) => {
  const { id } = req.params;
  const studygroup = await Studygroup.findById(id);
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
  console.log(studygroup);
  if (!studygroup) {
    req.flash("error", "스터디그룹을 찾을 수 없습니다");
    return res.redirect("/studygroups");
  }
  req.session.returnTo = `/studygroups/${id}`;
  res.render("studygroups/show", { studygroup });
};

module.exports.editStudygroup = async (req, res) => {
  const { id } = req.params;
  const studygroup = await Studygroup.findByIdAndUpdate(id, {
    ...req.body.studygroup,
  });
  if (!studygroup) {
    req.flash("error", "스터디그룹을 찾을 수 없습니다");
    return res.redirect("/studygroups");
  }
  res.redirect(`/studygroups/${id}`);
};

module.exports.deleteStudygroup = async (req, res) => {
  const { id } = req.params;
  await Studygroup.findByIdAndDelete(id);
  res.redirect("/studygroups");
};