const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');

const profile = async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(404).json({
        success: false,
        result: null,
        message: "couldn't found admin Profile",
      });
    }
    let result = {
      _id: req.admin._id,
      email: req.admin.email,
      name: req.admin.name,
      surname: req.admin.surname,
      photo: req.admin.photo,
      role: req.admin.role,
    };
    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully fpund profile',
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      result: null,
      message: error.message,
      error,
    });
  }
};
module.exports = profile;
