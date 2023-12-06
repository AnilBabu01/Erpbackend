const express = require("express");
const router = express.Router();
const TransportController = require("../../Controllers/TransportController");
const verifyToken = require("../../Middleware/Auth");

router
  .route("/vehicletype", verifyToken)
  .post(verifyToken, TransportController.CreateVehicleType)
  .get(verifyToken, TransportController.GetVehicleType)
  .put(verifyToken, TransportController.UpdateVehicleType)
  .delete(verifyToken, TransportController.DeleteVehicleType);

router
  .route("/vehicleroute", verifyToken)
  .post(verifyToken, TransportController.CreateRoute)
  .get(verifyToken, TransportController.GetRoute)
  .put(verifyToken, TransportController.UpdateRoute)
  .delete(verifyToken, TransportController.DeleteRoute);

router
  .route("/vehicledetails", verifyToken)
  .post(verifyToken, TransportController.CreateVehicleDetails)
  .get(verifyToken, TransportController.GetVehicleDetails)
  .put(verifyToken, TransportController.UpdateVehicleDetails)
  .delete(verifyToken, TransportController.DeleteVehicleDetails);

router
  .route("/busavailability", verifyToken)
  .get(verifyToken, TransportController.GetVehicleList);

router
  .route("/gettransportfee", verifyToken)
  .post(verifyToken, TransportController.GetTransportFee);

router
  .route("/getbusbyrouteid", verifyToken)
  .post(verifyToken, TransportController.GetBusListByRouteID);

router
  .route("/assignbus", verifyToken)
  .post(verifyToken, TransportController.GiveBusToStudent);

router
  .route("/changebus", verifyToken)
  .post(verifyToken, TransportController.ChangeBus);

module.exports = router;
