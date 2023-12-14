const express = require("express");
const router = express.Router();
const LibraryController = require("../../Controllers/LibraryController");
const verifyToken = require("../../Middleware/Auth");

router
  .route("/addbook", verifyToken)
  .post(verifyToken, LibraryController.CreateBook)
  .get(verifyToken, LibraryController.GetBook)
  .put(verifyToken, LibraryController.UpdateBook)
  .delete(verifyToken, LibraryController.DeleteBook);

router
  .route("/bookissue", verifyToken)
  .post(verifyToken, LibraryController.BookIssue)
  .get(verifyToken, LibraryController.GetBookIssue)
  .put(verifyToken, LibraryController.UpdateBookIssue);

router
  .route("/GetStudentBook", verifyToken)
  .get(verifyToken, LibraryController.GetStudentBook);

module.exports = router;
