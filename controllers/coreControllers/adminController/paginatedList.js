const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');

const paginatedList = async (req, res) => {
  const page = req.query.page || 1;
  const limit = parseInt(req.query.items) || 10;
  const skip = page * limit - limit;

  try {
    const resultsPromise = Admin.find({ removed: false })
      .skip(skip)
      .limit(limit)
      .sort({ created: 'desc' }).populate;

    const countPromise = Admin.count({ removed: false });
    const [result, count] = await Promise.all([resultsPromise, countPromise]);

    const pages = Math.ceil(count / limit);

    const pagination = { page, pages, count };
    if (count > 0) {
      for (let admin of result) {
        admin.password = undefined;
        admin.loggedSession = undefined;
      }
      return res.status(200).json({
        success: true,
        result,
        pagination,
        message: 'Successfully found all documents',
      });
    } else {
      return res.status(203).json({
        success: false,
        result: [],
        pagination,
        message: 'Collection is Empty',
      });
    }
  } catch (error) {
    return res.status(203).json({
      success: false,
      result: [],
      message: error.message,
      error,
    });
  }
};
module.exports = paginatedList;
