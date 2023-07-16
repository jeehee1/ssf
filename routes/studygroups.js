const express = require("express");
const router = express.Router();

const Studygroup = require("../models/studygroup");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const { studygroupSchema } = require("../utils/validateSchemas");

const validateStudygroup = (req, res, next) => {
  const { error } = studygroupSchema.validate(req.body);
  if (error) {
    const errorMessage = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(errorMessage, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  catchAsync(async (req, res, next) => {
    const studygroups = await Studygroup.find({});
    res.render("studygroups/index", { studygroups });
  })
);

router.post(
  "/",
  validateStudygroup,
  catchAsync(async (req, res, next) => {
    const studygroup = new Studygroup({ ...req.body.studygroup });
    await studygroup.save();
    req.flash("success", "등록이 완료되었습니다");
    res.redirect(`/studygroups/${studygroup._id}`);
  })
);

router.get("/new", (req, res) => {
  res.render("studygroups/new");
});

router.get(
  "/:id/edit",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const studygroup = await Studygroup.findById(id);
    if (!studygroup) {
      req.flash("error", "스터디그룹을 찾을 수 없습니다");
      return res.redirect("/studygroups");
    }
    res.render("studygroups/edit", { studygroup });
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const studygroup = await Studygroup.findById(id).populate("comments");
    if (!studygroup) {
      req.flash("error", "스터디그룹을 찾을 수 없습니다");
      return res.redirect("/studygroups");
    }
    res.render("studygroups/show", { studygroup });
  })
);

router.put(
  "/:id",
  validateStudygroup,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const studygroup = await Studygroup.findByIdAndUpdate(id, {
      ...req.body.studygroup,
    });
    if (!studygroup) {
      req.flash("error", "스터디그룹을 찾을 수 없습니다");
      return res.redirect("/studygroups");
    }
    res.redirect(`/studygroups/${id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Studygroup.findByIdAndDelete(id);
    res.redirect("/studygroups");
  })
);

module.exports = router;
