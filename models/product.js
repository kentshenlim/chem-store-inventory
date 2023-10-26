const mongoose = require('mongoose');

const { Schema } = mongoose;

// Stored properties
const productSchema = new Schema({
  chemical: {
    type: Schema.Types.ObjectId,
    ref: 'Chemical',
    required: true,
  },
  productNo: {
    type: String,
    required: true,
    maxLength: [20, 'productNo cannot have more than 20 characters'],
  },
  description: {
    type: String,
    required: true,
    minLength: [3, 'description must have at least 3 characters'],
    maxLength: [200, 'description must not have more than 200 characters'],
  },
  numberInStock: {
    type: Number,
    default: 0,
  },
  packSize: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  added: {
    type: Date,
    default: new Date(),
  },
});

// Virtuals
productSchema.virtual('url').get(function () {
  return `/product/${this._id}`;
});

module.exports = mongoose.model('Product', productSchema);
