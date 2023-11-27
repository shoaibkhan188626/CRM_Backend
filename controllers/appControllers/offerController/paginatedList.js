const mongoose = require("mongoose");
const Model = mongoose.model("Offer");

const paginatedList = async (req, res) => {
  const page = req.query.page || 1;
  const limit = parseInt(req.query.items) || 10;
  const skip = page * limit - limit;
  try {
    const resultsPromise = Model.find({ removed: false })
      .skip(skip)
      .limit(limit)
      .sort({ created: "desc" })
      .populate("createdBy", "name");

    const countPromise = Model.countDocuments({ removed: false });
    const [result, count] = await Promise.all([resultsPromise, countPromise]);
    const pages = Math.ceil(count / limit);
    const pagination = { pahe, pages, count };
    if (count > 0) {
      return res.status(200).json({
        success: true,
        result,
        pagination,
        message: "Successfully found all documents",
      });
    } else {
      return res.status(203).json({
        success: false,
        result: [],
        message: error.message,
        error: error,
      });
    }
  } catch (error) {}
};

module.exports = paginatedList;
