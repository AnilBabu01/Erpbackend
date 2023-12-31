const { config } = require("dotenv");
const respHandler = require("../Handlers");
const Book = require("../Models/book.model");
const BookedBook = require("../Models/bookedbook.model");
const Student = require("../Models/student.model");
config();

const CreateBook = async (req, res) => {
  try {
    const { courseorclass, BookId, BookTitle, auther, quantity, addDate,stream } =
      req.body;
    let newdate = new Date(addDate);
    let book = await Book.findOne({
      where: {
        courseorclass: courseorclass,
        BookId: BookId,
        BookTitle: BookTitle,
        auther: auther,
        stream:stream,
        ClientCode: req.user.ClientCode,
      },
    });
    if (book) {
      if (book?.BookId?.toLowerCase() === BookId.toLowerCase()) {
        return respHandler.error(res, {
          status: false,
          msg: "AlReady Exist!!",
          error: ["AllReady Exsist !!"],
        });
      }
    }

    let checkbkId = await Book.findOne({
      where: {
        BookId: BookId,
        ClientCode: req.user.ClientCode,
      },
    });
    if (checkbkId) {
      if (checkbkId?.BookId?.toLowerCase() === BookId.toLowerCase()) {
        return respHandler.error(res, {
          status: false,
          msg: "AlReady Exist!!",
          error: ["AllReady Exsist !!"],
        });
      }
    }

    let books = await Book.create({
      courseorclass: courseorclass,
      BookId: BookId,
      BookTitle: BookTitle,
      auther: auther,
      quantity: quantity,
      ClientCode: req.user.ClientCode,
      addDate: newdate,
      Realquantity: quantity,
      stream:stream,
    });
    if (books) {
      return respHandler.success(res, {
        status: true,
        msg: "Book Added successfully!!",
        data: [books],
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

const UpdateBook = async (req, res) => {
  try {
    const { courseorclass, BookId, BookTitle, auther, quantity, id, addDate } =
      req.body;
    let newdate = new Date(addDate);
    let status = await Book.update(
      {
        courseorclass: courseorclass,
        BookId: BookId,
        BookTitle: BookTitle,
        auther: auther,
        quantity: quantity,
        addDate: newdate,
        Realquantity: quantity,
      },
      {
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      }
    );

    if (status) {
      let book = await Book.findOne({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      });
      return respHandler.success(res, {
        status: true,
        msg: "Book Updated successfully!!",
        data: [book],
      });
    } else {
      return respHandler.error(res, {
        status: false,
        msg: "Something Went Wrong!!",
        error: [err.message],
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

const GetBook = async (req, res) => {
  try {
    const { courseorclass, BookId, auther, studentid, rollnumber ,stream} = req.query;
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
    if(stream)
    {
      whereClause.stream = stream;
    }

    let book = await Book.findAll({
      where: whereClause,
    });
    if (studentid) {
      let BookedBooks = await BookedBook.findAll({
        where: {
          studentid: studentid,
          rollnumber: rollnumber,
          issueStatus: 1,
        },
      });
      if (book && BookedBooks) {
        return respHandler.success(res, {
          status: true,
          msg: "Fetch All Books successfully!!",
          data: { BookedBooks: BookedBooks, book: book },
        });
      } else {
        return respHandler.error(res, {
          status: false,
          msg: "Something Went Wrong!!",
          error: [""],
        });
      }
    } else {
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
    }
  } catch (err) {
    return respHandler.error(res, {
      status: false,
      msg: "Something Went Wrong!!",
      error: [err.message],
    });
  }
};

const DeleteBook = async (req, res) => {
  try {
    const { id } = req.body;
    let book = await Book.findOne({ where: { id: id } });
    if (book) {
      await Book.destroy({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      });
      return respHandler.success(res, {
        status: true,
        data: [],
        msg: "Book Deleted Successfully!!",
      });
    } else {
      return respHandler.error(res, {
        status: false,
        msg: "Something Went Wrong!!",
        error: ["not found"],
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

const BookIssue = async (req, res) => {
  try {
    const { studentid, rollnumber, courseorclass, bookDeatils } = req.body;
    let student = await Student.findOne({
      where: {
        id: studentid,
        rollnumber: rollnumber,
        courseorclass: courseorclass,
        ClientCode: req.user.ClientCode,
      },
    });
    if (student) {
      let isBooksIssued = await BookedBook.findAll({
        where: {
          id: studentid,
          rollnumber: rollnumber,
          courseorclass: courseorclass,
          ClientCode: req.user.ClientCode,
        },
      });
      if (isBooksIssued?.length > 0) {
        return respHandler.success(res, {
          status: true,
          msg: "Books Already Issue Successfully!!",
          data: isBooksIssued,
        });
      } else {
        const promises = bookDeatils?.map(async (item) => {
          let book = await Book.findOne({
            where: {
              id: item?.id,
              courseorclass: courseorclass,
              ClientCode: req.user.ClientCode,
            },
          });
          if (book) {
            await Book.update(
              {
                quantity: Number(book?.quantity - 1),
              },
              {
                where: {
                  id: book?.id,
                  courseorclass: courseorclass,
                  ClientCode: req.user?.ClientCode,
                },
              }
            );
          }
          let result = await BookedBook.create({
            IssueDate: new Date(),
            courseorclass: courseorclass,
            studentid: studentid,
            rollnumber: rollnumber,
            Session: student?.Session,
            Section: student?.Section,
            SrNumber: student?.SrNumber,
            BookId: item?.BookId,
            BookTitle: item?.BookTitle,
            auther: item?.auther,
            IssueStatus: item?.issueStatus,
            ClientCode: req.user.ClientCode,
          });

          return result;
        });

        if (await Promise.all(promises)) {
          let bookedBook = await BookedBook.findAll({
            where: {
              id: studentid,
              rollnumber: rollnumber,
              courseorclass: courseorclass,
              ClientCode: req.user.ClientCode,
            },
          });
          if (bookedBook) {
            return respHandler.success(res, {
              status: true,
              msg: "Book Issue Successfully!!",
              data: bookedBook,
            });
          }
        }
      }
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

const UpdateBookIssue = async (req, res) => {
  try {
    const { studentid, rollnumber, courseorclass, bookDeatils } = req.body;
    const promises = bookDeatils?.map(async (item) => {
      let book = await Book.findOne({
        where: {
          BookId: item?.BookId,
          courseorclass: courseorclass,
          ClientCode: req.user.ClientCode,
        },
      });
      if (book) {
        await Book.update(
          {
            quantity:
              item?.issueStatus === true
                ? Number(book?.quantity + 1)
                : book?.quantity,
          },
          {
            where: {
              id: book?.id,
              courseorclass: courseorclass,
              ClientCode: req.user?.ClientCode,
            },
          }
        );
      }
      let result = await BookedBook.update(
        {
          returnStatus: item?.issueStatus,
          issueStatus: false,
        },
        {
          where: {
            id: item?.id,
            rollnumber: rollnumber,
            studentid: studentid,
            courseorclass: courseorclass,
            ClientCode: req.user?.ClientCode,
          },
        }
      );

      return result;
    });

    if (await Promise.all(promises)) {
      let bookedBook = await BookedBook.findAll({
        where: {
          id: studentid,
          rollnumber: rollnumber,
          courseorclass: courseorclass,
          ClientCode: req.user.ClientCode,
        },
      });

      return respHandler.success(res, {
        status: true,
        msg: "Books Return Successfully!!",
        data: bookedBook,
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

const GetBookIssue = async (req, res) => {
  try {
    const { studentid, rollnumber, courseorclass } = req.query;
    let whereClause = {};
    let returnStatus = 0;
    if (req.user) {
      whereClause.ClientCode = req.user.ClientCode;
    }
    if (courseorclass) {
      whereClause.courseorclass = courseorclass;
    }
    if (studentid) {
      whereClause.studentid = studentid;
    }
    if (rollnumber) {
      whereClause.rollnumber = rollnumber;
    }
    whereClause.returnStatus = 0;

    let bookedBook = await BookedBook.findAll({
      where: whereClause,
    });
    if (bookedBook) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch All Booked successfully!!",
        data: bookedBook,
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

const GetStudentBook = async (req, res) => {
  try {
    let BookedBooks = await BookedBook.findAll({
      where: {
        studentid: req?.user?.id,
        rollnumber: req?.user?.rollnumber,
        issueStatus: 1,
        ClientCode: req?.user?.ClientCode,
        Session: req?.user?.Session,
        Section: req?.user?.Section,
        SrNumber: req?.user?.SrNumber,
      },
    });
    if (BookedBooks) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch All Booked List Successfully!!",
        data: BookedBooks,
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
  CreateBook,
  UpdateBook,
  GetBook,
  DeleteBook,
  BookIssue,
  UpdateBookIssue,
  GetBookIssue,
  GetStudentBook,
};
