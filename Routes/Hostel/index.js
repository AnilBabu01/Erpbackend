const express = require("express");
const router = express.Router();
const HostelController = require("../../Controllers/HostelController");
const verifyToken = require("../../Middleware/Auth");
const upload = require("../../Middleware/upload");
router
  .route("/category", verifyToken)
  .post(verifyToken, HostelController.CreateCategory)
  .get(verifyToken, HostelController.GetCategory)
  .put(verifyToken, HostelController.UpdateCategory)
  .delete(verifyToken, HostelController.DeleteCategory);

router
  .route("/facility", verifyToken)
  .post(verifyToken, HostelController.CreateFacility)
  .get(verifyToken, HostelController.GetFacility)
  .put(verifyToken, HostelController.UpdateFacility)
  .delete(verifyToken, HostelController.DeleteFacility);

router
  .route("/addhostel", verifyToken)
  .post(
    verifyToken,
    upload.fields([
      {
        name: "Hostelurl",
        maxCount: 1,
      },
    ]),
    HostelController.CreateHostel
  )
  .get(verifyToken, HostelController.GetHostel)
  .put(
    verifyToken,
    upload.fields([
      {
        name: "Hostelurl",
        maxCount: 1,
      },
    ]),
    HostelController.UpdateHostel
  )
  .delete(verifyToken, HostelController.DeleteHostel);

router
  .route("/addroom", verifyToken)
  .post(verifyToken, HostelController.CreateRoom)
  .get(verifyToken, HostelController.GetRoom)
  .put(verifyToken, HostelController.UpdateRoom)
  .delete(verifyToken, HostelController.DeleteRoom);

router
  .route("/gethostelfee", verifyToken)
  .post(verifyToken, HostelController.GetHostelFee);

module.exports = router;
