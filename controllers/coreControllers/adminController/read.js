const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');

const read = async (req, res) => {
  try {
    const tmpResult = await Admin.findOne({
      _id: req.params.id,
      removed: false,
    });
    if (!tmpResult) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No Document found by this id:' + req.params.id,
      });
    } else {
      let result = {
        _id: tmpResult.id,
        enabled: tmpResult.enabled,
        email: tmpResult.email,
        name: tmpResult.name,
        surname: tmpResult.surname,
        photo: tmpResult.photo,
        role: tmpResult.role,
      };
      return res.status(200).json({
        success: true,
        result,
        message: 'we found this document by this id' + req.params.id,
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
module.exports = read;
