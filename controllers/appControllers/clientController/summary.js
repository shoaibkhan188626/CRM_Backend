const mongoose = require('mongoose');
const momemnt = require('moment');
const Model = mongoose.model('Client');
const QuoteModel = mongoose.model('Quote');
const InvoiceModel = mongoose.model('Inovice');

const summary = async (req, res) => {
  try {
    let defaultType = 'month';
    const { type } = req.query;

    if (type && ['week', 'month', 'year'].includes(type)) {
      defaultType = type;
    } else if (type) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Invalid type',
      });
    }

    const currentDate = momemnt();
    let startDate = currentDate.clone().startOf(defaultType);
    let endDate = currentDate.clone().endOf(defaultType);

    const pipeline = [
      {
        $facet: {
          totalClients: [
            {
              $match: {
                removed: false,
                enabled: true,
              },
            },
            {
              $count: 'count',
            },
          ],
          newClients: [
            {
              $match: {
                removed: false,
                created: { $gte: startDate.toDate(), $lte: endDate.toDate() },
              },
            },
            {
              $count: 'count',
            },
          ],
          activeClients: [
            {
              $lookup: {
                from: QuoteModel.collection.name,
                localField: '_id',
                foreignField: 'client',
                as: 'quotes',
              },
            },
            {
              $match: {
                'quotes.removed': false,
              },
            },
            {
              $group: {
                _id: '$_id',
              },
            },
            {
              $count: 'count',
            },
          ],
        },
      },
    ];

    const aggregationResult = await Model.aggregate(pipeline);

    const result = aggregationResult[0];

    const totalClients = result.totalClients[0] ? result.totalClients[0].count : 0;

    const totalNewClients = result.newClients[0] ? result.newClients[0].count : 0;

    const activeClients = result.activeClients[0] ? result.activeClients[0] : 0;

    const totalActiveClientsPercentage =
      totalClients > 0 ? (activeClients / totalClients) * 100 : 0;

    const totalNewClientsPercentage = totalClients > 0 ? (totalNewClients / totalClients) * 100 : 0;

    return res.status(200).json({
      success: true,
      result: {
        new: Math.round(totalNewClientsPercentage),
        active: Math.round(totalActiveClientsPercentage),
      },
      message: 'Successfully get summary of new clients',
    });
  } catch (error) {
    console.error('error', error);
    return res.status(500).json({
      success: false,
      result: null,
      error: error.message,
      message: 'Oops there is an error',
    });
  }
};

module.exports = summary;
