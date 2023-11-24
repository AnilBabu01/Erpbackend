const { config } = require("dotenv");
const respHandler = require("../Handlers");
const VehicleType = require("../Models/vehicletype.model");
const VehicleRoute = require("../Models/vehicleroute.model");
const VehicleStop = require("../Models/vehiclestop.model");
const VehicleDetails = require("../Models/vehicledetails.mode");
const Employee = require("../Models/employee.model");
const Student = require("../Models/student.model");

config();

const CreateVehicleType = async (req, res) => {
  try {
    const { Vahicletype } = req.body;

    let vahicletype = await VehicleType.findOne({
      where: {
        Vahicletype: Vahicletype,
        ClientCode: req.user.ClientCode,
      },
    });
    if (vahicletype) {
      if (
        vahicletype?.Vahicletype?.toLowerCase() === Vahicletype.toLowerCase()
      ) {
        return respHandler.error(res, {
          status: false,
          msg: "AllReady Exist!!",
          error: ["AllReady Exsist !!"],
        });
      }
    }

    let vehicletypes = await VehicleType.create({
      Vahicletype: Vahicletype,
      ClientCode: req.user.ClientCode,
    });
    if (vehicletypes) {
      return respHandler.success(res, {
        status: true,
        msg: "Vehicle Type Added successfully!!",
        data: [vehicletypes],
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

const UpdateVehicleType = async (req, res) => {
  try {
    const { Vahicletype, id } = req.body;

    let status = await VehicleType.update(
      {
        Vahicletype,
      },
      {
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      }
    );

    if (status) {
      let vehicletype = await VehicleType.findOne({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      });
      return respHandler.success(res, {
        status: true,
        msg: "Vehicle Type Updated successfully!!",
        data: [vehicletype],
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

const GetVehicleType = async (req, res) => {
  try {
    const {} = req.query;
    let whereClause = {};

    if (req.user) {
      whereClause.ClientCode = req.user.ClientCode;
    }

    let vehicletype = await VehicleType.findAll({
      where: whereClause,
    });
    if (vehicletype) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch All Vehicle Type successfully!!",
        data: vehicletype,
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

const DeleteVehicleType = async (req, res) => {
  try {
    const { id } = req.body;
    let vehicletype = await VehicleType.findOne({ where: { id: id } });
    if (vehicletype) {
      await VehicleType.destroy({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      });
      return respHandler.success(res, {
        status: true,
        data: [],
        msg: "Vehicle Type Deleted Successfully!!",
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

const CreateRoute = async (req, res) => {
  try {
    const { FromRoute, ToRoute, stopslist } = req.body;
    let vehicleroute = await VehicleRoute.create({
      FromRoute: FromRoute,
      ToRoute: ToRoute,
      ClientCode: req.user.ClientCode,
    });
    if (vehicleroute) {
      const promises = stopslist?.map(async (item) => {
        let result = await VehicleStop.create({
          RouteId: vehicleroute?.id,
          StopName: item?.StopName,
          StopStatus: item?.StopStatus,
          ClientCode: req.user.ClientCode,
        });
        return result;
      });
      if (await Promise.all(promises)) {
        let vehicleroutes = await VehicleRoute.findAll({
          where: {
            RouteId: vehicleroute?.id,
            ClientCode: req?.user?.ClientCode,
          },
          include: [
            {
              model: VehicleStop,
            },
          ],
          order: [["id", "DESC"]],
        });

        if (vehicleroutes) {
          return respHandler.success(res, {
            status: true,
            msg: "Routes Added successfully!!",
            data: vehicleroutes,
          });
        }
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

const UpdateRoute = async (req, res) => {
  try {
    const { stopslist, id } = req.body;

    let vehicleroute = await VehicleRoute.findOne({
      where: {
        id: id,
      },
    });
    if (vehicleroute) {
      const promises = stopslist?.map(async (item) => {
        let result = await VehicleStop.update(
          {
            RouteId: vehicleroute?.id,
            StopName: item?.StopName,
            StopStatus: item?.StopStatus,
            ClientCode: req.user.ClientCode,
          },
          {
            where: {
              id: item?.id,
              ClientCode: req.user?.ClientCode,
            },
          }
        );
        return result;
      });

      if (await Promise.all(promises)) {
        let vehicleroutes = await VehicleRoute.findAll({
          where: {
            RouteId: vehicleroute?.id,
            ClientCode: req?.user?.ClientCode,
          },
          include: [
            {
              model: VehicleStop,
            },
          ],
          order: [["id", "DESC"]],
        });

        if (vehicleroutes) {
          return respHandler.success(res, {
            status: true,
            msg: "Route Updated successfully!!",
            data: vehicleroutes,
          });
        }
      } else {
        return respHandler.error(res, {
          status: false,
          msg: "Something Went Wrong!!",
          error: [""],
        });
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

const GetRoute = async (req, res) => {
  try {
    const {} = req.query;
    let whereClause = {};

    if (req.user) {
      whereClause.ClientCode = req.user.ClientCode;
    }

    let vehicleroutes = await VehicleRoute.findAll({
      where: {
        ClientCode: req?.user?.ClientCode,
      },
      include: [
        {
          model: VehicleStop,
        },
      ],
      order: [["id", "DESC"]],
    });

    if (vehicleroutes) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch All Route successfully!!",
        data: vehicleroutes,
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

const DeleteRoute = async (req, res) => {
  try {
    const { id } = req.body;
    let vehicleroute = await VehicleRoute.findOne({ where: { id: id } });
    if (vehicleroute) {
      await VehicleRoute.destroy({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      });

      await VehicleStop.destroy({
        where: {
          id: vehicleroute?.id,
          ClientCode: req.user?.ClientCode,
        },
      });

      return respHandler.success(res, {
        status: true,
        data: [],
        msg: "Route Deleted Successfully!!",
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

const CreateVehicleDetails = async (req, res) => {
  try {
    const { Vahicletype, BusNumber, FualType, Color, GPSDeviceURL, routeId } =
      req.body;

    let vehicledetails = await VehicleDetails.findOne({
      where: {
        BusNumber: BusNumber,
        ClientCode: req.user.ClientCode,
      },
    });
    if (vehicledetails) {
      if (
        vehicledetails?.BusNumber?.toLowerCase() === BusNumber.toLowerCase()
      ) {
        return respHandler.error(res, {
          status: false,
          msg: "AllReady Exist!!",
          error: ["AllReady Exsist !!"],
        });
      }
    }

    let vehicletypes = await VehicleDetails.create({
      routeId: routeId,
      Vahicletype: Vahicletype,
      BusNumber: BusNumber,
      FualType: FualType,
      Color: Color,
      GPSDeviceURL: GPSDeviceURL,
      ClientCode: req.user.ClientCode,
    });
    if (vehicletypes) {
      return respHandler.success(res, {
        status: true,
        msg: "Vehicle Detail Added successfully!!",
        data: [vehicletypes],
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

const UpdateVehicleDetails = async (req, res) => {
  try {
    const { Vahicletype, BusNumber, FualType, Color, GPSDeviceURL, id } =
      req.body;

    let status = await VehicleDetails.update(
      {
        routeId: routeId,
        Vahicletype: Vahicletype,
        BusNumber: BusNumber,
        FualType: FualType,
        Color: Color,
        GPSDeviceURL: GPSDeviceURL,
      },
      {
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      }
    );

    if (status) {
      let vehicletype = await VehicleDetails.findOne({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      });
      return respHandler.success(res, {
        status: true,
        msg: "Vehicle Details Updated successfully!!",
        data: [vehicletype],
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

const GetVehicleDetails = async (req, res) => {
  try {
    const {ClientCode} = req.query;
    let whereClause = {};
    let result = [];
    if (req.user) {
      whereClause.ClientCode = req.user.ClientCode;
    }

    let vehicledetails = await VehicleDetails.findAll({
      where: whereClause,
    });

    if (vehicledetails) {
      vehicledetails?.map(async (item) => {
        let vehicleroutes = await VehicleRoute.findAll({
          where: {
            routeId: item?.routeId,
            ClientCode: req?.user?.ClientCode,
          },
          include: [
            {
              model: VehicleStop,
            },
          ],
          order: [["id", "DESC"]],
        });

        result.push({
          vehicledetails: item,
          vehicleroute: vehicleroutes,
        });
      });

      return respHandler.success(res, {
        status: true,
        msg: "Fetch All Vehicle Details successfully!!",
        data: result,
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

const DeleteVehicleDetails = async (req, res) => {
  try {
    const { id } = req.body;
    let vehicledetails = await VehicleDetails.findOne({ where: { id: id } });
    if (vehicledetails) {
      let status = await VehicleDetails.destroy({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      });
      if (status) {
        return respHandler.success(res, {
          status: true,
          data: [],
          msg: "Vehicle Details Deleted Successfully!!",
        });
      }
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
  CreateVehicleType,
  UpdateVehicleType,
  GetVehicleType,
  DeleteVehicleType,
  CreateRoute,
  UpdateRoute,
  GetRoute,
  DeleteRoute,
  CreateVehicleDetails,
  UpdateVehicleDetails,
  GetVehicleDetails,
  DeleteVehicleDetails,
};
