const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const orderSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  orderId: {
    type: String,
    trim: true,
    required: true,
  },
  products: {
    type: String,
    trim: true,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered', 'cancelled'],
    required: true,
  },
  notes: {
    type: String,
    trim: true,
  },
});

module.exports = mongoose.model('Order', orderSchema);
