const { sequelize, QueryTypes, Op, where, literal } = require("sequelize");
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
    const { Vehicletype } = req.query;
    let whereClause = {};
    console.log("ndsxdc", Vehicletype);
    if (req.user) {
      whereClause.ClientCode = req.user.ClientCode;
    }
    if (Vehicletype) {
      whereClause.Vahicletype = Vehicletype;
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
    const { FromRoute, ToRoute, BusRentPermonth, stopslist } = req.body;
    let result = [];
    let check = await VehicleRoute.findOne({
      where: {
        FromRoute: FromRoute,
        ToRoute: ToRoute,
        ClientCode: req.user.ClientCode,
      },
    });
    if (check) {
      return respHandler.error(res, {
        status: false,
        msg: "Already Exist!!",
        error: [""],
      });
    } else {
      let vehicleroute = await VehicleRoute.create({
        FromRoute: FromRoute,
        ToRoute: ToRoute,
        ClientCode: req.user.ClientCode,
        BusRentPermonth: BusRentPermonth,
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
          let vehicleroutes = await VehicleRoute.findOne({
            where: {
              id: vehicleroute?.id,
              ClientCode: req?.user?.ClientCode,
            },
          });

          if (vehicleroutes) {
            let stops = await VehicleStop.findAll({
              where: {
                ClientCode: req?.user?.ClientCode,
                RouteId: vehicleroutes?.id,
              },
            });

            if (stops) {
              result.push({
                routeName: stops,
                StopName: stops,
              });
            }

            return respHandler.success(res, {
              status: true,
              msg: "Routes Added successfully!!",
              data: result,
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
    const { FromRoute, ToRoute, BusRentPermonth, stopslist, id } = req.body;
    let resultdata = [];
    let vehicleroute = await VehicleRoute.findOne({
      where: {
        id: id,
        ClientCode: req.user?.ClientCode,
      },
    });

    if (vehicleroute) {
      let result = await VehicleRoute.update(
        {
          FromRoute: FromRoute,
          ToRoute: ToRoute,
          BusRentPermonth: BusRentPermonth,
        },
        {
          where: {
            id: id,
            ClientCode: req.user?.ClientCode,
          },
        }
      );
      if (result) {
        const promises = stopslist?.map(async (item) => {
          let result;
          const [stop, created] = await VehicleStop.findOrCreate({
            where: {
              RouteId: id,
              ClientCode: req.user.ClientCode,
            },
            defaults: {
              RouteId: id,
              StopName: item?.StopName,
              StopStatus: item?.StopStatus,
              ClientCode: req.user.ClientCode,
            },
          });
          if (stop) {
            result = await stop.update({
              StopName: item?.StopName,
              StopStatus: item?.StopStatus,
              ClientCode: req.user.ClientCode,
            });
          }
          return result;
        });

        if (await Promise.all(promises)) {
          let vehicleroutes = await VehicleRoute.findOne({
            where: {
              id: id,
              ClientCode: req?.user?.ClientCode,
            },
          });

          if (vehicleroutes) {
            let stops = await VehicleStop.findAll({
              where: {
                ClientCode: req?.user?.ClientCode,
                RouteId: vehicleroutes?.id,
              },
            });

            if (stops) {
              resultdata.push({
                routeName: vehicleroutes,
                StopName: stops,
              });
            }
            return respHandler.success(res, {
              status: true,
              msg: "Route Updated successfully!!",
              data: resultdata,
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
    const { stopName } = req.query;
    let whereClause = {};
    let result = [];
    if (req?.user) {
      whereClause.ClientCode = req.user.ClientCode;
    }
    if (stopName) {
      whereClause.FromRoute = { [Op.regexp]: `^${stopName}.*` };
    }

    let vehicleroutes = await VehicleRoute.findAll({
      where: {
        ClientCode: req?.user?.ClientCode,
      },
    });

    if (vehicleroutes) {
      const promises = vehicleroutes?.map(async (item) => {
        let stops = await VehicleStop.findAll({
          where: {
            ClientCode: req?.user?.ClientCode,
            RouteId: item?.id,
          },
        });

        if (stops) {
          result.push({
            routeName: item,
            StopName: stops,
          });
        }
      });

      if (await Promise.all(promises)) {
        return respHandler.success(res, {
          status: true,
          msg: "Fetch All Route successfully!!",
          data: result,
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

const DeleteRoute = async (req, res) => {
  try {
    const { id } = req.body;
    let vehicleroute = await VehicleRoute.findOne({ where: { id: id } });
    if (vehicleroute) {
      let allstops = await VehicleStop.findAll({
        id: vehicleroute?.id,
        ClientCode: req.user?.ClientCode,
      });

      const promises = allstops?.map(async (item) => {
        let result = await VehicleStop.destroy({
          where: {
            id: item?.id,
            ClientCode: req.user?.ClientCode,
          },
        });
        return result;
      });

      if (await Promise.all(promises)) {
        await VehicleRoute.destroy({
          where: {
            id: id,
            ClientCode: req.user?.ClientCode,
          },
        });
        return respHandler.success(res, {
          status: true,
          data: [],
          msg: "Route Deleted Successfully!!",
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

const CreateVehicleDetails = async (req, res) => {
  try {
    const {
      Vahicletype,
      BusNumber,
      FualType,
      Color,
      GPSDeviceURL,
      routeId,
      NoOfSheets,
      DriverId1,
      DriverId2,
      HelferId1,
      HelferId2,
    } = req.body;

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
          msg: "AlReady Exist!!",
          error: ["AlReady Exsist !!"],
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
      NoOfSheets: NoOfSheets,
      RealSheets: NoOfSheets,
      DriverId1: DriverId1,
      DriverId2: DriverId2,
      HelferId1: HelferId1,
      HelferId2: HelferId2,
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
    const {
      routeId,
      Vahicletype,
      BusNumber,
      FualType,
      Color,
      GPSDeviceURL,
      id,
      NoOfSheets,
      DriverId1,
      DriverId2,
      HelferId1,
      HelferId2,
    } = req.body;

    let status = await VehicleDetails.update(
      {
        routeId: routeId,
        Vahicletype: Vahicletype,
        BusNumber: BusNumber,
        FualType: FualType,
        Color: Color,
        GPSDeviceURL: GPSDeviceURL,
        NoOfSheets: NoOfSheets,
        RealSheets: NoOfSheets,
        DriverId1: DriverId1,
        DriverId2: DriverId2,
        HelferId1: HelferId1,
        HelferId2: HelferId2,
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
    const { BusNumber } = req.query;
    let whereClause = {};
    let result = [];
    if (req.user) {
      whereClause.ClientCode = req.user.ClientCode;
    }
    if (BusNumber) {
      whereClause.BusNumber = { [Op.regexp]: `^${BusNumber}.*` };
    }

    let vehicledetails = await VehicleDetails.findAll({
      where: whereClause,
    });

    if (vehicledetails) {
      const promises = vehicledetails?.map(async (item) => {
        let routeDetails = await VehicleRoute.findOne({
          where: {
            id: item?.routeId,
            ClientCode: req.user.ClientCode,
          },
        });
        let StopNames = await VehicleStop.findAll({
          where: {
            RouteId: item?.routeId,
            ClientCode: req.user.ClientCode,
          },
        });
        if (routeDetails || StopNames) {
          result.push({
            bus: item,
            routeDetails: routeDetails,
            StopNames: StopNames,
          });
        }
        return StopNames;
      });

      if (await Promise.all(promises)) {
        return respHandler.success(res, {
          status: true,
          msg: "Fetch All Vehicle Details successfully!!",
          data: result,
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

const GetTransportFee = async (req, res) => {
  try {
    const { FromRoute, ToRoute } = req.body;

    let whereClause = {};

    if (req.user) {
      whereClause.ClientCode = req.user?.ClientCode;
    }
    if (FromRoute) {
      whereClause.FromRoute = FromRoute;
    }

    if (ToRoute) {
      whereClause.ToRoute = ToRoute;
    }

    let vehicleroute = await VehicleRoute.findOne({
      where: whereClause,
    });

    if (vehicleroute) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch Bus Fee Successfully!!",
        data: vehicleroute,
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

const GetVehicleList = async (req, res) => {
  try {
    const { FromRoute, ToRoute } = req.query;
    let whereClause = {};
    let result = [];

    let vehicleroute = VehicleRoute.findOne({
      where: {
        FromRoute: FromRoute,
        ToRoute: ToRoute,
        ClientCode: req.user.ClientCode,
      },
    });

    if (vehicleroute) {
      if (req.user) {
        whereClause.ClientCode = req.user.ClientCode;
        whereClause.routeId = vehicleroute?.routeId;
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
          msg: "Fetch All Bus successfully!!",
          data: result,
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

const GetBusListByRouteID = async (req, res) => {
  try {
    const { routeid } = req.body;

    let result = [];

    let vehicledetails = await VehicleDetails.findAll({
      where: {
        ClientCode: req.user.ClientCode,
        routeId: routeid,
      },
    });

    if (vehicledetails) {
      const promises = vehicledetails?.map(async (item) => {
        let routeDetails = await VehicleRoute.findOne({
          where: {
            id: item?.routeId,
            ClientCode: req.user.ClientCode,
          },
        });
        let StopNames = await VehicleStop.findAll({
          where: {
            RouteId: item?.routeId,
            ClientCode: req.user.ClientCode,
          },
        });
        if (routeDetails || StopNames) {
          result.push({
            bus: item,
            routeDetails: routeDetails,
            StopNames: StopNames,
          });
        }
        return StopNames;
      });

      if (await Promise.all(promises)) {
        return respHandler.success(res, {
          status: true,
          msg: "Fetch Bus Successfully!!",
          data: result,
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

const GiveBusToStudent = async (req, res) => {
  try {
    const { studentid, busdetails, fromroute, toroute } = req.body;

    let isStudent = await Student.findOne({
      where: {
        ClientCode: req.user.ClientCode,
        id: studentid,
      },
    });

    if (isStudent) {
      if (isStudent?.BusNumber === "") {
        return respHandler.error(res, {
          status: false,
          msg: "Already Assigned Bus!!",
          error: [""],
        });
      }
      let status = await Student.update(
        {
          BusNumber: busdetails?.BusNumber,
          FromRoute: fromroute,
          ToRoute: toroute,
        },
        {
          where: {
            id: isStudent?.id,
            ClientCode: req.user?.ClientCode,
          },
        }
      );
      if (status) {
        let Busdetails = await VehicleDetails.findOne({
          where: {
            id: busdetails?.id,
          },
        });
        if (Busdetails) {
          let status = await VehicleDetails.update(
            {
              NoOfSheets: Number(Busdetails?.NoOfSheets) - 1,
            },
            {
              where: {
                id: Busdetails?.id,
                ClientCode: req.user?.ClientCode,
              },
            }
          );
          if (status) {
            return respHandler.success(res, {
              status: true,
              msg: "Bus Assign Successfully!!",
              data: "",
            });
          }
        } else {
          return respHandler.error(res, {
            status: false,
            msg: "Bus Not Found!!",
            error: [""],
          });
        }
      }
    } else {
      return respHandler.error(res, {
        status: false,
        msg: "Student Not Found!!",
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

const ChangeBus = async (req, res) => {
  try {
    const { studentid, busdetails, cfromroute, ctoroute, oldbusId, removeBus } =
      req.body;

    let isStudent = await Student.findOne({
      where: {
        ClientCode: req.user.ClientCode,
        id: studentid,
      },
    });

    if (isStudent) {
      if (removeBus) {
        let Busdetails = await VehicleDetails.findOne({
          where: {
            BusNumber: oldbusId,
            ClientCode: req.user?.ClientCode,
          },
        });

        if (Busdetails) {
          let status = await VehicleDetails.update(
            {
              NoOfSheets: Number(Busdetails?.NoOfSheets) + 1,
            },
            {
              where: {
                id: Busdetails?.id,
                ClientCode: req.user?.ClientCode,
              },
            }
          );
          if (status) {
            let status = await Student.update(
              {
                BusNumber: "",
                FromRoute: "",
                ToRoute: "",
              },
              {
                where: {
                  id: isStudent?.id,
                  ClientCode: req.user?.ClientCode,
                },
              }
            );
            if (status) {
              return respHandler.success(res, {
                status: true,
                msg: "Bus Remove Successfully!!",
                data: "",
              });
            }
          }
        }
      } else {
        let status = await Student.update(
          {
            BusNumber: busdetails?.BusNumber,
            FromRoute: cfromroute,
            ToRoute: ctoroute,
          },
          {
            where: {
              id: isStudent?.id,
              ClientCode: req.user?.ClientCode,
            },
          }
        );
        if (status) {
          if (oldbusId) {
            let oldbus = await VehicleDetails.findOne({
              where: {
                BusNumber: oldbusId,
                ClientCode: req.user?.ClientCode,
              },
            });

            if (oldbus) {
              let status = await VehicleDetails.update(
                {
                  NoOfSheets: Number(oldbus?.NoOfSheets) + 1,
                },
                {
                  where: { id: oldbus?.id, ClientCode: req.user?.ClientCode },
                }
              );

              if (status) {
                let Busdetails = await VehicleDetails.findOne({
                  where: {
                    id: busdetails?.id,
                    ClientCode: req.user?.ClientCode,
                  },
                });

                if (Busdetails) {
                  let status = await VehicleDetails.update(
                    {
                      NoOfSheets: Number(Busdetails?.NoOfSheets) - 1,
                    },
                    {
                      where: {
                        id: Busdetails?.id,
                        ClientCode: req.user?.ClientCode,
                      },
                    }
                  );
                  if (status) {
                    return respHandler.success(res, {
                      status: true,
                      msg: "Bus Changed Successfully!!",
                      data: "",
                    });
                  }
                } else {
                  return respHandler.error(res, {
                    status: false,
                    msg: "Bus Not Found!!",
                    error: [""],
                  });
                }
              }
            }
          } else {
            let Busdetails = await VehicleDetails.findOne({
              where: {
                id: busdetails?.id,
                ClientCode: req.user?.ClientCode,
              },
            });

            if (Busdetails) {
              let status = await VehicleDetails.update(
                {
                  NoOfSheets: Number(Busdetails?.NoOfSheets) - 1,
                },
                {
                  where: {
                    id: Busdetails?.id,
                    ClientCode: req.user?.ClientCode,
                  },
                }
              );
              if (status) {
                return respHandler.success(res, {
                  status: true,
                  msg: "Bus Changed Successfully!!",
                  data: "",
                });
              }
            } else {
              return respHandler.error(res, {
                status: false,
                msg: "Bus Not Found!!",
                error: [""],
              });
            }
          }
        }
      }
    } else {
      return respHandler.error(res, {
        status: false,
        msg: "Student Not Found!!",
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

const GetVehicleStudent = async (req, res) => {
  try {
    const { busno, sessionname } = req.body;
    let whereClause = {};

    if (req.user) {
      whereClause.ClientCode = req.user.ClientCode;
    }
    if (sessionname) {
      whereClause.Session = sessionname;
    }
    if (busno) {
      whereClause.BusNumber = busno;
    }
    let VehicleStudent = await Student.findAll({
      where: whereClause,
    });
    if (VehicleStudent) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch Student List Successfully!!",
        data: VehicleStudent,
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

const GetStudentBus = async (req, res) => {
  try {
    let result = [];

    let vehicledetails = await VehicleDetails.findOne({
      where: {
        BusNumber: req?.user?.BusNumber,
        ClientCode: req?.user?.ClientCode,
      },
    });

    if (vehicledetails) {
      let vehicleroutes = await VehicleRoute.findOne({
        where: {
          id: vehicledetails?.routeId,
          ClientCode: req?.user?.ClientCode,
        },
      });
      if (vehicleroutes) {
        let stops = await VehicleStop.findAll({
          RouteId: vehicleroutes?.routeId,
          ClientCode: req?.user?.ClientCode,
        });

        let Driver1 = await Employee.findOne({
          where: {
            id: vehicledetails?.DriverId1,
            ClientCode: req?.user?.ClientCode,
          },
        });

        let Driver2 = await Employee.findOne({
          where: {
            id: vehicledetails?.DriverId2,
            ClientCode: req?.user?.ClientCode,
          },
        });

        let Helfer1 = await Employee.findOne({
          where: {
            id: vehicledetails?.HelferId1,
            ClientCode: req?.user?.ClientCode,
          },
        });

        let Helfer2 = await Employee.findOne({
          where: {
            id: vehicledetails?.HelferId2,
            ClientCode: req?.user?.ClientCode,
          },
        });

        if (
          vehicleroutes &&
          Driver1 &&
          Driver1 &&
          Helfer1 &&
          Helfer2 &&
          stops
        ) {
          result.push({
            vehicledetails: vehicledetails,
            vehicleroute: vehicleroutes,
            stops: stops,
            Driver1: Driver1,
            Driver2: Driver2,
            Helfer1: Helfer1,
            Helfer2: Helfer2,
          });

          return respHandler.success(res, {
            status: true,
            msg: "Fetch Bus Details successfully!!",
            data: result,
          });
        }
      }
    } else {
      return respHandler.error(res, {
        status: false,
        msg: "Don't Assigned Bus Yet!!",
        error: [],
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
  GetVehicleList,
  GetTransportFee,
  GetBusListByRouteID,
  GiveBusToStudent,
  ChangeBus,
  GetVehicleStudent,
  GetStudentBus,
};
