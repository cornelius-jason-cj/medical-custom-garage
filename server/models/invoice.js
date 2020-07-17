const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
  invoiceNumber:{
    type: String,
    require: true
  },
  total:{
    type: String,
    require: true
  },
  modal:{
    type: String,
    require: true
  },
  keuntungan: {
    type: String,
    require: true
  },
  paymentStatus:{
    type: String,
    default: 'Belum Lunas'
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

module.exports = mongoose.model('Invoice', invoiceSchema)