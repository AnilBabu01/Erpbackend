const express = require("express");
const router = express.Router();
const ExpensesController = require("../../Controllers/ExpensesController");
const verifyToken = require("../../Middleware/Auth");

router
  .route("/addassettype", verifyToken)
  .post(verifyToken, ExpensesController.CreateAssetType)
  .get(verifyToken, ExpensesController.GeAssetType)
  .put(verifyToken, ExpensesController.UpdateAssetType)
  .delete(verifyToken, ExpensesController.DeleteAssetType);

router
  .route("/addasset", verifyToken)
  .post(verifyToken, ExpensesController.CreateAsset)
  .get(verifyToken, ExpensesController.GeAsset)
  .put(verifyToken, ExpensesController.UpdateAsset)
  .delete(verifyToken, ExpensesController.DeleteAsset);

router
  .route("/addexpensestype", verifyToken)
  .post(verifyToken, ExpensesController.CreateExpensesType)
  .get(verifyToken, ExpensesController.GetExpensesType)
  .put(verifyToken, ExpensesController.UpdateExpensesType)
  .delete(verifyToken, ExpensesController.DeleteExpensesType);

router
  .route("/addexpenses", verifyToken)
  .post(verifyToken, ExpensesController.CreateExpenses)
  .get(verifyToken, ExpensesController.GetExpenses)
  .put(verifyToken, ExpensesController.UpdateExpenses)
  .delete(verifyToken, ExpensesController.DeleteExpenses);

router
  .route("/getexpensesanalysis", verifyToken)
  .post(verifyToken, ExpensesController.GetExpensesAnalysis);

router
  .route("/amounttransfer", verifyToken)
  .post(verifyToken, ExpensesController.CreateTransferAmmount)
  .get(verifyToken, ExpensesController.GetTransferAmmount)
  .put(verifyToken, ExpensesController.UpdateTransferAmmount)
  .delete(verifyToken, ExpensesController.DeleteTransferAmmount);

module.exports = router;
