const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  barcode: {
    type: String,
    required: true
  },
  itemName: {
    type: String,
    required: true
  },
  quantity: {
    type: String,
    required: true
  },
  purchasePrice: {
    type: String,
    required: true
  },
  sellingPrice: {
    type: String,
    required: true
  },
  profitPrice: {
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

module.exports = mongoose.model('Item', itemSchema)