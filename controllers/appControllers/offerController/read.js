const mongoose = require("mongoose");
const Model = mongoose.model("Offer");

const read = async (req, res) => {
  try {
    const result = await Model.findOne({
      _id: req.params.id,
      removed: false,
    }).populate("createdBy", "name");

    if (!result) {
      return res.status(404).json({
        success: true,
        result: null,
        message: "No Document found by this id" + req.params.id,
      });
    } else {
      return res.status(200).json({
        success: true,
        result,
        message: "We found thi document by this id:" + req.params.id,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
      error: error,
    });
  }
};

module.exports = read;
