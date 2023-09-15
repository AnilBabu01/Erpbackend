const path = require("path");
const fs = require("fs");

const removefile = (file) => {
  if (fs.existsSync(`${file}`)) {
    fs.unlinkSync(`${file}`);
  }
  return true;
};
module.exports = removefile;
