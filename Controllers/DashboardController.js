const { config } = require("dotenv");
const respHandler = require("../Handlers");
const Book = require("../Models/book.model");
const BookedBook = require("../Models/bookedbook.model");
const Student = require("../Models/student.model");
config();

const GetAllTotalData = async (req, res) => {
  try {
    const { courseorclass, BookId, auther,  } = req.query;
    let whereClause = {};

    if (req.user) {
      whereClause.ClientCode = req.user.ClientCode;
    }

    if (courseorclass) {
      whereClause.courseorclass = courseorclass;
    }
    if (auther) {
      whereClause.auther = auther;
    }
    if (BookId) {
      whereClause.BookId = BookId;
    }

    let book = await Book.findAll({
      where: whereClause,
    });
    if (book) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch All Books successfully!!",
        data: book,
      });
    } else {
      return respHandler.error(res, {
        status: false,
        msg: "Something Went Wrong!!",
        error: [""],
      });
    }
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};

module.exports = {
  GetAllTotalData
};
