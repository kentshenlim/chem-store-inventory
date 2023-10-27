const mongoose = require('mongoose');

const { Schema } = mongoose;

// Stored properties
const chemicalSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  formula: {
    type: String,
    required: true,
  },
  casNo: {
    type: String,
    required: true,
    maxLength: 12,
  },
  mW: {
    type: Number,
    required: true,
    min: [0, 'Molecular weight cannot be negative'],
  },
  groups: [{
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  }],
});

// Virtuals
chemicalSchema.virtual('url').get(function () {
  return `/chemical/${this._id}`;
});

module.exports = mongoose.model('Chemical', chemicalSchema);
