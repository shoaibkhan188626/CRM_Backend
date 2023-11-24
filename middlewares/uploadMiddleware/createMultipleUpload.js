const Upload = require("@/models/coredModels/Upload");
const { model } = require("mongoose");

const createMultipleUpload = async (req, res, next) => {
  const modelName = req.params.model;
  const fieldId = req.params.fieldId;
  const ispublic = req.query.ispublic == true ? true : false;
  const userID = req.admin._id;

  if (req?.upload?.files?.length !== 0) {
    let filesArr = req.upload.files;
    let _uploadsArray = [];

    filesArr.forEach((uploadItem) => {
      let uploadObject = {
        modelName: modelName,
        fieldId: fieldId,
        fileName: uploadItem.fileName,
        fileType: uploadItem.fieldExt.slice(1),
        enabled: true,
        ispublic: ispublic,
        userID: userID,
        isSecure: true,
        removed: false,
        path: `/upload/${modelName}/${uploadItem.fileName}${uploadItem.fieldExt}`,
      };
      _uploadsArray.push(uploadObject);
    });
    try {
      const upload = await Upload.insertMany(_uploadsArray);
      if (upload?.length !== 0) {
        next();
      } else {
        return res.status(500).json({ success: false, message: error.message });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};
module.exports = createMultipleUpload;
