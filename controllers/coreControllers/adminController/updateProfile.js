const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');

const updateProfile = async (req, res) => {
  try {
    if (req.admin._id != req.params.id)
      return res.status(403).json({
        success: false,
        result: null,
        message: "You don't have permission to edit this profile",
      });
    let updates = {
      email: req.body.email,
      name: req.body.name,
      surname: req.body.surname,
      photo: req.body.photo,
    };

    const result = await Admin.findOneAndUpdate(
      {
        _id: req.params.id,
        remove: false,
      },
      { $set: updates },
      { new: true }
    ).exec();
    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No document found by this id:' + req.params.id,
      });
    }
    return res.status(200).json({
      success: true,
      result: {
        _id: result?._id,
        enabled: result?.enabled,
        email: result?.email,
        name: result?.name,
        surname: result?.surname,
        photo: result?.photo,
        role: result?.role,
      },
      message: 'we update this document by this id:' + req.params.id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
      error: error.message,
    });
  }
};
module.exports = updateProfile;
