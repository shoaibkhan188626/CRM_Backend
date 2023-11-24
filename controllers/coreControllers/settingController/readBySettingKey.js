const mongoose = require("mongoose");
const Model = mongoose.model("Setting");

const readBySettingKey = async (req, res) => {
  try {
    const settingKey = req.params.settingKey || undefined;
    if (!settingKey) {
      return res.status(200).json({
        success: false,
        result: null,
        message: "No setting Key Provided",
      });
    }

    const result = await Model.findOne({ settingKey });

    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: "No document found by this setting key:" + settingKey,
      });
    } else {
      return res.status(200).json({
        success: true,
        result,
        message: "We Found this document by this setting key:" + settingKey,
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

module.exports = readBySettingKey;
