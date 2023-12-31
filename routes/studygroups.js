const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const studygroups = require("../controllers/studygroups");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const {
  isLoggedIn,
  isStudygroupAuthor,
  validateStudygroup,
  isAbleToJoinGroup,
} = require("../middleware");
const studygroup = require("../models/studygroup");

router
  .route("/")
  .get(catchAsync(studygroups.index))
  .post(
    isLoggedIn,
    upload.array("images"),
    validateStudygroup,
    catchAsync(studygroups.createStudygroup)
  );

// router.get('/subjects/:subject', studygroups.serchGroupWithSubject)

router.get("/new", isLoggedIn, studygroups.renderNewStudygroupForm);

router.post(
  "/:id/join",
  isLoggedIn,
  isAbleToJoinGroup,
  catchAsync(studygroups.joinStudygroup)
);

router.post("/:id/leave", isLoggedIn, catchAsync(studygroups.leaveStudygroup));

router.get(
  "/:id/edit",
  isLoggedIn,
  isStudygroupAuthor,
  catchAsync(studygroups.renderEditStudygroupForm)
);

router
  .route("/:id")
  .get(catchAsync(studygroups.showStudygroup))
  .put(
    isLoggedIn,
    upload.array("images"),
    isStudygroupAuthor,
    validateStudygroup,
    catchAsync(studygroups.editStudygroup)
  )
  .delete(
    isLoggedIn,
    isStudygroupAuthor,
    catchAsync(studygroups.deleteStudygroup)
  );

module.exports = router;
