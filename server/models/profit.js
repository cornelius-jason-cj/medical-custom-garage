const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profitSchema = new Schema({
  profitAmount: {
    type: String,
    required: true
  },
  modalAmount: {
    type: String,
    required: true
  },
  belanjaTambahanAmount: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Profit', profitSchema)