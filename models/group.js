const mongoose = require('mongoose');

const { Schema } = mongoose;

// Stored properties
const groupSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    minLength: [3, 'Description must have at least 3 characters'],
  },
  wikiUrl: {
    type: String,
    validate: {
      validator: (v) => (v === '' || v.startsWith('https')),
      message: () => 'wikiUrl must start with https://',
    },
  },
});

// Virtuals
groupSchema.virtual('url').get(function () {
  return `/group/${this._id}`;
});

module.exports = mongoose.model('Group', groupSchema);
