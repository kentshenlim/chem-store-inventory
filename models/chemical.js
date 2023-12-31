const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema } = mongoose;

// Stored properties
const chemicalSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxLength: [100, 'Name of chemical cannot have more than 100 characters'],
  },
  formula: {
    type: String,
    required: true,
    maxLength: [100, 'Chemical formula cannot have more than 100 characters'],
  },
  casNo: {
    type: String,
    required: true,
    maxLength: [12, 'CAS number cannot have more than 12 characters'],
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
  isProtected: {
    type: Boolean,
    default: false,
  },
});

// Virtuals
chemicalSchema.virtual('url').get(function () {
  return `/chemical/${this._id}`;
});

chemicalSchema.virtual('formulaFormatted').get(function () {
  const str = this.formula.replace(/(\d+)/g, '<sub>$1</sub>');
  return str;
});

// Plugin
chemicalSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Chemical', chemicalSchema);
