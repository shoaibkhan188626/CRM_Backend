const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { slugify } = require("transliteration");
const fileFilter = require("./fileFilter");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const modelName = req.params.model;
    fs.mkdir(`upload/${modelName}`, (error) => {
      return cb(null, `upload/${modelName}`);
    });
  },

  filename: function (req, file, cb) {
    let fileExtension = path.extname(file.originalname);
    let uniqueFileID = Math.random().toString(36).slice(2, 7);
    let originalname = slugify(
      file.originalname.split(".")[0].toLocaleLowerCase()
    );
    let _fileName = `${originalname}-${uniqueFileID}${fileExtension}`;
    let files = req?.upload?.files ?? [];
    const _data = {
      fileName: _fileName,
      fieldExt: fileExtension,
    };
    return cb(null, _fileName);
  },
});

const uploadMultipleToStorage = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = uploadMultipleToStorage;
