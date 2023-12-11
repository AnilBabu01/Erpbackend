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
const RoomCategory = require("../Models/roomcategory.model");
const Facility = require("../Models/roomfacility.model");
const RoomHostel = require("../Models/roomhostel.model");
const Room = require("../Models/room.model");
const Employee = require("../Models/employee.model");
const Student = require("../Models/student.model");
const RoomCheckin = require("../Models/roomcheckin.model");
const removefile = require("../Middleware/removefile");
config();

const CreateCategory = async (req, res) => {
  try {
    const { roomCategory } = req.body;

    let Rcoomcategory = await RoomCategory.findOne({
      where: {
        roomCategory: roomCategory,
        ClientCode: req.user.ClientCode,
      },
    });
    if (Rcoomcategory) {
      if (
        Rcoomcategory?.roomCategory?.toLowerCase() ===
        roomCategory.toLowerCase()
      ) {
        return respHandler.error(res, {
          status: false,
          msg: "AllReady Exist!!",
          error: ["AllReady Exsist !!"],
        });
      }
    }

    let roomCategorys = await RoomCategory.create({
      roomCategory: roomCategory,
      ClientCode: req.user.ClientCode,
    });
    if (roomCategorys) {
      return respHandler.success(res, {
        status: true,
        msg: "Hostel Category Added successfully!!",
        data: [roomCategorys],
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

const UpdateCategory = async (req, res) => {
  try {
    const { roomCategory, id } = req.body;

    let status = await RoomCategory.update(
      {
        roomCategory: roomCategory,
      },
      {
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      }
    );

    if (status) {
      let roomCategory = await RoomCategory.findOne({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      });
      return respHandler.success(res, {
        status: true,
        msg: "Room Category Updated successfully!!",
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

const GetCategory = async (req, res) => {
  try {
    const { categoryname } = req.query;
    let whereClause = {};

    if (req.user) {
      whereClause.ClientCode = req.user.ClientCode;
    }

    if (categoryname) {
      whereClause.roomCategory = { [Op.regexp]: `^${categoryname}.*` };
    }
    let roomCategory = await RoomCategory.findAll({
      where: whereClause,
    });
    if (roomCategory) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch All Room Category successfully!!",
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

const DeleteCategory = async (req, res) => {
  try {
    const { id } = req.body;
    let roomCategory = await RoomCategory.findOne({ where: { id: id } });
    if (roomCategory) {
      await RoomCategory.destroy({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      });
      return respHandler.success(res, {
        status: true,
        data: [],
        msg: "Room Category Deleted Successfully!!",
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

const CreateFacility = async (req, res) => {
  try {
    const { roomFacility } = req.body;

    let RoomFacility = await Facility.findOne({
      where: {
        roomFacility: roomFacility,
        ClientCode: req.user.ClientCode,
      },
    });
    if (RoomFacility) {
      if (
        RoomFacility?.roomFacility?.toLowerCase() === roomFacility.toLowerCase()
      ) {
        return respHandler.error(res, {
          status: false,
          msg: "AllReady Exist!!",
          error: ["AllReady Exsist !!"],
        });
      }
    }

    let roomFacilitys = await Facility.create({
      roomFacility: roomFacility,
      ClientCode: req.user.ClientCode,
    });
    if (roomFacilitys) {
      return respHandler.success(res, {
        status: true,
        msg: "Hostel Facility Added successfully!!",
        data: [roomFacilitys],
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

const UpdateFacility = async (req, res) => {
  try {
    const { roomFacility, id } = req.body;

    let status = await Facility.update(
      {
        roomFacility: roomFacility,
      },
      {
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      }
    );

    if (status) {
      let roomFacility = await Facility.findOne({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      });
      return respHandler.success(res, {
        status: true,
        msg: "Room Facility Updated successfully!!",
        data: [roomFacility],
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

const GetFacility = async (req, res) => {
  try {
    const { facilityname } = req.query;
    let whereClause = {};

    if (req.user) {
      whereClause.ClientCode = req.user.ClientCode;
    }

    if (facilityname) {
      whereClause.roomFacility = { [Op.regexp]: `^${facilityname}.*` };
    }
    let roomFacility = await Facility.findAll({
      where: whereClause,
    });
    if (roomFacility) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch All Room Facility successfully!!",
        data: roomFacility,
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

const DeleteFacility = async (req, res) => {
  try {
    const { id } = req.body;
    let roomFacility = await Facility.findOne({ where: { id: id } });
    if (roomFacility) {
      await Facility.destroy({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      });
      return respHandler.success(res, {
        status: true,
        data: [],
        msg: "Room Facility Deleted Successfully!!",
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

const CreateHostel = async (req, res) => {
  try {
    const { HostelName, DescripTion } = req.body;

    console.log("body params is ", req.body);

    let hostel = await RoomHostel.findOne({
      where: {
        HostelName: HostelName,
        DescripTion: DescripTion,
        ClientCode: req.user.ClientCode,
      },
    });
    if (hostel) {
      if (hostel?.HostelName?.toLowerCase() === HostelName.toLowerCase()) {
        return respHandler.error(res, {
          status: false,
          msg: "AllReady Exist!!",
          error: ["AllReady Exsist !!"],
        });
      }
    }

    let roomhostel = await RoomHostel.create({
      HostelName: HostelName,
      DescripTion: DescripTion,
      Hostelurl: req?.files?.Hostelurl
        ? `images/${req?.files?.Hostelurl[0]?.filename}`
        : "",
      ClientCode: req.user.ClientCode,
    });
    if (roomhostel) {
      return respHandler.success(res, {
        status: true,
        msg: "Hostel Added successfully!!",
        data: [roomhostel],
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

const UpdateHostel = async (req, res) => {
  try {
    const { HostelName, DescripTion, id } = req.body;
    let hostel = await RoomHostel.findOne({
      where: {
        id: id,
        ClientCode: req.user?.ClientCode,
      },
    });
    if (hostel) {
      if (req?.files?.Hostelurl) {
        removefile(`public/upload/${hostel?.Hostelurl?.substring(7)}`);
      }

      let status = await RoomHostel.update(
        {
          HostelName: HostelName,
          DescripTion: DescripTion,
          Hostelurl: req?.files?.Hostelurl
            ? `images/${req?.files?.Hostelurl[0]?.filename}`
            : req?.user?.Hostelurl,
        },
        {
          where: {
            id: id,
            ClientCode: req.user?.ClientCode,
          },
        }
      );

      if (status) {
        let roomHostel = await RoomHostel.findOne({
          where: {
            id: id,
            ClientCode: req.user?.ClientCode,
          },
        });
        return respHandler.success(res, {
          status: true,
          msg: "Hostel Updated successfully!!",
          data: [roomHostel],
        });
      } else {
        return respHandler.error(res, {
          status: false,
          msg: "Something Went Wrong!!",
          error: [err.message],
        });
      }
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

const GetHostel = async (req, res) => {
  try {
    const { courseorclass } = req.query;
    let whereClause = {};

    console.log("values is ", req.query);

    if (req.user) {
      whereClause.ClientCode = req.user.ClientCode;
    }

    if (courseorclass) {
      whereClause.HostelName = { [Op.regexp]: `^${courseorclass}.*` };
    }

    let hostel = await RoomHostel.findAll({
      where: whereClause,
    });
    if (hostel) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch All Hostel Successfully!!",
        data: hostel,
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

const DeleteHostel = async (req, res) => {
  try {
    const { id } = req.body;

    console.log("delete id is ", id);

    let hostel = await RoomHostel.findOne({
      where: { id: id, ClientCode: req.user?.ClientCode },
    });
    if (hostel) {
      if (req?.files?.Hostelurl) {
        removefile(`public/upload/${hostel?.Hostelurl?.substring(7)}`);
      }
      let status = await RoomHostel.destroy({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      });
      if (status) {
        return respHandler.success(res, {
          status: true,
          data: [],
          msg: "Hostel Deleted Successfully!!",
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

const CreateRoom = async (req, res) => {
  try {
    const {
      HostelName,
      Category,
      Facility,
      FromRoom,
      ToRoom,
      PermonthFee,
      hostelId,
      CategoryId,
      FacilityId,
    } = req.body;

    let hostel = await Room.findOne({
      where: {
        HostelName: HostelName,
        hostelId: hostelId,
        CategoryId: CategoryId,
        FromRoom: FromRoom,
        ToRoom: ToRoom,
        PermonthFee: PermonthFee,
        ClientCode: req.user.ClientCode,
      },
    });
    if (hostel) {
      return respHandler.error(res, {
        status: false,
        msg: "AllReady Exist!!",
        error: ["AllReady Exsist !!"],
      });
    }

    let rooms = await Room.create({
      hostelname: HostelName,
      Category: Category,
      Facility: Facility,
      hostelId: hostelId,
      CategoryId: CategoryId,
      FacilityId: FacilityId,
      FromRoom: FromRoom,
      ToRoom: ToRoom,
      PermonthFee: PermonthFee,
      ClientCode: req.user.ClientCode,
    });
    if (rooms) {
      return respHandler.success(res, {
        status: true,
        msg: "Room Added successfully!!",
        data: [rooms],
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

const UpdateRoom = async (req, res) => {
  try {
    const {
      HostelName,
      Category,
      Facility,
      FromRoom,
      ToRoom,
      PermonthFee,
      id,
      hostelId,
      CategoryId,
      FacilityId,
    } = req.body;

    let status = await Room.update(
      {
        hostelname: HostelName,
        Category: Category,
        Facility: Facility,
        hostelId: hostelId,
        CategoryId: CategoryId,
        FacilityId: FacilityId,
        FromRoom: Number(FromRoom),
        ToRoom: Number(ToRoom),
        PermonthFee: Number(PermonthFee),
      },
      {
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      }
    );

    if (status) {
      let roomHostel = await Room.findOne({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      });
      return respHandler.success(res, {
        status: true,
        msg: "Room Updated successfully!!",
        data: [roomHostel],
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

const GetRoom = async (req, res) => {
  try {
    const { hostelname } = req.query;
    let whereClause = {};

    if (req.user) {
      whereClause.ClientCode = req.user.ClientCode;
    }
    if (hostelname) {
      whereClause.hostelname = hostelname;
    }
    let Rooms = await Room.findAll({
      where: whereClause,
    });
    if (Rooms) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch All Room Successfully!!",
        data: Rooms,
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

const DeleteRoom = async (req, res) => {
  try {
    const { id } = req.body;
    let room = await Room.findOne({ where: { id: id } });
    if (room) {
      await Room.destroy({
        where: {
          id: id,
          ClientCode: req.user?.ClientCode,
        },
      });
      return respHandler.success(res, {
        status: true,
        data: [],
        msg: "Room Deleted Successfully!!",
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

const GetHostelFee = async (req, res) => {
  try {
    const { hostelname, Category, Facility } = req.query;
    let whereClause = {};

    if (req.user) {
      whereClause.ClientCode = req.user.ClientCode;
    }
    if (hostelname) {
      whereClause.hostelname = { [Op.regexp]: `^${hostelname}.*` };
    }
    if (Category) {
      whereClause.Category = { [Op.regexp]: `^${Category}.*` };
    }
    if (Facility) {
      whereClause.Facility = { [Op.regexp]: `^${Facility}.*` };
    }

    let Roomrent = await Room.findOne({
      where: whereClause,
    });
    if (Roomrent) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch Room Rent successfully!!",
        data: Roomrent,
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

const CheckAvailability = async (req, res) => {
  try {
    const { hostelname, Category } = req.body;

    const [results] = await sequelizes.query(
      `SELECT roominhostels.*, hostels.Hostelurl AS HostelIMG FROM roominhostels JOIN hostels ON roominhostels.hostelId = hostels.id WHERE roominhostels.hostelId LIKE '%${hostelname}%' AND roominhostels.CategoryId = '${Category}';`
    );

    let facilitiesCategory = results?.map((facility) => {
      facility.FacilityId = JSON.parse(JSON.parse(facility.FacilityId));
      facility.CategoryId = JSON.parse(JSON.parse(facility.CategoryId));
      return facility;
    });

    await Promise.all(
      facilitiesCategory.map(async (facility) => {
        const categories = await RoomCategory.findAll({
          where: {
            id: facility.CategoryId,
            ClientCode: req.user.ClientCode,
          },
        });

        facility.category_name = categories.map(
          (category) => category.roomCategory
        );

        const facilities = await Facility.findAll({
          where: {
            id: facility.FacilityId,
            ClientCode: req.user.ClientCode,
          },
        });

        facility.facility_name = facilities.map(
          (facility) => facility.roomFacility
        );

        const hostel = await RoomHostel.findOne({
          where: {
            id: facility.hostelId,
            ClientCode: req.user.ClientCode,
          },
        });
        facility.hostel = hostel;
      })
    );

    const roomRanges = facilitiesCategory.map((room) => ({
      from: room.FromRoom,
      to: room.ToRoom,
      ...room,
    }));

    const allRoomNumbers = roomRanges.reduce((result, range) => {
      const rangeNumbers = Array.from(
        { length: range.to - range.from + 1 },
        (_, i) => i + range.from
      );
      return [...result, ...rangeNumbers];
    }, []);

    const occupiedRooms = await RoomCheckin.findAll({
      where: {
        hostelId: hostelname,
        Status: true,
        ClientCode: req.user.ClientCode,
      },
    });
    ///get room only
    const occupiedRoomNumbers = occupiedRooms.map((room) => room.RoomNo);

    const availableRooms = roomRanges.reduce((result, range) => {
      const rangeNumbers = Array.from(
        { length: range.to - range.from + 1 },
        (_, i) => i + range.from
      );

      const availableNumbers = rangeNumbers.filter(
        (number) => !occupiedRoomNumbers.includes(number)
      );
      console.log("availableroom", availableNumbers);

      return [
        ...result,
        ...availableNumbers.map((number) => ({
          ...range,
          RoomNo: number,
        })),
      ];
    }, []);

    if (availableRooms) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch Rooms successfully!!",
        data: availableRooms,
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

const CheckinRoom = async (req, res) => {
  try {
    const { roomdetails, studentdetails } = req.body;

    let ischeckin = await RoomCheckin.findOne({
      where: {
        Status: 1,
        StudentName: studentdetails?.name,
        SNO: studentdetails?.SrNumber,
        Section: studentdetails?.Section,
        Session: studentdetails?.Session,
        ClientCode: req.user.ClientCode,
      },
    });
    if (ischeckin) {
      return respHandler.error(res, {
        status: false,
        msg: "AlReady Room Checkin Exist!!",
        error: ["AllReady Exsist !!"],
      });
    }

    let checkin = await RoomCheckin.create({
      CheckinDate: new Date(),
      hostelname: roomdetails?.hostelname,
      Category: roomdetails?.Category,
      Facility: roomdetails?.Facility,
      hostelId: roomdetails?.hostelId,
      CategoryId: roomdetails?.CategoryId,
      FacilityId: roomdetails?.FacilityId,
      RoomNo: roomdetails?.RoomNo,
      StudentId: studentdetails?.id,
      ParentId: studentdetails?.parentId,
      StudentClass: studentdetails?.courseorclass,
      StudentName: studentdetails?.name,
      SNO: studentdetails?.SrNumber,
      Section: studentdetails?.Section,
      Session: studentdetails?.Session,
      MobileNO: studentdetails?.phoneno1,
      ClientCode: req.user.ClientCode,
    });
    if (checkin) {
      return respHandler.success(res, {
        status: true,
        msg: "Room Checkin Successfully!!",
        data: checkin,
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

const GetCheckingRoom = async (req, res) => {
  try {
    const { StudentId } = req.body;

    let Checkin = await RoomCheckin.findOne({
      where: {
        Status: 1,
        StudentId: StudentId,
        ClientCode: req.user.ClientCode,
      },
    });
    if (Checkin) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch Checkin Details Successfully!!",
        data: Checkin,
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

const UpdateCheckinRoom = async (req, res) => {
  try {
    const { roomdetails, studentdetails, CheckinId } = req.body;

    let ischeckin = await RoomCheckin.findOne({
      where: {
        Status: 1,
        StudentName: studentdetails?.name,
        SNO: studentdetails?.SrNumber,
        Section: studentdetails?.Section,
        Session: studentdetails?.Session,
        ClientCode: req.user.ClientCode,
      },
    });
    if (ischeckin) {
      let result = await RoomCheckin.update(
        {
          CheckinDate: new Date(),
          hostelname: roomdetails?.hostelname,
          Category: roomdetails?.Category,
          Facility: roomdetails?.Facility,
          hostelId: roomdetails?.hostelId,
          CategoryId: roomdetails?.CategoryId,
          FacilityId: roomdetails?.FacilityId,
          RoomNo: roomdetails?.RoomNo,
          StudentId: studentdetails?.id,
          ParentId: studentdetails?.parentId,
          StudentClass: studentdetails?.courseorclass,
          StudentName: studentdetails?.name,
          SNO: studentdetails?.SrNumber,
          Section: studentdetails?.Section,
          Session: studentdetails?.Session,
          MobileNO: studentdetails?.phoneno1,
          ClientCode: req.user.ClientCode,
        },
        {
          where: {
            id: CheckinId,
            ClientCode: req.user?.ClientCode,
          },
        }
      );

      if (result) {
        return respHandler.success(res, {
          status: true,
          msg: "Room Shift Successfully!!",
          data: [""],
        });
      }
    } else {
      return respHandler.error(res, {
        status: false,
        msg: "Room Shift Possible After Checkin!!",
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

const GetAllCheckin = async (req, res) => {
  try {
    const {
      sessionname,
      sectionname,
      sno,
      checkinstatus,
      scoursename,
      hostelname,
    } = req.body;
    let whereClause = {};
    let newstatue = checkinstatus
      ? checkinstatus === "true"
        ? true
        : false
      : true;
    if (req.user) {
      whereClause.ClientCode = req.user.ClientCode;
    }
    if (sessionname) {
      whereClause.Session = { [Op.regexp]: `^${sessionname}.*` };
    }
    if (sno) {
      whereClause.SNO = { [Op.regexp]: `^${sno}.*` };
    }
    if (checkinstatus) {
      whereClause.Status = newstatue;
    }
    if (scoursename) {
      whereClause.StudentClass = scoursename;
    }
    if (sectionname) {
      whereClause.Section = { [Op.regexp]: `^${sectionname}.*` };
    }

    if (hostelname) {
      whereClause.hostelname = { [Op.regexp]: `^${hostelname}.*` };
    }
    let Checkins = await RoomCheckin.findAll({
      where: whereClause,
    });
    if (Checkins) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch Checkin Successfully!!",
        data: Checkins,
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

const ReleaseRoom = async (req, res) => {
  try {
    const { id } = req.body;

    let ischeckin = await RoomCheckin.findOne({
      where: {
        Status: 1,
        id: id,
        ClientCode: req.user.ClientCode,
      },
    });
    if (ischeckin) {
      let result = await RoomCheckin.update(
        {
          Status: 0,
        },
        {
          where: {
            id: id,
            ClientCode: req.user?.ClientCode,
          },
        }
      );

      if (result) {
        return respHandler.success(res, {
          status: true,
          msg: "Room Release Successfully!!",
          data: [""],
        });
      }
    } else {
      return respHandler.error(res, {
        status: false,
        msg: "Something Went Wrong!!",
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

const GetOccupiedRoom = async (req, res) => {
  try {
    const { Category, hostelname, sessionname, fromdate, todate } = req.body;
    let whereClause = {};
    let from = new Date(fromdate);
    let to = new Date(todate);
    if (req.user) {
      whereClause.ClientCode = req.user.ClientCode;
    }

    if (fromdate && todate) {
      whereClause.CheckinDate	 = { [Op.between]: [from, to] };
    }

    if (Category) {
      whereClause.Category = { [Op.regexp]: `^${Category}.*` };
    }

    if (hostelname) {
      whereClause.hostelname = { [Op.regexp]: `^${hostelname}.*` };
    }

    if (sessionname) {
      whereClause.Session = { [Op.regexp]: `^${sessionname}.*` };
    }

    let OccupiedRooms = await RoomCheckin.findAll({
      where: whereClause,
    });
    if (OccupiedRooms) {
      return respHandler.success(res, {
        status: true,
        msg: "Fetch All Occupied Rooms Successfully!!",
        data: OccupiedRooms,
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
  CreateCategory,
  UpdateCategory,
  GetCategory,
  DeleteCategory,
  CreateFacility,
  UpdateFacility,
  GetFacility,
  DeleteFacility,
  CreateHostel,
  UpdateHostel,
  GetHostel,
  DeleteHostel,
  CreateRoom,
  UpdateRoom,
  GetRoom,
  DeleteRoom,
  GetHostelFee,
  CheckAvailability,
  CheckinRoom,
  GetCheckingRoom,
  UpdateCheckinRoom,
  GetAllCheckin,
  ReleaseRoom,
  GetOccupiedRoom,
};
