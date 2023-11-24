const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const bcrypt = require('bcryptjs');

const adminSchema = new Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
  },
  name: { type: String, required: true, lowercase: true },
  surname: { type: String, required: true, lowercase: true },
  photo: {
    type: String,
    trim: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: 'staff',
    enum: ['admin', 'staffAdmin', 'staff', 'createOnly', 'readOnly'],
  },
  isLoggedIn: { type: Number },
  loggedSession: {
    type: [String],
    default: [],
  },
});

adminSchema.plugin(require('mongoose-autopopulate'));

adminSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, this.password);
};

adminSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
