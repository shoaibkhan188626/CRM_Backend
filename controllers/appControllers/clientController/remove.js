const mongoose = require('mongoose');
const Model = mongoose.model('Client');
const QuoteModel = mongoose.model('Quote');
const InvoiceModel = mongoose.model('Invoice');

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const quotes = await QuoteModel.findOne({
      client: id,
      removed: false,
    }).exec();

    if (quotes) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Cannot delete client if client have any quote or inovice',
      });
    }

    const invoice = await InvoiceModel.findOne({
      client: id,
      removed: false,
    }).exec();

    if (invoice) {
      return res.status(400).json({
        success: false,
        return: null,
        message: 'Cannot delete client if client have any quote or inovice',
      });
    }

    const result = await Model.findOneAndUpdate(
      { _id: id, removed: false },
      {
        $set: {
          remove: true,
        },
      }
    ).exec();

    if (!result) {
      return res.status(404).json({
        success: false,
        result: null,
        message: `No Client found by this id: ` + id,
      });
    }
    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully Deleted the client by id:' + id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
      error: error,
    });
  }
};

module.exports = remove;
