const mongoose = require("mongoose");
const Model = mongoose.model("Settings");

const increaseBySettingKey = async ({ settingKey }) => {
  try {
    if (!settingKey) {
      return null;
    }

    const result = await Model.findOneAndUpdate(
      { settingKey },
      {
        $inc: { settingValue: 1 },
      },
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
module.exports = increaseBySettingKey;
