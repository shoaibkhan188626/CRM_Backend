const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { slugify } = require("transliteration");
const fileFilter = require("./fileFilter");

const singleStorageUpload = ({
  entity,
  filename = "default",
  fileType = "default",
  fieldName = "file",
}) => {
  var diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `public/uploads/${entity}`);
    },
    filename: function (req, file, cb) {
      let fileExtension = path.extname(file.originalname);
      let uniqueFileID = Math.random().toString(36).slice(2, 7);

      let originalname = "";
      if (req.body.seotitle) {
        originalname = slugify(req.body.seotitle.toLocaleLowersCase());
      } else {
        originalname = slugify(
          file.originalname.split(".")[0].toLocaleLowerCase()
        );
      }

      let _fileName = `${originalname}-${uniqueFileID}${fileExtension}`;

      const filePath = `public/uploads/${entity}/${_fileName}`;
      req.upload = {
        filename: _fileName,
        fiedlExt: fileExtension,
        entity: entity,
        fieldName: fieldName,
        fileType: fileType,
        filePath: filePath,
      };
      req.body[fieldName] = filePath;
      return cb(null, _fileName);
    },
  });
  let filterType = fileFilter(fileType);
  const multerStorage = multer({
    storage: diskStorage,
    fileFilter: filterType,
  });
  return multerStorage;
};
module.exports = singleStorageUpload;
