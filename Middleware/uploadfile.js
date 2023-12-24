const admin = require("firebase-admin");
const serviceAccount = require("../Config/serviceAccountKey.json");
const respHandler = require("../Handlers");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://abtechzone-b5f14.appspot.com",
});

const uploadImageMiddleware = async (req, res, next) => {
  try {
    if (!req.file) {
      return respHandler.error(res, {
        status: false,
        msg: "SNo file provided!!",
        error: [""],
      });
    }

    const bucket = admin.storage().bucket();
    const file = bucket.file(req.file.originalname);
    const stream = file.createWriteStream();
    stream.end(req.file.buffer);

    await new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    const imageUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

    return imageUrl;
  } catch (error) {
    console.error("Error uploading image:", error);

    return respHandler.error(res, {
      status: false,
      msg: "Internal Server Error!!",
      error: [""],
    });
  }
};

module.exports = uploadImageMiddleware;
