const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const TaxSchema = new mongoose.Schema({
  taxName: {
    type: String,
    required: true,
  },
  taxValue: {
    type: Number,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('Tax', TaxSchema);
