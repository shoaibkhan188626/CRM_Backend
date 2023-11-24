const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');

const remove = async (req, res) => {
  try {
    let updates = {
      removed: true,
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
        message: 'No document found by this id:' + req.params.id,
      });
    } else {
      return res.status(200).json({
        success: true,
        result,
        message: 'Successfully Deleted the document by this id :' + req.params.id,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
      error,
    });
  }
};
module.exports = remove;
