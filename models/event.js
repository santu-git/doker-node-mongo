const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Event = new Schema({
  type: { type: String, required: true },
  timestamp: {type: Number, required: true},
  id: { type: String, required: true },
  domain: {type: String, required: true},
  attributes: [Schema.Types.Mixed],
  
});

module.exports = mongoose.model('Event', Event)