const {
  sequelize,
  QueryTypes,
  Op,
  where,
  literal,
  DATE,
} = require("sequelize");
const sequelizes = require("../Helper/Connect");
const { config } = require("dotenv");
const respHandler = require("../Handlers");
const ExpensesType = require("../Models/expensestype.model");
const Expensesassestype = require("../Models/expensesassettype.model");
const Expensesasset = require("../Models/expensesasset.model");
const Expenses = require("../Models/expenses.model");
const ReceiptData = require("../Models/receiptdata.model");
const TransferAmount = require("../Models/transfer.model");
const removefile = require("../Middleware/removefile");
config();

const CreateExpensesType = async (req, res) => {
  try {
    const { Expensestype } = req.body;

    let isExpensestype = await ExpensesType.findOne({
      where: {
        Expensestype: Expensestype,
        ClientCode: req.user.ClientCode,
      },
    });
    if (isExpensestype) {
      if (
        isExpensestype?.Expensestype?.toLowerCase() ===
        Expensestype.toLowerCase()
      ) {
        return respHandler.error(res, {
          status: false,
          msg: "AlEeady Exist!!",
          error: ["AlReady Exsist !!"],
        });
      }
    }

    let Expensestypes = await ExpensesType.create({
      Expensestype: Expensestype,
      ClientCode: req.user.ClientCode,
    });
    if (Expensestypes) {
      return respHandler.success(res, {
        status: true,
        msg: "Expenses Type Added successfully!!",
        data: [Expensestypes],
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

const UpdateExpensesType = async (req, res) => {
  try {
    const { Expensestype, id } = req.body;

    let status = await ExpensesType.update(
      {
        Expensestype: Expensestype,
      },
      {
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      }
    );

    if (status) {
      let roomCategory = await ExpensesType.findOne({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      });
      return respHandler.success(res, {
        status: true,
        msg: "Expenses Type Updated successfully!!",
        data: [roomCategory],
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

const GetExpensesType = async (req, res) => {
  try {
    const { Expensestype } = req.query;
    let whereClause = {};

    if (req.user) {
      whereClause.ClientCode = req.user.ClientCode;
    }

    if (Expensestype) {
      whereClause.Expensestype = { [Op.regexp]: `^${Expensestype}.*` };
    }
    let roomCategory = await ExpensesType.findAll({
      where: whereClause,
    });
    if (roomCategory) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch All Expenses Type Successfully!!",
        data: roomCategory,
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

const DeleteExpensesType = async (req, res) => {
  try {
    const { id } = req.body;
    let Expensestype = await ExpensesType.findOne({ where: { id: id } });
    if (Expensestype) {
      await ExpensesType.destroy({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      });
      return respHandler.success(res, {
        status: true,
        data: [],
        msg: "Expenses Type Deleted Successfully!!",
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

const CreateExpenses = async (req, res) => {
  try {
    const { Expensestype, ExpensesAmount, Comment, addDate, PayOption } =
      req.body;
    let date = new Date();
    let fullyear = date.getFullYear();
    let lastyear = date.getFullYear() - 1;

    let Session = `${lastyear}-${fullyear}`;
    let Expensestypes = await Expenses.create({
      Date: date,
      Expensestype: Expensestype,
      ExpensesAmount: ExpensesAmount,
      Comment: Comment,
      ClientCode: req.user.ClientCode,
      PayOption: PayOption,
      Session: Session,
      MonthNO: date.getMonth() + 1,
    });
    if (Expensestypes) {
      return respHandler.success(res, {
        status: true,
        msg: "Expenses Added Successfully!!",
        data: [Expensestypes],
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

const UpdateExpenses = async (req, res) => {
  try {
    const { Expensestype, ExpensesAmount, Comment, Date, id, PayOption } =
      req.body;

    let status = await Expenses.update(
      {
        Date: Date,
        Expensestype: Expensestype,
        ExpensesAmount: ExpensesAmount,
        Comment: Comment,
        PayOption: PayOption,
      },
      {
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      }
    );

    if (status) {
      let expenses = await Expenses.findOne({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      });
      return respHandler.success(res, {
        status: true,
        msg: "Expenses Updated Successfully!!",
        data: [expenses],
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

const GetExpenses = async (req, res) => {
  try {
    const { fromdate, todate, expensestype, PayOption, sessionname } =
      req.query;
    let whereClause = {};
    let from = new Date(fromdate);
    let to = new Date(todate);
    if (req.user) {
      whereClause.ClientCode = req.user.ClientCode;
    }
    if (PayOption) {
      whereClause.PayOption = { [Op.regexp]: `^${PayOption}.*` };
    }
    if (expensestype) {
      whereClause.Expensestype = { [Op.regexp]: `^${expensestype}.*` };
    }
    if (sessionname) {
      whereClause.Session = { [Op.regexp]: `^${sessionname}.*` };
    }
    if (fromdate && todate) {
      whereClause.Date = { [Op.between]: [from, to] };
    }
    let roomCategory = await Expenses.findAll({
      where: whereClause,
    });
    if (roomCategory) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch All Expenses Successfully!!",
        data: roomCategory,
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

const DeleteExpenses = async (req, res) => {
  try {
    const { id } = req.body;
    let Expensestype = await Expenses.findOne({ where: { id: id } });
    if (Expensestype) {
      await Expenses.destroy({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      });
      return respHandler.success(res, {
        status: true,
        data: [],
        msg: "Expenses Deleted Successfully!!",
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

const CreateAssetType = async (req, res) => {
  try {
    const { AssetType } = req.body;

    let isExpensestype = await Expensesassestype.findOne({
      where: {
        AssetType: AssetType,
        ClientCode: req.user.ClientCode,
      },
    });
    if (isExpensestype) {
      if (
        isExpensestype?.AssetType?.toLowerCase() === AssetType.toLowerCase()
      ) {
        return respHandler.error(res, {
          status: false,
          msg: "AlReady Exist!!",
          error: ["AlReady Exsist !!"],
        });
      }
    }

    let Expensestypes = await Expensesassestype.create({
      AssetType: AssetType,
      ClientCode: req.user.ClientCode,
    });
    if (Expensestypes) {
      return respHandler.success(res, {
        status: true,
        msg: "Asset Type Added successfully!!",
        data: [Expensestypes],
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

const UpdateAssetType = async (req, res) => {
  try {
    const { AssetType, id } = req.body;

    let status = await Expensesassestype.update(
      {
        AssetType: AssetType,
      },
      {
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      }
    );

    if (status) {
      let roomCategory = await Expensesassestype.findOne({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      });
      return respHandler.success(res, {
        status: true,
        msg: "Asset Type Updated successfully!!",
        data: [roomCategory],
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

const GeAssetType = async (req, res) => {
  try {
    const { AssetType } = req.query;
    let whereClause = {};

    if (req.user) {
      whereClause.ClientCode = req.user.ClientCode;
    }

    if (AssetType) {
      whereClause.Expensestype = { [Op.regexp]: `^${AssetType}.*` };
    }
    let roomCategory = await Expensesassestype.findAll({
      where: whereClause,
    });
    if (roomCategory) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch All Asset Type Successfully!!",
        data: roomCategory,
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

const DeleteAssetType = async (req, res) => {
  try {
    const { id } = req.body;
    let Expensestype = await Expensesassestype.findOne({ where: { id: id } });
    if (Expensestype) {
      await ExpensesType.destroy({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      });
      return respHandler.success(res, {
        status: true,
        data: [],
        msg: "Asset Type Deleted Successfully!!",
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

const CreateAsset = async (req, res) => {
  try {
    const { AssetType, Date, AssetName, Comment, AssetAmount } = req.body;

    let Expensestypes = await Expensesasset.create({
      AssetType: AssetType,
      Date: Date,
      AssetName: AssetName,
      AssetAmount: AssetAmount,
      Comment: Comment,
      ClientCode: req.user.ClientCode,
    });
    if (Expensestypes) {
      return respHandler.success(res, {
        status: true,
        msg: "Asset Added successfully!!",
        data: [Expensestypes],
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

const UpdateAsset = async (req, res) => {
  try {
    const { AssetType, Date, AssetName, Comment, AssetAmount, id } = req.body;

    let status = await Expensesasset.update(
      {
        AssetType: AssetType,
        Date: Date,
        AssetName: AssetName,
        AssetAmount: AssetAmount,
        Comment: Comment,
      },
      {
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      }
    );

    if (status) {
      let roomCategory = await Expensesasset.findOne({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      });
      return respHandler.success(res, {
        status: true,
        msg: "Asset Updated successfully!!",
        data: [roomCategory],
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

const GeAsset = async (req, res) => {
  try {
    const { fromdate, todate, assettypename } = req.query;
    let whereClause = {};
    let from = new Date(fromdate);
    let to = new Date(todate);
    if (req.user) {
      whereClause.ClientCode = req.user.ClientCode;
    }
    if (fromdate && todate) {
      whereClause.Date = { [Op.between]: [from, to] };
    }
    if (assettypename) {
      whereClause.AssetType = { [Op.regexp]: `^${assettypename}.*` };
    }
    let roomCategory = await Expensesasset.findAll({
      where: whereClause,
    });
    if (roomCategory) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch All Asset Type Successfully!!",
        data: roomCategory,
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

const DeleteAsset = async (req, res) => {
  try {
    const { id } = req.body;
    let Expensestype = await Expensesasset.findOne({ where: { id: id } });
    if (Expensestype) {
      await Expensesasset.destroy({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      });
      return respHandler.success(res, {
        status: true,
        data: [],
        msg: "Asset Type Deleted Successfully!!",
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

const GetExpensesAnalysis = async (req, res) => {
  try {
    const { sessionname, month } = req.body;
    console.log("data is", month);

    let allexpenses = await sequelizes.query(
      `Select Expensestype,PayOption,Comment, SUM(ExpensesAmount) AS total_paidamount FROM expenses WHERE ClientCode= '${req.user?.ClientCode}' AND Expensestype IN ('Expenses', 'Liability') AND MONTH(Date) ='${month}'  AND Session ='${sessionname}' AND PayOption IN ('Cash', 'Online')  GROUP BY Expensestype ,PayOption;`,
      {
        nest: true,
        type: QueryTypes.SELECT,
        raw: true,
      }
    );

    let allexpensesAsset = await sequelizes.query(
      `Select Expensestype,PayOption,Comment, SUM(ExpensesAmount) AS total_paidamount FROM expenses WHERE ClientCode= '${req.user?.ClientCode}' AND Expensestype IN ('Asset') AND MONTH(Date) ='${month}'  AND Session ='${sessionname}' GROUP BY Expensestype ,PayOption;`,
      {
        nest: true,
        type: QueryTypes.SELECT,
        raw: true,
      }
    );

    let allreceiptdata = await sequelizes.query(
      `Select PaidDate, Course,PayOption, SUM(PaidAmount) AS total_paidamount FROM receiptdata WHERE ClientCode= '${req.user?.ClientCode}' AND MONTH(PaidDate) ='${month}'  AND Session ='${sessionname}' GROUP BY Course ,PayOption;`,
      {
        nest: true,
        type: QueryTypes.SELECT,
        raw: true,
      }
    );
    const firstDayOfMonth = new Date(
      new Date().getFullYear(),
      Number(month) - 1,
      1
    );
    const lastDayOfMonth = new Date(new Date().getFullYear(), Number(month), 0);

    if (allexpenses && allreceiptdata && allexpensesAsset) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch All Expenses Successfully!!",
        data: [
          {
            allreceiptdata: allreceiptdata,
            allexpenses: allexpenses,
            allexpensesAsset: allexpensesAsset,
          },
        ],
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

const CreateTransferAmmount = async (req, res) => {
  try {
    const { Transfer_Amount, Comment, Transfer_Mode, addDate } = req.body;
    let newdate = new Date(addDate);
    let fullyear = newdate.getFullYear();
    let lastyear = newdate.getFullYear() - 1;

    let Session = `${lastyear}-${fullyear}`;
    let Expensestypes = await TransferAmount.create({
      Date: newdate,
      Transfer_Amount: Transfer_Amount,
      Comment: Comment,
      ClientCode: req.user.ClientCode,
      Transfer_Mode: Transfer_Mode,
      Session: Session,
      MonthNO: newdate.getMonth() + 1,
    });
    if (Expensestypes) {
      return respHandler.success(res, {
        status: true,
        msg: "Amount Transfer Successfully!!",
        data: [Expensestypes],
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

const UpdateTransferAmmount = async (req, res) => {
  try {
    const { Transfer_Amount, Comment, id, Transfer_Mode, addDate } = req.body;
    let newdate = new Date(addDate);
    let status = await TransferAmount.update(
      {
        Date: newdate,
        MonthNO: newdate.getMonth() + 1,
        Transfer_Amount: Transfer_Amount,
        Comment: Comment,
        Transfer_Mode: Transfer_Mode,
      },
      {
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      }
    );

    if (status) {
      let expenses = await Expenses.findOne({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      });
      return respHandler.success(res, {
        status: true,
        msg: "Amount Transfer Updated Successfully!!",
        data: [expenses],
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

const GetTransferAmmount = async (req, res) => {
  try {
    const { fromdate, todate, Transfer_Mode, sessionname } = req.query;
    let whereClause = {};
    let from = new Date(fromdate);
    let to = new Date(todate);
    if (req.user) {
      whereClause.ClientCode = req.user.ClientCode;
    }
    if (Transfer_Mode) {
      whereClause.Transfer_Mode = { [Op.regexp]: `^${Transfer_Mode}.*` };
    }

    if (sessionname) {
      whereClause.Session = { [Op.regexp]: `^${sessionname}.*` };
    }
    if (fromdate && todate) {
      whereClause.Date = { [Op.between]: [from, to] };
    }
    let roomCategory = await TransferAmount.findAll({
      where: whereClause,
    });
    if (roomCategory) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch All Amount Transfer Successfully!!",
        data: roomCategory,
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

const DeleteTransferAmmount = async (req, res) => {
  try {
    const { id } = req.body;
    let Expensestype = await TransferAmount.findOne({ where: { id: id } });
    if (Expensestype) {
      await TransferAmount.destroy({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      });
      return respHandler.success(res, {
        status: true,
        data: [],
        msg: "Amount Transfer Deleted Successfully!!",
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
module.exports = {
  CreateExpensesType,
  GetExpensesType,
  DeleteExpensesType,
  UpdateExpensesType,
  CreateExpenses,
  GetExpenses,
  DeleteExpenses,
  UpdateExpenses,
  CreateAssetType,
  GeAssetType,
  UpdateAssetType,
  DeleteAssetType,
  CreateAsset,
  GeAsset,
  UpdateAsset,
  DeleteAsset,
  GetExpensesAnalysis,
  CreateTransferAmmount,
  GetTransferAmmount,
  UpdateTransferAmmount,
  DeleteTransferAmmount,
};
