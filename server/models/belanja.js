const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profitSchema = new Schema({
  itemName: {
    type: String,
    required: true
  },
  purchasePrice: {
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

module.exports = mongoose.model('Belanja', profitSchema)