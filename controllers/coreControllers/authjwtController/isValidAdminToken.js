const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');

const isValidAdminToken = async (erq, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token)
      return res.status(401).json({
        success: false,
        result: null,
        message: 'No authentication toke, authorization denied',
        jwtExpired: true,
      });

    const verified = jwt.verify(token, pro.env.JWT_SECRET);

    if (!verified)
      return res.status(401).json({
        success: false,
        result: null,
        message: 'Token verification failed, authorization denied',
        jwtExpired: true,
      });
    const admin = await Admin.findOne({ _id: verified.id, removed: false });

    if (!admin)
      return res.status(401).json({
        success: false,
        result: null,
        message: 'Admin does not exist, authorization denied',
        jwtExpired: true,
      });

    if (admin.isLoggedIn === 0)
      return res.status(401).json({
        success: false,
        result: null,
        message: 'Admin is already logged out try to login again, authorization denied',
        jwtExpired: true,
      });
    else {
      req.admin = admin;
      next();
    }
  } catch (error) {
    res.status(503).json({
      success: false,
      result: null,
      message: error.message,
      error: error,
    });
  }
};
module.exports = isValidAdminToken;
