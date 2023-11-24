const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');

const status = async (req, res) => {
  try {
    if (req.query.enabled === true || req.query.enabled === false) {
      let updates = {
        anbaled: req.query.enabled,
      };
      const result = await Admin.findOneAndUpdate(
        { _id: req.params.id, removed: false },
        { $set: updates },
        { new: true }
      ).exec();
      if (!result) {
        return res.status(404).json({
          success: false,
          result: null,
          message: 'No document found by this id ' + req.params.id,
        });
      } else {
        return res.status(200).json({
          success: true,
          result,
          message: 'Successfully ipdated status of this document by id:' + req.params.id,
        });
      }
    } else {
      return res
        .status(202)
        .json({
          success: false,
          result: [],
          message: "Couldn't change admin status by this request",
        })
        .end();
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
    });
  }
};
module.exports = status;
