const mongoose = require("mongoose");
const Model = mongoose.model("Setting");

const updateBySettingKey = async ({ settingKey, settingValue }) => {
  try {
    console.log(
      "🚀 ~ file: updateBySettingKey.js:8 ~ updateBySettingKey ~ settingKey:",
      settingKey
    );

    if (!settingKey || !settingValue) {
      return null;
    }

    const result = await Model.findOneAndUpdate(
      { settingKey },
      { settingValue },
      { new: true, runValidators: true }
    ).exec();

    if (!result) {
      return null;
    } else {
      return result;
    }
  } catch {
    return null;
  }
};

module.exports = updateBySettingKey;
