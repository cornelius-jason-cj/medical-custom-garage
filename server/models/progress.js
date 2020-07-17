const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const progressSchema = new Schema({
  customerName: {
    type: String,
    required: true
  },
  notes: {
    type: Schema.Types.Mixed,
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

module.exports = mongoose.model('Progress', progressSchema)