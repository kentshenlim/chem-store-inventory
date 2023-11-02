const mongoose = require('mongoose');
const formatDistanceToNow = require('date-fns/formatDistanceToNow');
const format = require('date-fns/format');
const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema } = mongoose;

// Stored properties
const productSchema = new Schema({
  chemical: {
    type: Schema.Types.ObjectId,
    ref: 'Chemical',
    required: true,
  },
  sku: {
    type: String,
    required: true,
    maxLength: [20, 'productNo cannot have more than 20 characters'],
    unique: true,
  },
  description: {
    type: String,
    required: true,
    minLength: [3, 'description must have at least 3 characters'],
    maxLength: [1000, 'description must not have more than 1000 characters'],
  },
  numberInStock: {
    type: Number,
    default: 0,
  },
  packSize: {
    type: String,
    default: 'NA',
    maxLength: [20, 'packSize must not have more than 20 characters'],
  },
  price: {
    type: String,
    default: 'NA',
    maxLength: [15, 'price must not have more than 15 characters'],
  },
  added: {
    type: Date,
    default: new Date(),
  },
  isProtected: {
    type: Boolean,
    default: false,
  },
});

// Virtuals
productSchema.virtual('url').get(function () {
  return `/product/${this._id}`;
});

productSchema.virtual('addedAgo').get(function () {
  return formatDistanceToNow(this.added);
});

productSchema.virtual('added_dd_mm_yyyy').get(function () {
  return format(this.added, 'dd/MM/yyyy');
});

// Plugin
productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Product', productSchema);
